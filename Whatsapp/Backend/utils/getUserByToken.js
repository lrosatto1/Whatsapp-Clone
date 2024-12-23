const jwt = require('jsonwebtoken');
const UserModel = require('../models/usermodel');

const getUserByToken = async(token) => {
    if (!token) {
        return {
            message: "Token expirado",
            logout: true,
        };
}
else {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decodedData.id);
    return user;
}
};

module.exports = getUserByToken;
