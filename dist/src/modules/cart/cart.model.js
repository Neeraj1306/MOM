"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
exports.cartSchema = new mongoose_1.Schema({
    user_id: {
        type: 'ObjectId',
        required: true,
        ref: 'User',
    },
    product_id: {
        type: 'ObjectId',
        required: true,
        ref: 'Product',
    },
    quantity: {
        type: Number,
    },
}, {
    timestamps: true,
});
exports.cartSchema.plugin(mongoosePaginate);
exports.cartModel = mongoose_1.model('Cart', exports.cartSchema);
