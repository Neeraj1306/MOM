import * as express from 'express';

import { AuthController } from './modules/auth/auth.controller';

import { IssueController } from './modules/issue/issue.controller';
import { UserController } from './modules/user/user.controller';

export function registerRoutes(app: express.Application): void {
  new UserController().register(app);
  new AuthController().register(app);
  new IssueController().register(app);

}
