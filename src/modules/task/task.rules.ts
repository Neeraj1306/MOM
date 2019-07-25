import { Request } from 'express';
import { check } from 'express-validator/check';

export const taskRules: any = {
    forAddTask: [
        check('task').exists(),
    ],
    forAddClient: [
        check('client').exists(),
        check('startDate').exists(),
        check('endDate').exists(),
    ],
    forAddIssue: [
        check('issues').exists(),
    ],
    forAddHelp: [
        check('help').exists(),
    ],
};
