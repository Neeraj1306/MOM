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
const shortid = require("shortid");
const BaseController_1 = require("../BaseController");
const helpers_1 = require("./../../helpers");
const user_lib_1 = require("./../user/user.lib");
const user_rules_1 = require("./../user/user.rules");
var OTP = null;
class AuthController extends BaseController_1.BaseController {
    constructor() {
        super();
        this.init();
    }
    register(app) {
        app.use("/api/auth", this.router);
    }
    init() {
        const authHelper = new helpers_1.AuthHelper();
        this.router.post("/sign-up", user_rules_1.userRules.forSignUser, authHelper.validation, this.signUp);
        this.router.post("/login", user_rules_1.userRules.forSignIn, authHelper.validation, this.login);
        this.router.post("/forgot-password", this.forgotPassword);
        this.router.post("/reset-password", user_rules_1.userRules.forResetPassword, authHelper.validation, this.resetPassword);
    }
    signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = new user_lib_1.UserLib();
                const userData = req.body;
                const password = req.body.password;
                const email = req.body.email;
                const userEmail = yield user.getUserByEmail(email);
                console.log("password", password);
                if (userEmail) {
                    throw new Error("Email already exist");
                }
                else {
                    const userResult = yield user.saveUser(userData);
                    const loggedInUser = yield user.loginUserAndCreateToken(email, password);
                    res.locals.data = loggedInUser;
                    helpers_1.ResponseHandler.JSONSUCCESS(req, res);
                }
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, "addUser");
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = new user_lib_1.UserLib();
                const { email, password } = req.body;
                console.log("password", password);
                const loggedInUser = yield user.loginUserAndCreateToken(email, password);
                res.locals.data = loggedInUser;
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                res.locals.errorCode = 401;
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, "login");
            }
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                OTP = shortid.generate();
                const user = new user_lib_1.UserLib();
                const mailer = new helpers_1.EmailServer();
                const utils = new helpers_1.Utils();
                const email = req.body.email ? req.body.email : null;
                const tmpForgotPassCode = yield utils.getToken();
                const userData = yield user.getUserByEmail(email);
                console.log("userData", userData);
                if (userData) {
                    yield user.updateUser(userData._id, {
                        tmp_forgot_pass_code: tmpForgotPassCode,
                        tmp_forgot_pass_code_Expires: Date.now() + 300000
                    });
                    console.log("otp1", OTP);
                    const options = {
                        subject: "Forgot Password",
                        templateName: "password-reset",
                        to: userData.email,
                        replace: {
                            code: OTP
                        }
                    };
                    helpers_1.ResponseHandler.JSONSUCCESS(req, res);
                    yield mailer.sendEmail(options);
                }
                else {
                    throw new Error("email is not valid");
                }
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, "forgotPassword");
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = new user_lib_1.UserLib();
                const email = req.body.email ? req.body.email : null;
                console.log("5 min after", Date.now() + 300000);
                console.log("now", Date.now());
                const userData = yield user.getUserIfLinkNotExpired(email);
                if (userData) {
                    if (OTP == req.body.otp) {
                        yield user.updateUser(userData._id, {
                            tmp_forgot_pass_code: null,
                            tmp_forgot_pass_code_Expires: null,
                            password: yield user.generateHash(req.body.password)
                        });
                        helpers_1.ResponseHandler.JSONSUCCESS(req, res);
                    }
                    else {
                        throw new Error("Incorrect OTP");
                    }
                }
                else {
                    throw new Error("link expired");
                }
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, "resetPassword");
            }
        });
    }
}
exports.AuthController = AuthController;
