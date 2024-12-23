const {connect} = require('mongoose');

async function connectDB(){
    connect(process.env.MONGODB_URL).then((data) => {
        console.log(`MongoDB conectado con el servidor ${data.connection.host}` );
});
}

module.exports = connectDB;