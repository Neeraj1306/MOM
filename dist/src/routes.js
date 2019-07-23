"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("./modules/auth/auth.controller");
const cart_controller_1 = require("./modules/cart/cart.controller");
const category_controller_1 = require("./modules/category/category.controller");
const product_controller_1 = require("./modules/products/product.controller");
const user_controller_1 = require("./modules/user/user.controller");
function registerRoutes(app) {
    new user_controller_1.UserController().register(app);
    new auth_controller_1.AuthController().register(app);
    new category_controller_1.CategoryController().register(app);
    new product_controller_1.ProductController().register(app);
    new cart_controller_1.CartController().register(app);
}
exports.registerRoutes = registerRoutes;
