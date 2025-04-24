import morgan from 'morgan';
import { appLogger } from './appLogger.js';
const stream = {
    write: (message: string) => {
        appLogger.http(`http`, message.trim());
    },
};

const skip = () => {
    return process.env.NODE_ENV !== 'development';
};

export const morganMiddleware = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    { stream, skip }
);