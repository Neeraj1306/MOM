"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const winston = require("winston");
const logDir = './logs';
if (!fs_1.existsSync(logDir)) {
    fs_1.mkdirSync(logDir);
}
exports.logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: `${logDir}/combined.log` }),
    ],
});
