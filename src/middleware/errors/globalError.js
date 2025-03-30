const ApiError = require('@/utils/errors/ApiError');
const Logger = require('@/utils/logger');
const DbError = require('@/utils/errors/DbError');
 const globalError = (err, req, res, next) => {
    if (err instanceof ApiError) {
        Logger.error(`ApiError: ${err.status} - ${err.message}`);
        return res.status(err.status).json({ message: err.message });
    }
    else if (err instanceof DbError) {
        Logger.error(`DbError: ${err.message}`);
        return res.status(500).json({ message: 'Database error' });
    }
    else {
        Logger.error(`GlobalError: ${err.message}`);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
module.exports = globalError;