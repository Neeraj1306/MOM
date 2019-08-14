"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
exports.userSchema = new mongoose_1.Schema({
    password: {
        type: String,
        select: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        required: "Enter a first name",
        type: String
    },
    last_name: {
        type: String
    },
    tmp_forgot_pass_code: {
        type: String
    },
    tmp_forgot_pass_code_Expires: {
        type: Number
    },
    role: {
        type: String,
        default: "User",
        enum: ["User", "ScrumMaster"]
    },
    client: {
        type: []
    }
}, {
    timestamps: true
});
exports.userSchema.plugin(mongoosePaginate);
exports.userModel = mongoose_1.model("User", exports.userSchema);
