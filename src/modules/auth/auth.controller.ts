const shortid = require("shortid");
import { Application, Request, Response } from "express";
import { BaseController } from "../BaseController";
import {
  AuthHelper,
  EmailServer,
  ResponseHandler,
  Utils
} from "./../../helpers";
import { UserLib } from "./../user/user.lib";
import { userRules } from "./../user/user.rules";
import { IUser } from "./../user/user.type";

/**
 * AuthController
 */
export class AuthController extends BaseController {
  constructor() {
    super();
    this.init();
  }

  public register(app: Application): void {
    app.use("/api/auth", this.router);
  }

  public init(): void {
    const authHelper: AuthHelper = new AuthHelper();
    this.router.post(
      "/sign-up",
      userRules.forSignUser,
      authHelper.validation,
      this.signUp
    );
    this.router.post(
      "/login",
      userRules.forSignIn,
      authHelper.validation,
      this.login
    );
    this.router.post("/forgot-password", this.forgotPassword);
    this.router.post(
      "/reset-password",
      userRules.forResetPassword,
      this.resetPassword
    );
  }

  public async signUp(req: Request, res: Response): Promise<void> {
    try {
      const user: UserLib = new UserLib();
      const userData: IUser = req.body;
      const userResult: IUser = await user.saveUser(userData);
      res.locals.data = userResult;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, "addUser");
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const user: UserLib = new UserLib();
      const { email, password } = req.body;
      const loggedInUser: any = await user.loginUserAndCreateToken(
        email,
        password
      );
      res.locals.data = loggedInUser;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.errorCode = 401;
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, "login");
    }
  }

  public async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const user: UserLib = new UserLib();
      const mailer: EmailServer = new EmailServer();
      const utils: Utils = new Utils();

      const email: string = req.body.email ? req.body.email : null;
      const tmpForgotPassCode: string = await utils.getToken();
      const userData: IUser = await user.getUserByEmail(email);
      console.log("userData", userData);
      if (userData) {
        await user.updateUser(userData._id, {
          tmp_forgot_pass_code: tmpForgotPassCode,
          tmp_forgot_pass_code_Expires: Date.now() + 300000 //link expire after 5 mins
        });
        const options: any = {
          subject: "Forgot Password",
          templateName: "password-reset",
          to: userData.email,
          replace: {
            code: shortid.generate()
          }
        };
        mailer
          .sendEmail(options)
          .then()
          .catch();

        ResponseHandler.JSONSUCCESS(req, res);
        await mailer.sendEmail(options);
      } else {
        // console.log('else')
        throw new Error("email is not valid");
        // res.locals.data.message = 'enter correct email';
        // ResponseHandler.JSONERROR(req, res, "forgotPassword");
      }
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, "forgotPassword");
    }
  }

  public async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const user: UserLib = new UserLib();
      // const mailer: EmailServer = new EmailServer();
      const email: string = req.body.email ? req.body.email : null;
      const userData: IUser = await user.getUserIfLinkNotExpired(email);
      if (userData) {
        await user.updateUser(userData._id, {
          // tmp_forgot_pass_code: tmpForgotPassCode,
          tmp_forgot_pass_code_Expires: 1,
          password: await user.generateHash(req.body.password)
        });
        ResponseHandler.JSONSUCCESS(req, res);
      } else {
        throw new Error("link expired");
      }
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, "resetPassword");
    }
  }
}
