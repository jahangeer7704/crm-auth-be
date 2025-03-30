const { createLogger, format, transports } = require("winston");
const path = require('path');
const logFormat = format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.colorize(),
    format.json(),
    format.printf(({ level, message, timestamp }) => {
        return `[${timestamp}] ${level}: ${message}`;
    })
);

// Create the logger
const logger = createLogger({
    level: "info", 
    format: logFormat,
    defaultMeta: { service: "crm-auth-be" },
    transports: [
        new transports.Console(
            {
                format: format.combine(format.colorize(), format.json(), format.simple())
            }
        ),
        new transports.File({ filename: path.join(__dirname, 'logs/error.log'), level: "error" , format: format.combine(format.timestamp(), format.json())}),
        new transports.File({ filename: path.join(__dirname, 'logs/combined.log'), format: format.combine(format.timestamp(), format.json()) }),
    ],
});
module.exports = logger;



