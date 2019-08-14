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
const mailer = require("nodemailer");
const pug = require("pug");
class EmailServer {
    sendEmail(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = mailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: Number(process.env.EMAIL_HOST),
                secure: Boolean(process.env.SECURE),
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASS
                }
            });
            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: options.to,
                subject: options.subject
            };
            if (options.templateName == "password-reset") {
                mailOptions.html = yield this.getTemplate(options.templateName, options.replace);
            }
            if (options.templateName == "send-report") {
                mailOptions.html = yield this.getTemplate(options.templateName, options.replace);
            }
            const info = yield transporter.sendMail(mailOptions);
        });
    }
    getTemplate(templateName, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return pug.renderFile(`${__dirname}/../../views/email-templates/${templateName}.pug`, options);
        });
    }
}
exports.EmailServer = EmailServer;
