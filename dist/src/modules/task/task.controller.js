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
const { check } = require("express-validator");
const helpers_1 = require("../../helpers");
const logger_1 = require("../../logger");
const BaseController_1 = require("../BaseController");
const task_lib_1 = require("./task.lib");
const task_rules_1 = require("./task.rules");
const user_lib_1 = require("./../user/user.lib");
const helpers_2 = require("./../../helpers");
class TaskController extends BaseController_1.BaseController {
    constructor() {
        super();
        this.init();
    }
    register(app) {
        app.use("/api/tasks", this.router);
    }
    init() {
        const authHelper = new helpers_1.AuthHelper();
        this.router.get("/", authHelper.adminGuard, this.getTasks);
        this.router.get("/todaytask", authHelper.adminGuard, this.getTodayTasks);
        this.router.get("/client", authHelper.guard, this.getClients);
        this.router.get("/todaytask/:id", authHelper.guard, this.getTodayTaskById);
        this.router.get("/todaytaskbytaskid/:id", authHelper.guard, this.getTodayTaskByTaskId);
        this.router.get("/:id", authHelper.guard, this.getTaskById);
        this.router.post("/sendreport", authHelper.guard, authHelper.validation, this.sendReport);
        this.router.put("/:id", authHelper.guard, authHelper.validation, this.updateTask);
        this.router.put("/client/:id", authHelper.guard, task_rules_1.taskRules.forAddClient, authHelper.validation, this.addClient);
        this.router.put("/issue/:id", authHelper.guard, task_rules_1.taskRules.forAddIssue, authHelper.validation, this.addIssue);
        this.router.put("/help/:id", authHelper.guard, task_rules_1.taskRules.forAddHelp, authHelper.validation, this.addHelp);
        this.router.delete("/:id", this.deleteTask);
        this.router.post("/", authHelper.guard, task_rules_1.taskRules.forAddTask, authHelper.validation, this.addTask);
        this.router.put("/adminComment/:id", authHelper.adminGuard, authHelper.validation, this.addAdminComment);
    }
    addTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const taskLib = new task_lib_1.TaskLib();
                console.log("body", req.body);
                const task = {
                    task: req.body.task,
                    currentDate: req.body.currentDate,
                    userId: req.body.loggedinUserId,
                    userName: req.body.userName
                };
                console.log("task", task);
                res.locals.data = yield taskLib.addTask(task);
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, "addTask");
            }
        });
    }
    getTaskById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const task = new task_lib_1.TaskLib();
                const taskDetails = yield task.getTaskById(req.params.id);
                console.log("taskDetails3", Object.keys(taskDetails).length !== 0);
                if (taskDetails && Object.keys(taskDetails).length !== 0) {
                    res.locals.data = taskDetails;
                    helpers_1.ResponseHandler.JSONSUCCESS(req, res);
                }
                else {
                    throw new Error("No task found");
                }
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, "getTaskById");
            }
        });
    }
    getTodayTaskById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("getTodayTaskById");
                const task = new task_lib_1.TaskLib();
                const taskDetails = yield task.getTodayTaskById(req.params.id);
                console.log("taskDetails3", Object.keys(taskDetails));
                if (taskDetails && Object.keys(taskDetails).length !== 0) {
                    res.locals.data = taskDetails;
                    helpers_1.ResponseHandler.JSONSUCCESS(req, res);
                }
                else {
                    throw new Error("No task found");
                }
            }
            catch (err) {
                console.log("getTodayTaskById error");
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, "getTaskById");
            }
        });
    }
    getTodayTaskByTaskId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("getTodayTaskByTaskId");
                const task = new task_lib_1.TaskLib();
                const taskDetails = yield task.getTodayTaskByTaskId(req.params.id);
                console.log("taskDetails3", Object.keys(taskDetails));
                if (taskDetails && Object.keys(taskDetails).length !== 0) {
                    res.locals.data = taskDetails;
                    helpers_1.ResponseHandler.JSONSUCCESS(req, res);
                }
                else {
                    throw new Error("No task found");
                }
            }
            catch (err) {
                console.log("getTodayTaskById error");
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, "getTaskById");
            }
        });
    }
    updateTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const id = req.params.id;
            try {
                const task = yield new task_lib_1.TaskLib().findByIdAndUpdate(id, body);
                res.locals.data = task;
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, "updateTask");
            }
        });
    }
    addClient(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const id = req.params.id;
            try {
                console.log("1");
                const client = yield new task_lib_1.TaskLib().addClient(id, body);
                console.log("2", req.body.loggedinUserId);
                const clientById = yield new task_lib_1.TaskLib().addClientById(req.body.loggedinUserId, body.client.toLowerCase());
                console.log("3");
                res.locals.data = client;
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, "addClient");
            }
        });
    }
    addIssue(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const id = req.params.id;
            try {
                const issue = yield new task_lib_1.TaskLib().addIssue(id, body);
                res.locals.data = issue;
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, "addClient");
            }
        });
    }
    addHelp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const id = req.params.id;
            try {
                const help = yield new task_lib_1.TaskLib().addHelp(id, body);
                res.locals.data = help;
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, "addHelp");
            }
        });
    }
    deleteTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = new task_lib_1.TaskLib();
                logger_1.logger.info(`id ${req.params.id}`);
                logger_1.logger.info("delete");
                const deletedTask = user.deleteUser(req.params.id);
                res.locals.data = deletedTask;
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, "deletedTask");
            }
        });
    }
    getTasks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("id", req.body.loggedinUserId);
                const utils = new helpers_1.Utils();
                const filters = {};
                const options = {
                    page: req.query.page ? Number(req.query.page) : 1,
                    limit: req.query.limit ? Number(req.query.limit) : 10
                };
                const task = new task_lib_1.TaskLib();
                const tasks = yield task
                    .getUserTasks();
                res.locals.data = tasks;
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, "getTasks");
            }
        });
    }
    getTodayTasks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const utils = new helpers_1.Utils();
                const filters = {};
                const select = "-password";
                const options = {
                    page: req.query.page ? Number(req.query.page) : 1,
                    limit: req.query.limit ? Number(req.query.limit) : 10
                };
                const task = new task_lib_1.TaskLib();
                const tasks = yield task
                    .getTodayTask();
                res.locals.data = tasks;
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, "getTodayTasks");
            }
        });
    }
    getClients(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const utils = new helpers_1.Utils();
                const filters = {};
                const options = {
                    page: req.query.page ? Number(req.query.page) : 1,
                    limit: req.query.limit ? Number(req.query.limit) : 2
                };
                const task = new task_lib_1.TaskLib();
                const tasks = yield task
                    .getTasks();
                const client = tasks.docs.map(function (item) {
                    return item.client;
                });
                const uniqueClient = client.filter(function (item, pos) {
                    return client.indexOf(item) === pos;
                });
                res.locals.data = uniqueClient;
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, "getClients");
            }
        });
    }
    addAdminComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const id = req.params.id;
            try {
                const adminComment = yield new task_lib_1.TaskLib().addAdminComment(id, body);
                res.locals.data = adminComment;
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, "addAdminComment");
            }
        });
    }
    sendReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = new user_lib_1.UserLib();
                const mailer = new helpers_2.EmailServer();
                const utils = new helpers_1.Utils();
                const email = req.body.email ? req.body.email : null;
                console.log("sendReport1");
                const options = {
                    subject: "Today Agenda",
                    templateName: "send-report",
                    to: "neeraj.kumar@neosofttech.com",
                    replace: {
                        currentDate: req.body.currentDate,
                        name: req.body.name,
                        task: req.body.task,
                        help: req.body.help
                    }
                };
                yield mailer.sendEmail(options);
                helpers_1.ResponseHandler.JSONSUCCESS(req, res);
            }
            catch (err) {
                res.locals.data = err;
                helpers_1.ResponseHandler.JSONERROR(req, res, "sendReport");
            }
        });
    }
}
exports.TaskController = TaskController;
