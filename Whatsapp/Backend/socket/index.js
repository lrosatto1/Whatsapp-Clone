const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const UserModel = require("../models/usermodel");
const MessageModel = require("../models/messageModel");
const ConversationModel = require("../models/conversationModel");
const getUserByToken = require("../utils/getUserByToken");
const getConversation = require("../utils/getConversation");
const app = express();

// Socket Connection
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL, credentials: true },
});

// Online users set
const onlineUsers = new Set();

io.on("connection", async (socket) => {
  // Obtener el token de la conexión
  const token = socket.handshake.auth.token;
  console.log(token, "token");

  // Verificar usuario a través del token
  const user = await getUserByToken(token);

  if (user) {
    // Unirse a la sala del usuario
    socket.join(user?._id?.toString());
    onlineUsers.add(user?._id?.toString());

    // Emitir la lista de usuarios en línea
    io.emit("onlineUsers", Array.from(onlineUsers));

    // Página de mensajes (Recupera detalles del usuario y mensajes)
    socket.on("MessagePage", async (userId) => {
      try {
        const userdetails = await UserModel.findById(userId);

        const data = {
          _id: userdetails?._id,
          name: userdetails?.name,
          email: userdetails?.email,
          profilePicture: userdetails?.profilePicture,
          online: onlineUsers.has(userId),
        };

        socket.emit("messageUser", data);

        // Obtener mensajes antiguos
        const getConversationMessages = await ConversationModel.findOne({
          $or: [
            { sender: user?._id, receiver: userId },
            { sender: userId, receiver: user?._id },
          ],
        })
          .populate("messages")
          .sort({ updatedAt: -1 });

        socket.emit("message", getConversationMessages?.messages || []);
      } catch (error) {
        console.error("Error al obtener la página de mensajes:", error);
      }
    });

    // Nuevo mensaje
    socket.on("newMessage", async (data) => {
      try {
        let conversation = await ConversationModel.findOne({
          $or: [
            { sender: data?.sender, receiver: data?.receiver },
            { sender: data?.receiver, receiver: data?.sender },
          ],
        });

        // Si no existe la conversación, crear una nueva
        if (!conversation) {
          conversation = await ConversationModel.create({
            sender: data?.sender,
            receiver: data?.receiver,
          });
        }

        // Crear el mensaje
        const message = await MessageModel.create({
          text: data?.text,
          imageUrl: data?.imageUrl,
          videoURL: data?.videoURL,
          audio: data?.audio,
        });

        if (message) {
          // Agregar el mensaje a la conversación
          await ConversationModel.updateOne(
            { _id: conversation?._id },
            {
              $push: { messages: message?._id },
            }
          );

          // Recuperar la conversación actualizada
          const getUpdatedConversation = await ConversationModel.findOne({
            $or: [
              { sender: data?.sender, receiver: data?.receiver },
              { sender: data?.receiver, receiver: data?.sender },
            ],
          })
            .populate("messages")
            .sort({ updatedAt: -1 });

          // Emitir el mensaje a los usuarios correspondientes
          io.to(data?.sender).emit("message", getUpdatedConversation?.messages || []);
          io.to(data?.receiver).emit("message", getUpdatedConversation?.messages || []);

          // Enviar la conversación actualizada
          const sendConversation = await getConversation(data?.sender);
          const receiveConversation = await getConversation(data?.receiver);

          io.to(data?.sender).emit("conversation", sendConversation);
          io.to(data?.receiver).emit("conversation", receiveConversation);
        }
      } catch (error) {
        console.error("Error al enviar nuevo mensaje:", error);
      }
    });

    // Barra lateral de conversaciones
    socket.on("sidebar", async (userId) => {
      try {
        const conversation = await getConversation(userId);
        socket.emit("conversation", conversation);
      } catch (error) {
        console.error("Error al obtener la barra lateral de conversaciones:", error);
      }
    });

    // Marcar mensajes como vistos
    socket.on("seen", async (messageByUser) => {
      try {
        let conversation = await ConversationModel.findOne({
          $or: [
            { sender: user?._id, receiver: messageByUser },
            { sender: messageByUser, receiver: user?._id },
          ],
        }).populate("messages");

        // Actualizar mensajes como vistos
        await MessageModel?.updateMany(
          { _id: { $in: conversation?.messages }, messageByUser },
          {
            $set: { seen: true },
          }
        );

        // Enviar las conversaciones actualizadas
        const sendConversation = await getConversation(user?._id);
        const receiveConversation = await getConversation(messageByUser);

        io.to(user?._id?.toString()).emit("conversation", sendConversation);
        io.to(messageByUser).emit("conversation", receiveConversation);
      } catch (error) {
        console.error("Error al marcar los mensajes como vistos:", error);
      }
    });
  } else {
    console.log("Usuario no encontrado o token inválido");
  }

  // Desconexión del socket
  socket.on("disconnect", () => {
    if (user?._id) {
      onlineUsers?.delete(user?._id?.toString());
      io.emit("onlineUsers", Array.from(onlineUsers));
    }
  });
});

// Exportar app y server
module.exports = { app, server };
