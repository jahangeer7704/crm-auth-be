const express = require('express');
const logger = require('@/utils/logger');
const gloabalError = require('@/middleware/errors/globalError')
const app = express();
const userRouter = require("@/routes/User.route")
app.use(express.json());



app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);

    next();
});


app.use("/api/auth", userRouter)



app.use(gloabalError)
module.exports = app;
