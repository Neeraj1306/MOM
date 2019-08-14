"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
exports.taskSchema = new mongoose_1.Schema({
    userId: {
        type: String
    },
    userName: {
        type: String
    },
    client: {
        type: String,
        default: "incomplete"
    },
    task: {
        type: String,
        default: "incomplete"
    },
    issues: {
        type: String,
        default: "incomplete"
    },
    help: {
        type: String,
        enum: ["high", "low", "medium", "incomplete"],
        default: "incomplete"
    },
    comment: {
        type: String,
        default: "incomplete"
    },
    currentDate: {
        type: Date
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    adminComment: {
        type: String
    }
}, {
    timestamps: true
});
exports.taskSchema.plugin(mongoosePaginate);
exports.taskModel = mongoose_1.model("Task", exports.taskSchema);
