const ApiError = require('@/utils/errors/ApiError');
const Logger = require('@/utils/logger');
const DbError = require('@/utils/errors/DbError');
const globalError = (err, req, res, next) => {
    // Known errors
    if (err instanceof ApiError) {
        Logger.error(`ApiError: ${err.status} - ${err.message}`);
        return res.status(err.status).json({ 
            status: 'error',
            message: err.message 
        });
    }
    
    // Database errors
    if (err instanceof DbError) {
        Logger.error(`DbError: ${err.message}`);
        return res.status(500).json({
            status: 'error',
            message: 'Database operation failed'
        });
    }

    // Mongoose validation errors (caught directly)
    if (err.name === 'ValidationError') {
        Logger.error(`ValidationError: ${err.message}`);
        return res.status(400).json({
            status: 'fail',
            message: err.message,
            errors: Object.values(err.errors).map(e => e.message)
        });
    }

    // Unexpected errors
    Logger.error(`Unhandled Error: ${err.stack}`);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
};
module.exports=globalError