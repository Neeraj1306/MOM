"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const generalSchema = new mongoose_1.Schema({
    model_name: {
        type: String,
        required: true,
    },
    model_number: {
        type: String,
    },
    color: {
        type: String,
        required: true,
    },
    in_the_box: String,
    sim_type: String,
    touchScreen: String,
    quick_charging: String,
});
const displaySchema = new mongoose_1.Schema({
    size: {
        type: String,
        required: true,
    },
    resolution: {
        type: String,
        required: true,
    },
    resolution_type: {
        type: String,
        required: true,
    },
    other_features: {
        type: String,
        required: true,
    },
});
const memoryStorageSchema = new mongoose_1.Schema({
    internal_storage: {
        type: Number,
        required: true,
    },
    ram: {
        type: Number,
        required: true,
    },
    expandable: {
        type: Number,
    },
});
const cameraSchema = new mongoose_1.Schema({
    primary_camera: {
        type: String,
        required: true,
    },
    secondary_camera: {
        type: String,
        required: true,
    },
    flash: {
        type: Boolean,
        default: false,
    },
    hd_recording: {
        type: Boolean,
        default: false,
    },
});
const connectivitySchema = new mongoose_1.Schema({
    network_type: {
        type: String,
        required: true,
    },
    supported_network: {
        type: String,
        required: true,
    },
    bluetooth: {
        type: Boolean,
        default: false,
    },
    bluetooth_version: {
        type: String,
        default: false,
    },
    wifi: {
        type: Boolean,
        default: false,
    },
    wifi_version: {
        type: String,
        default: false,
    },
});
exports.productSchema = new mongoose_1.Schema({
    category_id: {
        type: 'ObjectId',
        required: true,
        ref: 'Category',
    },
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    brand: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
    },
    images: [
        {
            type: String,
        },
    ],
    warranty: {
        type: String,
    },
    general: generalSchema,
    display_feature: displaySchema,
    memory_storage: memoryStorageSchema,
    camera: cameraSchema,
    connectivity_feature: connectivitySchema,
    isDelete: {
        type: Boolean,
        default: false,
    },
});
exports.productSchema.plugin(mongoosePaginate);
exports.productModel = mongoose_1.model('Product', exports.productSchema);
