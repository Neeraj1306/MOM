import { PaginateResult, Types } from 'mongoose';
import { issueModel } from './issue.model';
import { IIssue } from './issue.type';

const isDelete: any = { isDelete: false };

/**
 * ProductLib
 */
export class IssueLib {

    public async addIssue(data: IIssue): Promise<IIssue> {
        const issueObj: IIssue = new issueModel(data);

        return issueObj.save();
    }

    public async getIssues(
        filters: any,
        options: any,
      ): Promise<PaginateResult<IIssue>> {
        return issueModel.paginate(filters, options);
    }

    public async getIssueById(id: string): Promise<IIssue> {
        return issueModel.findById(id);
    }

    public async findByIdAndUpdate(
        id: Types.ObjectId,
        data: IIssue,
      ): Promise<IIssue> {
        return issueModel.findByIdAndUpdate(id, { $set: data }, { new: true });
    }

    public async deleteUser(id: string): Promise<IIssue> {
        return issueModel.findOneAndDelete({ _id: id });
      }

}
