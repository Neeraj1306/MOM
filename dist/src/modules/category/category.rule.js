"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_1 = require("express-validator/check");
exports.categoryRule = {
    forAdd: [
        check_1.check('name')
            .not()
            .isEmpty()
            .withMessage('Category name is required'),
    ],
};
