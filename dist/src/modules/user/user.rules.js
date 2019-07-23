"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_1 = require("express-validator/check");
exports.userRules = {
    forSignIn: [
        check_1.check('email')
            .not()
            .isEmpty()
            .withMessage('Please enter email address')
            .isEmail()
            .withMessage('Invalid email address'),
        check_1.check('password')
            .not()
            .isEmpty()
            .withMessage('Please enter password')
            .isLength({ min: 8 })
            .withMessage('Password should be greater than 8 char'),
    ],
    forSignUser: [
        check_1.check('email')
            .not()
            .isEmpty()
            .withMessage('Please enter email address')
            .isEmail()
            .withMessage('Invalid email address'),
        check_1.check('password')
            .not()
            .isEmpty()
            .withMessage('Please enter password')
            .isLength({ min: 8 })
            .withMessage('Password should be greater than 8 char'),
        check_1.check('confirm_password')
            .not()
            .isEmpty()
            .withMessage('Please enter confirm password')
            .custom((value, options) => value === options.req.body.password)
            .withMessage('Password and Confirm password are not same.'),
        check_1.check('first_name')
            .not()
            .isEmpty()
            .withMessage('Please enter first name'),
        // check_1.check('gender')
        //     .not()
        //     .isEmpty()
        //     .withMessage('Please select gender'),
    ],
    forUpdateUser: [
        check_1.check('email')
            .not()
            .isEmpty()
            .withMessage('Please enter email address')
            .isEmail()
            .withMessage('Invalid email address'),
    ],
};
