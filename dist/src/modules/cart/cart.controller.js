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
const cart_lib_1 = require("./cart.lib");
class CartController extends BaseController_1.BaseController {
    constructor() {
        super();
        this.init();
    }
    register(app) {
        const authHelper = new helpers_1.AuthHelper();
        app.use('/api/carts', authHelper.guard, this.router);
    }
    init() {
        this.router.post('/', this.addProductIntoCart);
        this.router.get('/pagination', this.getPaginatedCarts);
        this.router.get('/', this.getCarts);
        this.router.put('/:id', this.updateCart);
        this.router.delete('/:id', this.deleteCartItem);
    }
    getPaginatedCarts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("cart");
                const utils = new helpers_1.Utils();
                const filters = {};
                filters.user_id = req.body.loggedinUserId;
                const options = {
                    page: req.query.page ? Number(req.query.page) : 1,
                    limit: req.query.limit ? Number(req.query.limit) : 10,
                };
                const cart = new cart_lib_1.CartLib();
                const carts = yield cart.getPaginatedCarts(filters, options);
                res.locals.data = carts.docs;
                res.locals.pagination = utils.getPaginateResponse(carts);
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                console.log("err", err);
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, 'getProducts');
            }
        });
    }
    getCarts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filters = {};
                filters.user_id = req.body.loggedinUserId;
                const cart = new cart_lib_1.CartLib();
                const carts = yield cart.getCarts(filters);
                res.locals.data = carts;
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, 'getProducts');
            }
        });
    }
    addProductIntoCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cartLib = new cart_lib_1.CartLib();
                req.body.user_id = req.body.loggedinUserId;
                res.locals.data = yield cartLib.add(req.body);
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, 'addProductIntoCart');
            }
        });
    }
    updateCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            body.user_id = req.body.loggedinUserId;
            const id = req.params.id;
            try {
                const product = yield new cart_lib_1.CartLib().findByIdAndUpdate(id, body);
                if (!product) {
                    throw new Error('Invalid product id passed.');
                }
                res.locals.data = product;
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, 'updateCart');
            }
        });
    }
    deleteCartItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const deletedProduct = yield new cart_lib_1.CartLib().deleteById(id);
                if (!deletedProduct) {
                    throw new Error('Invalid product id passed.');
                }
                res.locals.data = deletedProduct;
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, 'deleteCartItem');
            }
        });
    }
}
exports.CartController = CartController;
