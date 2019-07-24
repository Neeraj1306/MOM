import { Document, Model, model, PaginateModel, Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import { IIssue } from './issue.type';

export const issueSchema: Schema = new Schema(
  {
    working: {
      type: String,
      required: true,
    },
    agenda: {
      type: String,
      required: true,
    },
    issues: {
      required: true,
      type: String,
    },
    help: {
      type: String,
      enum: ['high', 'low', 'medium'],
    },
    comment: {
        type : String,
    },

  },
  {
    timestamps: true,
  },
);

issueSchema.plugin(mongoosePaginate);
interface IIssueModel<T extends Document> extends PaginateModel<T> {}

export const issueModel: IIssueModel<IIssue> = model<IIssue>('Issue', issueSchema);
