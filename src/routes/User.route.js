const express = require("express");
const {createUser,loginUser}= require("@/controllers/User.controller")
class UserRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/login", loginUser);
        this.router.post("/create", createUser);
    }

    getRouter() {
        return this.router;
    }
}



module.exports = new UserRoutes().getRouter();
