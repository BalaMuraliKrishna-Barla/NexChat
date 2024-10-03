const mongoose = require('mongoose')
const colors = require('colors')

const connectDB = async() => {
    try {
        const clientLocal = await mongoose.connect(process.env.LOCAL_MONGO_URI)
        console.log(`LOCAL MongoDB connected : ${clientLocal.connection.host}`.blue.bold);

        // const clientGlobal = await mongoose.connect(process.env.GLOBAL_MONGO_URI)
        // console.log(`GLOBALMongoDB connected : ${clientGlobal.connection.host}`.green.bold);
    } catch (error) {
        console.log(`Mongo Connection Error : ${error.message}`.red.underline);
        process.exit();
    }
}

module.exports = connectDB;
