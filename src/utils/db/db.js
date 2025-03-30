const mongoose = require('mongoose');
const Logger = require('../logger');
const DbError= require('../../utils/errors/DbError');
 const connectDB = async (URI) => {
    console.log(URI);
    
    try {
        await mongoose.connect(URI);
        Logger.info('MongoDB connected');
    } catch (err) {
        Logger.error(err.message);
        throw new DbError('Database connection error');
    }
}
module.exports = connectDB;