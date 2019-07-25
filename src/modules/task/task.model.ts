import { Document, Model, model, PaginateModel, Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import { ITask } from './task.type';

export const taskSchema: Schema = new Schema(
  {
    client: {
      type: String,
    },
    task: {
      type: String,
    },
    issues: {
      type: String,
    },
    help: {
      type: String,
      enum: ['high', 'low', 'medium'],
    },
    comment: {
        type : String,
    },
    currentDate:{
      type : Date,
    
    },
    startDate:{
      type : Date
    },
    endDate:{
      type : Date
    }

  },
  {
    timestamps: true,
  },
);

taskSchema.plugin(mongoosePaginate);
interface ITaskModel<T extends Document> extends PaginateModel<T> {}

export const taskModel: ITaskModel<ITask> = model<ITask>('Task', taskSchema);
