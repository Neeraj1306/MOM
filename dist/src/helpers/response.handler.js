"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatus = require("http-status-codes");
const constants_1 = require("../constants");
class ResponseHandler {
    static JSONSUCCESS(req, res) {
        const obj = {
            success: true,
            data: res.locals.data,
            pagination: res.locals.pagination,
            message: res.locals.message || constants_1.Messages.SUCCESS_RECEIVED,
            status: HttpStatus.OK
        };
        res.status(HttpStatus.OK).jsonp(obj);
    }
    static JSONERROR(req, res, apiName) {
        let obj;
        const showErrors = ["production", "prod"].indexOf(process.env.NODE_ENV) > 0 ? false : true;
        const errors = res.locals.data;
        let details = [];
        let message = res.locals.data.message;
        if (errors.name === "ValidationError") {
            for (const key in res.locals.data.errors) {
                const value = res.locals.data.errors[key];
                details.push({
                    msg: value.message,
                    param: value.path
                });
            }
            message = res.locals.data._message;
        }
        else {
            if (res.locals.data.length) {
                res.locals.data.map((data) => {
                    data.location = undefined;
                });
                details = res.locals.data;
            }
        }
        const errorCode = res.locals.statusCode || HttpStatus.BAD_REQUEST;
        obj = {
            success: false,
            details: details,
            message: message || constants_1.Messages.SOMETHING_BAD,
            status: errorCode
        };
        obj.functionName = apiName;
        showErrors ? obj : delete obj.details;
        res.status(errorCode).send(obj);
    }
}
exports.ResponseHandler = ResponseHandler;
