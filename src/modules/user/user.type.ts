import { Document } from "mongoose";
export interface IUser extends Document {
  _id: string;
  password?: string;
  email?: string;
  name?: string;
  lastName?: string;
  created_date?: Date;
  token?: string;
  role?: string;
  client?: [];
  todayBool?: boolean;
}

export interface IUserRequest {
  password?: string;
  email?: string;
  name?: string;
  lastName?: string;
  created_date?: Date;
  token?: string;
  tmp_forgot_pass_code?: string;
  role?: string;
  tmp_forgot_pass_code_Expires?: number;
  todayBool?: boolean;
}
