const express = require('express');
const logger = require('@/utils/logger');
const gloabalError = require('@/middleware/errors/globalError')
const connectDB = require('@/utils/db/db');
const asyncValidation = require("@/middleware/errors/asyncValidation")
const URI = process.env.MONGO_URI;
connectDB(URI);
const app = express();
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
});
app.use(express.json());
app.use(gloabalError)
module.exports = app;
