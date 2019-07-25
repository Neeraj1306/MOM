import * as express from 'express';

import { AuthController } from './modules/auth/auth.controller';

import { TaskController } from './modules/task/task.controller';
import { UserController } from './modules/user/user.controller';

export function registerRoutes(app: express.Application): void {
  new UserController().register(app);
  new AuthController().register(app);
  new TaskController().register(app);

}
