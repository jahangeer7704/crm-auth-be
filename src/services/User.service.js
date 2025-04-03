const userSchema = require("@/models/userSchema")
const DbError = require("@/utils/errors/DbError")
const logger = require("@/utils/logger")
const ApiError=require("@/utils/errors/ApiError")
class UserService {
    async registerUser(user) {
        try {
            logger.info("Attempting to register user");
            const createdUser = await userSchema.create(user);
            logger.info("User registered successfully");
            return { message: "User created successfully", user: createdUser };
        } catch (error) {
            logger.error(`Error registering user: ${error.name} ${error.message}`);
            if (error.name === 'ValidationError') {
                throw new ApiError(400, error.message); 
            }
            if (error.name === 'MongoServerError') {
                throw new ApiError(400, error.message); 
            }
            
            throw new DbError("Database operation failed");
        }
    }

    authenticateUser(credentials) {
        try {
            logger.info("Attempting to authenticate user");
            // Authentication logic goes here
        } catch (error) {
            logger.error(`Error authenticating user: ${error.message}`);
            throw new DbError("Failed to authenticate user", error);
        }
    }
}

module.exports = {
    registerUser: new UserService().registerUser,
    authenticateUser: new UserService().authenticateUser
};
