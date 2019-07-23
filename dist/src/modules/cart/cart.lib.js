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
const cart_model_1 = require("./cart.model");
class CartLib {
    getPaginatedCarts(filters, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return cart_model_1.cartModel.paginate(filters, options);
        });
    }
    getCarts(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            return cart_model_1.cartModel.find(filters).populate('product_id', 'name price images discount brand');
        });
    }
    add(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const cartObj = new cart_model_1.cartModel(data);
            return cartObj.save();
        });
    }
    findByIdAndUpdate(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return cart_model_1.cartModel.findByIdAndUpdate(id, { $set: data }, { new: true });
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return cart_model_1.cartModel.findByIdAndRemove(id);
        });
    }
}
exports.CartLib = CartLib;
