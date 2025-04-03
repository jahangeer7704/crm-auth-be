require('module-alias/register');
require("dotenv").config({path:'.env'})
const app = require("@/app")
const connectDB=require("@/utils/db/db")
const logger = require("@/utils/logger")
const PORT = process.env.PORT || 3001


async function startServer() {
    try {
      await connectDB();
      
      const server = app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
      });
      
      // Graceful shutdown
      process.on('SIGTERM', () => {
        logger.info('SIGTERM received. Shutting down gracefully...');
        server.close(() => {
          mongoose.connection.close(false, () => {
            logger.info('MongoDB connection closed');
            process.exit(0);
          });
        });
      });
      
    } catch (error) {
      logger.error(`Fatal startup error: ${error.message}`);
      process.exit(1);
    }
  }
  
  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
  });
  
  process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
    process.exit(1);
  });
  
  
  startServer();