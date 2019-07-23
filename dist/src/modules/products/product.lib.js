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
const product_model_1 = require("./product.model");
const isDelete = { isDelete: false };
class ProductLib {
    getProduct(filters, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return product_model_1.productModel.paginate(Object.assign({}, filters, isDelete), options);
        });
    }
    addProduct(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const productObj = new product_model_1.productModel(data);
            return productObj.save();
        });
    }
    findByIdAndUpdate(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return product_model_1.productModel.findByIdAndUpdate(id, { $set: data }, { new: true });
        });
    }
    getCategoryWiseProduct() {
        return __awaiter(this, void 0, void 0, function* () {
            return product_model_1.productModel.aggregate([
                { $match: isDelete },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category_id',
                        foreignField: '_id',
                        as: 'category_products',
                    },
                },
            ]);
        });
    }
    getProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return product_model_1.productModel.findOne({
                _id: id,
            });
        });
    }
}
exports.ProductLib = ProductLib;
