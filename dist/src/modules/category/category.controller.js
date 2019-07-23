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
const helpers_1 = require("../../helpers");
const BaseController_1 = require("../BaseController");
const category_lib_1 = require("./category.lib");
const category_rule_1 = require("./category.rule");
class CategoryController extends BaseController_1.BaseController {
    constructor() {
        super();
        this.init();
    }
    register(app) {
        app.use('/api/categories', this.router);
    }
    init() {
        const authHelper = new helpers_1.AuthHelper();
        this.router.get('/dashboard-products', this.getHomeList);
        this.router.get('/', this.listCategories);
        this.router.get('/:id', this.getCategory);
        this.router.put('/:id', authHelper.guard, this.updateCategory);
        this.router.delete('/:id', authHelper.guard, this.deleteCategory);
        this.router.post('/', authHelper.guard, category_rule_1.categoryRule.forAdd, authHelper.validation, this.addCategory);
    }
    listCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryLib = new category_lib_1.CategoryLib();
                const categories = yield categoryLib.getAllCategories();
                res.locals.data = categories;
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, 'listCategories');
            }
        });
    }
    getCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryLib = new category_lib_1.CategoryLib();
                const category = yield categoryLib.getCategoryById(req.params.id);
                if (!category) {
                    throw Error('Invalid category id passed');
                }
                res.locals.data = category;
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, 'listCategories');
            }
        });
    }
    addCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryLib = new category_lib_1.CategoryLib();
                const category = yield categoryLib.addCategory(req.body);
                res.locals.data = category;
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, 'listCategories');
            }
        });
    }
    getHomeList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryLib = new category_lib_1.CategoryLib();
                const categoryProducts = yield categoryLib.getCategoryWiseProduct();
                res.locals.data = categoryProducts;
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, 'getProducts');
            }
        });
    }
    updateCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const id = req.params.id;
            try {
                const category = yield new category_lib_1.CategoryLib().findByIdAndUpdate(id, body);
                res.locals.data = category;
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, 'updateCategory');
            }
        });
    }
    deleteCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const data = { isDelete: true };
                const deletedCategory = yield new category_lib_1.CategoryLib().findByIdAndUpdate(id, data);
                res.locals.data = deletedCategory;
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, 'deleteCategory');
            }
        });
    }
}
exports.CategoryController = CategoryController;
