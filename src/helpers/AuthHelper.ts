import { NextFunction, Request, Response } from "express";
import { Result, validationResult } from "express-validator/check";
import * as HttpStatus from "http-status-codes";
import * as jwt from "jsonwebtoken";
import { Messages } from "./../constants/messages";
import { logger } from "./../logger";
import { ResponseHandler } from "./response.handler";
/**
 * auth helper
 */
export class AuthHelper {
  public async validation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors: Result<{}> = validationResult(req);
      if (!errors.isEmpty()) {
        res.locals.data = errors.array();
        // console.log("AuthHelper try",res.locals.data)
        throw new Error("ValidationError");
      } else {
        next();
      }
    } catch (err) {
      res.locals.data.message = res.locals.data[0].msg
        ? `${err.message}: ${res.locals.data[0].msg}`
        : `${err.message}`;
      res.locals.details = err;
      res.locals.name = "ValidationError";
      // console.log("AuthHelper catch", res.locals.data )
      ResponseHandler.JSONERROR(req, res, "validation");
    }
  }

  public async guard(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const token: string = req.headers.authorization || req.query.token;
      // console.log('token', token);
      if (token) {
        const auth: any = jwt.verify(token, process.env.SECRET);
        if (auth) {
          req.body.loggedinUserId = auth.id;
          req.body.userName = auth.userName;
          console.log("auth", auth);
          next();
        } else {
          throw new Error(Messages.INVALID_CREDENTIALS);
        }
      } else {
        throw new Error(Messages.INVALID_CREDENTIALS);
      }
    } catch (err) {
      res.locals.data = err;
      res.locals.message = "AuthenticationError";
      res.locals.statusCode = HttpStatus.UNAUTHORIZED;
      ResponseHandler.JSONERROR(req, res, "Authorization");
    }
  }

  public async adminGuard(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const token: string = req.headers.authorization || req.query.token;
      // console.log('token', token);
      if (token) {
        const auth: any = jwt.verify(token, process.env.SECRET);
        console.log("role", auth.role.toLowerCase());
        if (auth.role.toLowerCase() === "scrummaster") {
          req.body.loggedinUserId = auth.id;
          req.body.userName = auth.userName;
          console.log("auth", auth);
          next();
        } else {
          throw new Error(Messages.UNAUTHORIZED_USER);
        }
      } else {
        throw new Error(Messages.UNAUTHORIZED_USER);
      }
    } catch (err) {
      res.locals.data = err;
      res.locals.message = "AuthenticationError";
      res.locals.statusCode = HttpStatus.UNAUTHORIZED;
      ResponseHandler.JSONERROR(req, res, "admingGuard");
    }
  }
}
