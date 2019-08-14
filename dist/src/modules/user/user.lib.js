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
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const constants_1 = require("./../../constants");
const user_model_1 = require("./user.model");
class UserLib {
    generateHash(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcrypt.hashSync(password, 10);
        });
    }
    comparePassword(password, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcrypt.compareSync(password, hash);
        });
    }
    getUsers(filters, projection, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.userModel.paginate(filters, options);
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.userModel.findById(id);
        });
    }
    saveUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            userData.password = yield this.generateHash(userData.password);
            const userObj = new user_model_1.userModel(userData);
            return userObj.save();
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.userModel.findOne({ email: email }, "+password");
        });
    }
    getUserIfLinkNotExpired(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.userModel.findOne({
                email: email,
                tmp_forgot_pass_code_Expires: { $gt: new Date(Date.now()) }
            });
        });
    }
    updateUser(userId, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.userModel.findById(userId);
            user.set(userData);
            return user.save();
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.userModel.findOneAndDelete({ _id: id });
        });
    }
    loginUserAndCreateToken(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.getUserByEmail(email);
            user = JSON.parse(JSON.stringify(user));
            console.log("user", user);
            if (user !== null) {
                const isValidPass = yield this.comparePassword(password, user.password);
                if (isValidPass) {
                    const token = jwt.sign({ id: user._id, role: user.role, userName: user.name }, process.env.SECRET, {
                        expiresIn: "365d"
                    });
                    user.password = undefined;
                    return { user, token };
                }
                else {
                    throw new Error(constants_1.Messages.INVALID_CREDENTIALS);
                }
            }
            else {
                throw new Error(constants_1.Messages.INVALID_CREDENTIALS);
            }
        });
    }
}
exports.UserLib = UserLib;
