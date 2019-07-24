import { Application, Request, Response } from 'express';
import { PaginateResult, Types } from 'mongoose';
import { AuthHelper, ResponseHandler, Utils } from '../../helpers';
import { logger } from '../../logger';
import { BaseController } from '../BaseController';
import { IssueLib } from './issue.lib';
// import { userRules } from './user.rules';
import { IIssue } from './issue.type';

/**
 * IssueController
 */
export class IssueController extends BaseController {
    constructor() {
      super();
      this.init();
    }

    public register(app: Application): void {
        app.use('/api/issues', this.router);
    }

    public init(): void {
        const authHelper: AuthHelper = new AuthHelper();

        this.router.get('/', authHelper.guard, this.getIssues);
        this.router.get('/:id', authHelper.guard, this.getIssueById);
        this.router.put(
          '/:id',
          authHelper.guard,
          authHelper.validation,
          this.updateIssue,
        );
        this.router.delete('/:id', this.deleteIssue);
        this.router.post(
            '/',
            authHelper.guard,
            authHelper.validation,
            this.addIssue,
        );
      }

  /**
   * addProduct
   * @param req
   * @param res
   */
  public async addIssue(req: Request, res: Response): Promise<void> {
    try {
      const issueLib: IssueLib = new IssueLib();
      res.locals.data = await issueLib.addIssue(req.body);
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'addIssue');
    }
  }

  public async getIssues(req: Request, res: Response): Promise<void> {
    try {
      const utils: Utils = new Utils();
      const filters: any = {};

      const options: any = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 2,
      };
      const issue: IssueLib = new IssueLib();
      const issues: PaginateResult<IIssue> = await issue.getIssues(
        filters,
        options,
      );
      res.locals.data = issues.docs;
      res.locals.pagination = utils.getPaginateResponse(issues);
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'getIssues');
    }
  }

  public async getIssueById(req: Request, res: Response): Promise<void> {
    try {
      const issue: IssueLib = new IssueLib();
      const issueDetails: IIssue = await issue.getIssueById(req.params.id);
      res.locals.data = issueDetails;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'getIssueById');
    }
  }

  /**
   * Update Product by id
   * @param req
   * @param res
   */
  public async updateIssue(req: Request, res: Response): Promise<void> {
    const body: IIssue = req.body;
    const id: Types.ObjectId = req.params.id;
    try {
      const product: any = await new IssueLib().findByIdAndUpdate(id, body);
      res.locals.data = product;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'updateIssue');
    }
  }

  /**
   * Delete Product by id
   * @param req
   * @param res
   */
  public async deleteIssue(req: Request, res: Response): Promise<any> {
    try {
      const user: IssueLib = new IssueLib();
      logger.info(`id ${req.params.id}`);
      logger.info('delete');

      const deletedIssue: any = user.deleteUser(req.params.id);
      res.locals.data = deletedIssue;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'deletedIssue');
    }
  }

}
