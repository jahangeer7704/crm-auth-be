const mongoose = require('mongoose');
const Logger = require('../logger');
const URI = process.env.MONGO_URI;
const DbError = require('../../utils/errors/DbError');
const connectDB = async () => {
    try {
       
        await mongoose.connect(URI);
        Logger.info('MongoDB connected');
    } catch (err) {
        Logger.error(err.message);

        throw new DbError("Connection with db error")
    }
}
module.exports = connectDB;


