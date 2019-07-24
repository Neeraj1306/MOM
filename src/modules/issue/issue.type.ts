import { Document } from 'mongoose';
export interface IIssue extends Document {
  _id: string;
  working?: string;
  agenda?: string;
  issues?: string;
  help?: string;
//   created_date?: Date;
//   token?: string;
//   role?: string;
}
