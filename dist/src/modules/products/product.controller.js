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
const category_lib_1 = require("./../category/category.lib");
const product_lib_1 = require("./product.lib");
class ProductController extends BaseController_1.BaseController {
    constructor() {
        super();
        this.init();
    }
    register(app) {
        app.use('/api/products', this.router);
    }
    init() {
        const authHelper = new helpers_1.AuthHelper();
        this.router.get('/byCategoryId/:id', this.getProductsByCategoryId);
        this.router.get('/home-list', this.getHomeList);
        this.router.get('/:id/details', this.getDetails);
        this.router.get('/', authHelper.guard, this.getProducts);
        this.router.put('/:id', authHelper.guard, this.updateProduct);
        this.router.delete('/:id', authHelper.guard, this.deleteProduct);
        this.router.post('/', authHelper.guard, authHelper.validation, this.addProduct);
    }
    getProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const utils = new helpers_1.Utils();
                const filters = {};
                if (req.query && req.query.brand) {
                    filters.brand = req.query.brand;
                }
                const options = {
                    page: req.query.page ? Number(req.query.page) : 1,
                    limit: req.query.limit ? Number(req.query.limit) : 10,
                };
                const user = new product_lib_1.ProductLib();
                const users = yield user.getProduct(filters, options);
                res.locals.data = users.docs;
                res.locals.pagination = utils.getPaginateResponse(users);
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, 'getProducts');
            }
        });
    }
    addProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productLib = new product_lib_1.ProductLib();
                res.locals.data = yield productLib.addProduct(req.body);
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, 'addProduct');
            }
        });
    }
    getHomeList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryLib = new category_lib_1.CategoryLib();
                const categories = yield categoryLib.getCategoryWiseProduct();
                res.locals.data = categories;
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, 'getHomeList');
            }
        });
    }
    updateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const id = req.params.id;
            try {
                const product = yield new product_lib_1.ProductLib().findByIdAndUpdate(id, body);
                res.locals.data = product;
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, 'updateProduct');
            }
        });
    }
    deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const data = { isDelete: true };
                const deletedProduct = yield new product_lib_1.ProductLib().findByIdAndUpdate(id, data);
                res.locals.data = deletedProduct;
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, 'deleteProduct');
            }
        });
    }
    getProductsByCategoryId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const utils = new helpers_1.Utils();
                const filters = {};
                if (req.query && req.query.brand) {
                    filters.brand = req.query.brand;
                }
                filters.category_id = req.params.id;
                const options = {
                    page: req.query.page ? Number(req.query.page) : 1,
                    limit: req.query.limit ? Number(req.query.limit) : 10,
                    select: 'images name price discount brand',
                };
                const user = new product_lib_1.ProductLib();
                const users = yield user.getProduct(filters, options);
                res.locals.data = users.docs;
                res.locals.pagination = utils.getPaginateResponse(users);
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, 'getProducts');
            }
        });
    }
    getDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield new product_lib_1.ProductLib().getProductById(req.params.id);
                res.locals.data = product;
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, 'updateProduct');
            }
        });
    }
}
exports.ProductController = ProductController;
