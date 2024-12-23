const express = require('express');
const { registerUser, login, logout, userDetails, updateUser, searchUser } = require('../controllers/userController');
const { isAuth } = require('../middlewares/isAuth');
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route('/userDetails').put(isAuth, userDetails)
router.route("/updateUser").put(updateUser);
router.route("/searchUser").post(searchUser);


module.exports = router;