import { Document, Model, model, PaginateModel, Schema } from "mongoose";
import * as mongoosePaginate from "mongoose-paginate";
import { ITask } from "./task.type";

export const taskSchema: Schema = new Schema(
  {
    client: {
      type: String,
      default: "incomplete"
    },
    task: {
      type: String,
      default: "incomplete"
    },
    issues: {
      type: String,
      default: "incomplete"
    },
    help: {
      type: String,
      enum: ["high", "low", "medium"],
      default: "incomplete"
    },
    comment: {
      type: String,
      default: "incomplete"
    },
    currentDate: {
      type: Date
      // default: 'incomplete'
    },
    startDate: {
      type: Date
      // default: 'incomplete'
    },
    endDate: {
      type: Date
      // default: 'incomplete'
    }
  },
  {
    timestamps: true
  }
);

taskSchema.plugin(mongoosePaginate);
interface ITaskModel<T extends Document> extends PaginateModel<T> {}

export const taskModel: ITaskModel<ITask> = model<ITask>("Task", taskSchema);