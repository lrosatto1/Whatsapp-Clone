import React, { useEffect, useState } from "react";
import { GetSocket } from "../utils/SocketProvider";
import {
  ArrowUpLeft,
  EllipsisVertical,
  LogOut,
  MessageCircle,
  SquarePlus,
  UserPlus,
} from "lucide-react";
import Avatar from "./Avatar";
import { useLocalStorage } from "@mantine/hooks";
import { Link, useNavigate } from "react-router-dom";
import AddUser from "./AddUser";

const Sidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useLocalStorage({
    key: "userData",
    defaultValue: {},
  });
  const socket = GetSocket();
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.emit("sidebar", user?._id);
      socket.on("conversation", (data) => {
        const conversationUserData = data?.map((convUser) => ({
          ...convUser,
          userDetails:
            convUser?.sender?._id === user?._id
              ? convUser?.receiver
              : convUser?.sender,
        }));
        setAllUsers(conversationUserData);
      });
    }
  }, [socket, user]);

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  return (
    <div className="flex flex-col md:flex-row bg-[#FCFCFC]">
      <div className={`w-full ${chatOpen ? "h-screen" : "md:w-[80px] lg:w-[80px]"} bg-[#F0F0F0] py-4 flex flex-col justify-between items-center shadow-lg`}>
        <div className="flex flex-col justify-between items-center gap-12 h-full">
          {/* Icono de chat */}
          <div 
            onClick={toggleChat}
            className="w-32 h-32 flex justify-center items-center cursor-pointer text-[#8A8A8A] hover:text-black text-6xl"
          >
            <MessageCircle />
          </div>

          {/* Icono de agregar usuario */}
          <div
            title="Add new contact"
            onClick={() => setOpenSearchUser(true)}
            className="w-32 h-32 flex justify-center items-center cursor-pointer text-[#8A8A8A] hover:text-black text-6xl"
          >
            <UserPlus />
          </div>

          {/* Icono de logout */}
          <div
            onClick={handleLogout}
            className="w-32 h-32 flex justify-center items-center cursor-pointer text-[#8A8A8A] hover:text-black text-6xl"
          >
            <LogOut />
          </div>

          {/* Foto de perfil como el cuarto ícono */}
          <div
            onClick={() => navigate(`/profile/${user?._id}`)}
            className="w-32 h-32 rounded-full overflow-hidden flex justify-center items-center cursor-pointer"
          >
            <img 
              src={user?.profilePicture || "/default-avatar.png"} 
              alt="User Profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Ventana de chat a pantalla completa */}
      {chatOpen && (
        <div className="w-full h-screen bg-[#FAFAFA] overflow-y-auto shadow-lg">
          <div className="flex flex-col p-4 bg-[#F5F5F5] rounded-lg shadow-md space-y-4 h-full">
            <div className="flex justify-between items-center text-[#666]">
              <h2 className="text-sm font-semibold">Chats</h2>
              <div className="flex gap-4 text-gray-400">
                <SquarePlus size={30} className="cursor-pointer" />
                <EllipsisVertical size={30} className="cursor-pointer" />
              </div>
            </div>

            <div className="h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar">
              {allUsers.length > 0 ? (
                allUsers.map((conv) => (
                  <Link
                    to={`/chat/${conv?.userDetails?._id}`}
                    key={conv?._id}
                    className="flex items-center gap-4 border border-transparent hover:border-gray-300 rounded-lg p-4 cursor-pointer"
                  >
                    <Avatar
                      imageUrl={conv?.userDetails?.profilePicture}
                      name={conv?.userDetails?.name}
                    />
                    <div>
                      <h3 className="text-gray-600 font-semibold text-sm">
                        {conv?.userDetails?.name}
                      </h3>
                      <p className="text-ellipsis line-clamp-1">
                        {conv?.lastMsg?.text}
                      </p>
                      {Boolean(conv?.unseenMessage) && (
                        <p
                          className="text-xs w-6 h-6 flex justify-center items-center
                          text-white bg-[#FF0000] rounded-full ml-auto p-1 font-semibold"
                        >
                          {conv?.unseenMessage}
                        </p>
                      )}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="mt-12">
                  <div className="flex justify-center items-center my-4 text-gray-500">
                    <ArrowUpLeft size={50} className="text-gray-400" />
                  </div>
                  <p className="text-center text-lg font-semibold text-gray-500">
                    Agregar un nuevo contacto
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {openSearchUser && <AddUser setOpenSearchUser={setOpenSearchUser} />}
    </div>
  );
};

export default Sidebar;

