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
const task_model_1 = require("./task.model");
const user_model_1 = require("../user/user.model");
const isDelete = { isDelete: false };
class TaskLib {
    addTask(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const taskObj = new task_model_1.taskModel(data);
            return taskObj.save();
        });
    }
    getTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            return task_model_1.taskModel.paginate();
        });
    }
    getUserTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.userModel.aggregate([
                {
                    $lookup: {
                        from: "tasks",
                        localField: "_id",
                        foreignField: "userId",
                        as: "agendas"
                    }
                }
            ]);
        });
    }
    getTaskById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return task_model_1.taskModel.find({ userId: id });
        });
    }
    getTodayTaskById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return task_model_1.taskModel.find({
                userId: id,
                createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
            });
        });
    }
    getTodayTaskByTaskId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return task_model_1.taskModel.find({
                _id: id,
                createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
            });
        });
    }
    getTodayTask() {
        return __awaiter(this, void 0, void 0, function* () {
            return task_model_1.taskModel.find({
                createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
            });
        });
    }
    findByIdAndUpdate(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return task_model_1.taskModel.findByIdAndUpdate(id, { $set: data }, { new: true });
        });
    }
    addClient(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return task_model_1.taskModel.findByIdAndUpdate(id, { $set: data }, { new: true });
        });
    }
    addClientById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.userModel.findByIdAndUpdate(id, { $addToSet: { client: data } }, { new: true });
        });
    }
    addIssue(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return task_model_1.taskModel.findByIdAndUpdate(id, { $set: data }, { new: true });
        });
    }
    addHelp(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return task_model_1.taskModel.findByIdAndUpdate(id, { $set: data }, { new: true });
        });
    }
    addAdminComment(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return task_model_1.taskModel.findByIdAndUpdate(id, { $set: data }, { new: true });
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return task_model_1.taskModel.findOneAndDelete({ _id: id });
        });
    }
}
exports.TaskLib = TaskLib;
