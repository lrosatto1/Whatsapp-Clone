const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const userModel = require("../models/usermodel");
const bcrypt = require("bcrypt");
const sendToken = require("../utils/sendToken");

// register user
exports.registerUser = catchAsyncErrors(async (req, res) => {
  const { name, email, password, profilePicture } = req.body;

  // Verificar si el correo electrónico ya está registrado
  const checkEmail = await userModel.findOne({ email });

  if (checkEmail) {
    return res.status(400).json({
      success: false,
      message: "El correo electrónico ya está registrado",
    });
  }

  // Encriptar la contraseña
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Crear un nuevo usuario
  const user = await userModel.create({
    name,
    email,
    password: hashedPassword,
    profilePicture,
  });

  if (user) {
    return res.status(201).json({
      success: true,
      message: "Usuario creado con éxito",
      user,
    });
  }
});

// login user

exports.login = catchAsyncErrors(async (req, res) => {
  const { email, password } = req.body;

  // Verificar si el correo electrónico y la contraseña son correctos
  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "usuario no encontrado",
    });
  }

  const verifyPassword = await bcrypt.compare(password, user.password);

  if (!verifyPassword) {
    return res.status(400).json({
      success: false,
      message: "Contraseña incorrecta",
    });
  }

  sendToken(user, 201, res);
});

exports.logout = catchAsyncErrors(async (req, res) => {
  const cookieOptions = {
    http: true,
    secure: true,
    sameSite: "None",
    expires: new Date(Date.now()),
  };

  return res.cookie("token", "", cookieOptions).status(200).json({
    success: true,
    message: "Cierre de sesión exitoso",
  });
});

// Detalles de usuario

exports.userDetails = catchAsyncErrors(async (req, res) => {
  const user = req.user;

  return res.status(200).json({
    message: "Detalles del usuario",
    success: true,
    user,
  });
});

// Actualizar Usuarios

exports.updateUser = catchAsyncErrors(async (req, res) => {
  const { userId, name, profilePicture } = req.body;

  const updateUser = await userModel.updateOne(
    { _id: userId },
    { name, profilePicture }
  );

  if (updateuser?.modifiedCount == 1) {
    const user = await userModel.findById(userId);
    return res.status(200).json({
      success: true,
      message: "Usuario actualizado con éxito",
      user,
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "Usuario no actualizado",
    });
  }
});

// Search Users

exports.searchUser = catchAsyncErrors(async (req, res) => {
  const { search } = req.body;

  const query = new RegExp(search, "i", "g");
  const users = await userModel.find({ $or: [{ name: query }, { email: query }],
   });

  return res.status(200).json({
    success: true,
    message: "Resultados de la busqueda",
    users,
  });
});
