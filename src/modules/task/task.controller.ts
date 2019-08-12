import { Application, Request, Response } from "express";
const { check } = require("express-validator");
import { PaginateResult, Types } from "mongoose";
import { AuthHelper, ResponseHandler, Utils } from "../../helpers";
import { logger } from "../../logger";
import { BaseController } from "../BaseController";
import { TaskLib } from "./task.lib";
import { taskRules } from "./task.rules";
import { ITask } from "./task.type";
import { UserLib } from "./../user/user.lib";
import { IUser } from "./../user/user.type";
import { EmailServer } from "./../../helpers";

/**
 * TaskController
 */
export class TaskController extends BaseController {
  constructor() {
    super();
    this.init();
  }

  public register(app: Application): void {
    app.use("/api/tasks", this.router);
  }

  public init(): void {
    const authHelper: AuthHelper = new AuthHelper();

    this.router.get("/", authHelper.adminGuard, this.getTasks);
    this.router.get("/todaytask", authHelper.adminGuard, this.getTodayTasks);
    this.router.get("/client", authHelper.guard, this.getClients);
    this.router.get("/todaytask/:id", authHelper.guard, this.getTodayTaskById);
    this.router.get(
      "/todaytaskbytaskid/:id",
      authHelper.guard,
      this.getTodayTaskByTaskId
    );
    this.router.get("/:id", authHelper.guard, this.getTaskById);
    this.router.post(
      "/sendreport",
      authHelper.guard,
      // taskRules.forAddTask,
      authHelper.validation,
      this.sendReport
    );

    this.router.put(
      "/:id",
      authHelper.guard,
      authHelper.validation,
      this.updateTask
    );
    this.router.put(
      "/client/:id",
      authHelper.guard,
      taskRules.forAddClient,
      authHelper.validation,
      this.addClient
    );
    this.router.put(
      "/issue/:id",
      authHelper.guard,
      taskRules.forAddIssue,
      authHelper.validation,
      this.addIssue
    );
    this.router.put(
      "/help/:id",
      authHelper.guard,
      taskRules.forAddHelp,
      authHelper.validation,
      this.addHelp
    );
    this.router.delete("/:id", this.deleteTask);
    this.router.post(
      "/",
      authHelper.guard,
      taskRules.forAddTask,
      authHelper.validation,
      this.addTask
    );
    this.router.put(
      "/adminComment/:id",
      authHelper.adminGuard,
      // taskRules.forAddHelp,
      authHelper.validation,
      this.addAdminComment
    );
  }

  /**
   * addTask
   * @param req
   * @param res
   */
  public async addTask(req: Request, res: Response): Promise<void> {
    try {
      const taskLib: TaskLib = new TaskLib();
      console.log("body", req.body);
      const task = {
        task: req.body.task,
        currentDate: req.body.currentDate,
        userId: req.body.loggedinUserId,
        userName: req.body.userName
      };
      console.log("task", task);
      res.locals.data = await taskLib.addTask(task);
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, "addTask");
    }
  }

  public async getTaskById(req: Request, res: Response): Promise<void> {
    try {
      const task: TaskLib = new TaskLib();
      const taskDetails = await task.getTaskById(req.params.id);
      console.log("taskDetails3", Object.keys(taskDetails).length !== 0);
      if (taskDetails && Object.keys(taskDetails).length !== 0) {
        res.locals.data = taskDetails;
        ResponseHandler.JSONSUCCESS(req, res);
      } else {
        throw new Error("No task found");
      }
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, "getTaskById");
    }
  }

  public async getTodayTaskById(req: Request, res: Response): Promise<void> {
    try {
      console.log("getTodayTaskById");
      const task: TaskLib = new TaskLib();
      const taskDetails = await task.getTodayTaskById(req.params.id);
      console.log("taskDetails3", Object.keys(taskDetails));
      if (taskDetails && Object.keys(taskDetails).length !== 0) {
        res.locals.data = taskDetails;
        ResponseHandler.JSONSUCCESS(req, res);
      } else {
        throw new Error("No task found");
      }
    } catch (err) {
      console.log("getTodayTaskById error");
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, "getTaskById");
    }
  }

  public async getTodayTaskByTaskId(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      console.log("getTodayTaskByTaskId");
      const task: TaskLib = new TaskLib();
      const taskDetails = await task.getTodayTaskByTaskId(req.params.id);
      console.log("taskDetails3", Object.keys(taskDetails));
      if (taskDetails && Object.keys(taskDetails).length !== 0) {
        res.locals.data = taskDetails;
        ResponseHandler.JSONSUCCESS(req, res);
      } else {
        throw new Error("No task found");
      }
    } catch (err) {
      console.log("getTodayTaskById error");
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, "getTaskById");
    }
  }

  /**
   * Update Task by id
   * @param req
   * @param res
   */
  public async updateTask(req: Request, res: Response): Promise<void> {
    const body: ITask = req.body;
    const id: Types.ObjectId = req.params.id;
    try {
      const task: any = await new TaskLib().findByIdAndUpdate(id, body);
      res.locals.data = task;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, "updateTask");
    }
  }

  /**
   * Add Client
   * @param req
   * @param res
   */
  public async addClient(req: Request, res: Response): Promise<void> {
    const body: ITask = req.body;
    const id: Types.ObjectId = req.params.id;

    try {
      console.log("1");
      const client: any = await new TaskLib().addClient(id, body);
      console.log("2", req.body.loggedinUserId);
      const clientById: any = await new TaskLib().addClientById(
        req.body.loggedinUserId,
        body.client.toLowerCase()
      );
      console.log("3");
      // console.log('client', client);
      res.locals.data = client;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      // console.log('err', err);
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, "addClient");
    }
  }

  /**
   * Add Issue
   * @param req
   * @param res
   */
  public async addIssue(req: Request, res: Response): Promise<void> {
    const body: ITask = req.body;
    const id: Types.ObjectId = req.params.id;
    try {
      const issue: any = await new TaskLib().addIssue(id, body);
      res.locals.data = issue;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, "addClient");
    }
  }

  /**
   * Add Help
   * @param req
   * @param res
   */
  public async addHelp(req: Request, res: Response): Promise<void> {
    const body: ITask = req.body;
    const id: Types.ObjectId = req.params.id;
    try {
      const help: any = await new TaskLib().addHelp(id, body);
      res.locals.data = help;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, "addHelp");
    }
  }

  /**
   * Delete Task by id
   * @param req
   * @param res
   */
  public async deleteTask(req: Request, res: Response): Promise<any> {
    try {
      const user: TaskLib = new TaskLib();
      logger.info(`id ${req.params.id}`);
      logger.info("delete");

      const deletedTask: any = user.deleteUser(req.params.id);
      res.locals.data = deletedTask;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, "deletedTask");
    }
  }

  public async getTasks(req: Request, res: Response): Promise<void> {
    try {
      console.log("id", req.body.loggedinUserId);
      const utils: Utils = new Utils();
      const filters: any = {};

      const options: any = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10
      };
      const task: TaskLib = new TaskLib();
      const tasks = await task
        .getUserTasks
        // filters,
        // options,
        ();
      // console.log("tasks",tasks.docs)
      // var client = tasks.docs.map(function(item) { return item["client"]; });
      // console.log("client",client);
      // var uniqueClient = client.filter(function(item, pos){
      //   return client.indexOf(item)== pos;
      // });
      // console.log("uniqueClient",uniqueClient);
      res.locals.data = tasks;
      // res.locals.pagination = utils.getPaginateResponse(tasks);
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, "getTasks");
    }
  }

  public async getTodayTasks(req: Request, res: Response): Promise<void> {
    try {
      const utils: Utils = new Utils();
      const filters: any = {};
      const select: string = "-password";

      const options: any = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10
      };
      const task: TaskLib = new TaskLib();
      const tasks = await task
        .getTodayTask
        // filters,
        // select,
        // options
        ();
      res.locals.data = tasks;
      // res.locals.pagination = utils.getPaginateResponse(tasks);
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, "getTodayTasks");
    }
  }

  public async getClients(req: Request, res: Response): Promise<void> {
    try {
      const utils: Utils = new Utils();
      const filters: any = {};

      const options: any = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 2
      };
      const task: TaskLib = new TaskLib();
      const tasks: PaginateResult<ITask> = await task
        .getTasks
        // filters,
        // options,
        ();
      // console.log("tasks",tasks.docs)
      const client = tasks.docs.map(function(item) {
        return item.client;
      });
      // console.log("client",client);
      const uniqueClient = client.filter(function(item, pos) {
        return client.indexOf(item) === pos;
      });
      // console.log("uniqueClient",uniqueClient);
      res.locals.data = uniqueClient;
      // res.locals.pagination = utils.getPaginateResponse(tasks);
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, "getClients");
    }
  }

  /**
   * Add Help
   * @param req
   * @param res
   */
  public async addAdminComment(req: Request, res: Response): Promise<void> {
    const body: ITask = req.body;
    const id: Types.ObjectId = req.params.id;
    try {
      const adminComment: any = await new TaskLib().addAdminComment(id, body);
      res.locals.data = adminComment;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, "addAdminComment");
    }
  }

  public async sendReport(req: Request, res: Response): Promise<void> {
    try {
      const user: UserLib = new UserLib();
      const mailer: EmailServer = new EmailServer();
      const utils: Utils = new Utils();

      const email: string = req.body.email ? req.body.email : null;
      // const tmpForgotPassCode: string = await utils.getToken();
      // const userData: IUser = await user.getUserByEmail(email);
      // console.log("userData", userData);
      // if (userData) {
      console.log("sendReport1");
      const options: any = {
        subject: "Today Agenda",
        templateName: "send-report",
        to: "neeraj.kumar@neosofttech.com",
        replace: {
          // code: OTP
          currentDate: req.body.currentDate,
          name: req.body.name,
          task: req.body.task,
          help: req.body.help
        }
      };
      // mailer
      //   .sendEmail(options)
      //   .then()
      //   .catch();
      await mailer.sendEmail(options);
      ResponseHandler.JSONSUCCESS(req, res);

      // } else {
      // console.log('else')
      // throw new Error("email is not valid");
      // res.locals.data.message = 'enter correct email';
      // ResponseHandler.JSONERROR(req, res, "forgotPassword");
      // }
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, "sendReport");
    }
  }
}
