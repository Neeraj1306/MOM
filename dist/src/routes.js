"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("./modules/auth/auth.controller");
const user_controller_1 = require("./modules/user/user.controller");
function registerRoutes(app) {
    new user_controller_1.UserController().register(app);
    new auth_controller_1.AuthController().register(app);
}
exports.registerRoutes = registerRoutes;
