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

var OTP: any = null;

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
      authHelper.validation,
      this.resetPassword
    );
  }

  public async signUp(req: Request, res: Response): Promise<void> {
    try {
      const user: UserLib = new UserLib();
      const userData: IUser = req.body;
      const password = req.body.password;
      const email = req.body.email;
      const userEmail: IUser = await user.getUserByEmail(email);
      console.log("password", password);
      if (userEmail) {
        throw new Error("Email already exist");
      } else {
        const userResult: IUser = await user.saveUser(userData);
        const loggedInUser: any = await user.loginUserAndCreateToken(
          email,
          password
        );
        res.locals.data = loggedInUser;
        ResponseHandler.JSONSUCCESS(req, res);
      }
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, "addUser");
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const user: UserLib = new UserLib();
      const { email, password } = req.body;
      console.log("password", password);
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
      OTP = shortid.generate();
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
        console.log("otp1", OTP);
        const options: any = {
          subject: "Forgot Password",
          templateName: "password-reset",
          to: userData.email,
          replace: {
            code: OTP
          }
        };
        // mailer
        //   .sendEmail(options)
        //   .then()
        //   .catch();

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
      // console.log("otp2",OTP)
      const user: UserLib = new UserLib();
      // const mailer: EmailServer = new EmailServer();
      const email: string = req.body.email ? req.body.email : null;
      console.log("5 min after", Date.now() + 300000);
      console.log("now", Date.now());
      const userData: IUser = await user.getUserIfLinkNotExpired(email);
      if (userData) {
        // console.log("otp3",OTP)
        if (OTP == req.body.otp) {
          await user.updateUser(userData._id, {
            tmp_forgot_pass_code: null,
            tmp_forgot_pass_code_Expires: null,
            password: await user.generateHash(req.body.password)
          });
          ResponseHandler.JSONSUCCESS(req, res);
        } else {
          throw new Error("Incorrect OTP");
        }
      } else {
        throw new Error("link expired");
      }
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, "resetPassword");
    }
  }
}
