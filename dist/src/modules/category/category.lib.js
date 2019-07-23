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
const category_model_1 = require("./category.model");
const isDelete = { isDelete: false };
const listFields = 'name';
class CategoryLib {
    getAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return category_model_1.categoryModel.find(Object.assign({}, isDelete), listFields);
        });
    }
    getCategoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return category_model_1.categoryModel.findOne(Object.assign({ _id: id }, isDelete));
        });
    }
    findByIdAndUpdate(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return category_model_1.categoryModel.findByIdAndUpdate(id, { $set: data }, { new: true });
        });
    }
    addCategory(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const categoryObj = new category_model_1.categoryModel(data);
            return categoryObj.save();
        });
    }
    getCategoryWiseProduct() {
        return __awaiter(this, void 0, void 0, function* () {
            return category_model_1.categoryModel.aggregate([
                { $match: Object.assign({}, isDelete) },
                {
                    $lookup: {
                        from: 'products',
                        as: 'brands',
                        let: {
                            cat_id: '$_id',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$category_id', '$$cat_id'] },
                                            { $eq: ['$isDelete', false] },
                                        ],
                                    },
                                },
                            },
                            { $project: { _id: 1, name: 1, brand: 1, description: 1, price: 1, discount: 1, images: 1 } },
                            {
                                $group: { _id: '$brand', product: { $first: '$$ROOT' } },
                            },
                            {
                                $limit: 4,
                            },
                        ],
                    },
                },
            ]);
        });
    }
}
exports.CategoryLib = CategoryLib;
