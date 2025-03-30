require('module-alias/register');
require("dotenv").config({path:'./src/utils/.env'})
const app = require("@/app")
const logger = require("@/utils/logger")
const PORT = process.env.PORT || 3001
logger.info('Starting server...')
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
})
