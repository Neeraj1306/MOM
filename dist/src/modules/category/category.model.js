"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.categorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    isDelete: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.categoryModel = mongoose_1.model('Category', exports.categorySchema);
