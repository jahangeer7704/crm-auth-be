const ApiError = require("@/utils/errors/ApiError")
const logger = require("@/utils/logger")
const { registerUser, authenticateUser } = require("@/services/User.service")
class UserController {
    loginUser(req, res,next) {
        try {
            logger.info("Login user request received");
            authenticateUser();
            logger.info("User authenticated successfully");
        } catch (error) {
            logger.error(`Error during login: ${error.message}`);
            
        }
    }
    async createUser(req, res,next) {
        try {
            logger.info("Create user request received");
            const response = await registerUser(req.body);
            logger.info("User created successfully");
            res.status(200).json({
                status: 'success',
                message: response.message,
                data: response.user
            });
        } catch (error) {
            next(error)
            
        }
    }
}
const userInstance = new UserController()
module.exports = {
    loginUser: userInstance.loginUser,
    createUser: userInstance.createUser
}