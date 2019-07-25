import { Document } from 'mongoose';
export interface ITask extends Document {
  _id: string;
  client?: string;
  task?: string;
  issues?: string;
  currentDate?: string;
  help?: string;
  startDate?: string;
  endDate?: string;
//   created_date?: Date;
//   token?: string;
//   role?: string;
}
