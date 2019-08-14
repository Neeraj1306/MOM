"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const check_1 = require("express-validator/check");
const HttpStatus = require("http-status-codes");
const jwt = require("jsonwebtoken");
const messages_1 = require("./../constants/messages");
const response_handler_1 = require("./response.handler");
class AuthHelper {
    validation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = check_1.validationResult(req);
                if (!errors.isEmpty()) {
                    res.locals.data = errors.array();
                    throw new Error("ValidationError");
                }
                else {
                    next();
                }
            }
            catch (err) {
                res.locals.data.message = res.locals.data[0].msg
                    ? `${err.message}: ${res.locals.data[0].msg}`
                    : `${err.message}`;
                res.locals.details = err;
                res.locals.name = "ValidationError";
                response_handler_1.ResponseHandler.JSONERROR(req, res, "validation");
            }
        });
    }
    guard(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.authorization || req.query.token;
                if (token) {
                    const auth = jwt.verify(token, process.env.SECRET);
                    if (auth) {
                        req.body.loggedinUserId = auth.id;
                        req.body.userName = auth.userName;
                        console.log("auth", auth);
                        next();
                    }
                    else {
                        throw new Error(messages_1.Messages.INVALID_CREDENTIALS);
                    }
                }
                else {
                    throw new Error(messages_1.Messages.INVALID_CREDENTIALS);
                }
            }
            catch (err) {
                res.locals.data = err;
                res.locals.message = "AuthenticationError";
                res.locals.statusCode = HttpStatus.UNAUTHORIZED;
                response_handler_1.ResponseHandler.JSONERROR(req, res, "Authorization");
            }
        });
    }
    adminGuard(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.authorization || req.query.token;
                if (token) {
                    const auth = jwt.verify(token, process.env.SECRET);
                    console.log("role", auth.role.toLowerCase());
                    if (auth.role.toLowerCase() === "scrummaster") {
                        req.body.loggedinUserId = auth.id;
                        req.body.userName = auth.userName;
                        console.log("auth", auth);
                        next();
                    }
                    else {
                        throw new Error(messages_1.Messages.UNAUTHORIZED_USER);
                    }
                }
                else {
                    throw new Error(messages_1.Messages.UNAUTHORIZED_USER);
                }
            }
            catch (err) {
                res.locals.data = err;
                res.locals.message = "AuthenticationError";
                res.locals.statusCode = HttpStatus.UNAUTHORIZED;
                response_handler_1.ResponseHandler.JSONERROR(req, res, "admingGuard");
            }
        });
    }
}
exports.AuthHelper = AuthHelper;
