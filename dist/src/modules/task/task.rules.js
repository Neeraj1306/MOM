"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_1 = require("express-validator/check");
exports.taskRules = {
    forAddTask: [
        check_1.check('task').exists(),
    ],
    forAddClient: [
        check_1.check('client').exists(),
        check_1.check('startDate').exists(),
        check_1.check('endDate').exists(),
    ],
    forAddIssue: [
        check_1.check('issues').exists(),
    ],
    forAddHelp: [
        check_1.check('help').exists(),
    ],
};
