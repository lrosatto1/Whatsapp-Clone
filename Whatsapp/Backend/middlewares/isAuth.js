const UserModel = require("../models/usermodel");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const jwt = require("jsonwebtoken");

exports.isAuth = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  console.log(token, "token is valid");

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Por favor loggeate para acceder a esta ruta",
    });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await UserModel.findById(decoded.id);
  next();
});
