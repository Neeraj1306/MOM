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
const BaseController_1 = require("../BaseController");
const helpers_1 = require("./../../helpers");
const logger_1 = require("./../../logger");
const user_lib_1 = require("./user.lib");
const user_rules_1 = require("./user.rules");
class UserController extends BaseController_1.BaseController {
    constructor() {
        super();
        this.init();
    }
    init() {
        const authHelper = new helpers_1.AuthHelper();
        this.router.get('/', authHelper.guard, this.getUsers);
        this.router.get('/:id', authHelper.guard, this.getUserById);
        this.router.put('/:id', authHelper.guard, user_rules_1.userRules.forUpdateUser, authHelper.validation, this.updateUser);
        this.router.delete('/:id', this.deleteUser);
    }
    register(app) {
        app.use('/api/users', this.router);
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const utils = new helpers_1.Utils();
                const filters = {};
                const select = '-password';
                const options = {
                    page: req.query.page ? Number(req.query.page) : 1,
                    limit: req.query.limit ? Number(req.query.limit) : 2,
                };
                const user = new user_lib_1.UserLib();
                const users = yield user.getUsers(filters, select, options);
                res.locals.data = users.docs;
                res.locals.pagination = utils.getPaginateResponse(users);
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, 'getUsers');
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = new user_lib_1.UserLib();
                const userDetails = yield user.getUserById(req.params.id);
                res.locals.data = userDetails;
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, 'getUserById');
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params && req.params.id;
                if (userId !== req.body.loggedinUserId) {
                    throw new Error('You are not owner to update details');
                }
                const userData = req.body;
                delete userData.password;
                const user = new user_lib_1.UserLib();
                const updatedUserResult = yield user.updateUser(userId, userData);
                logger_1.logger.info('user updated');
                res.locals.data = updatedUserResult;
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, 'updateUser');
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                throw new Error('Not Allowed now');
                const user = new user_lib_1.UserLib();
                logger_1.logger.info(`id ${req.params.id}`);
                logger_1.logger.info('delete');
                const deletedUser = user.deleteUser(req.params.id);
                res.locals.data = deletedUser;
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, 'deleteUser');
            }
        });
    }
}
exports.UserController = UserController;
