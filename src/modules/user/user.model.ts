import { Document, Model, model, PaginateModel, Schema } from "mongoose";
import * as mongoosePaginate from "mongoose-paginate";
import { IUser } from "./user.type";

export const userSchema: Schema = new Schema(
  {
    password: {
      type: String,
      select: false
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      required: "Enter a first name",
      type: String
    },
    last_name: {
      type: String
    },
    // gender: {
    //   type: String,
    //   enum: ['Male', 'Female'],
    // },
    tmp_forgot_pass_code: {
      type: String
    },
    tmp_forgot_pass_code_Expires: {
      type: Number
    },
    role: {
      type: String,
      default: "User",
      enum: ["User", "ScrumMaster"]
    },
    client: {
      type: []
    },
    todayBool: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

userSchema.plugin(mongoosePaginate);
interface IUserModel<T extends Document> extends PaginateModel<T> {}

export const userModel: IUserModel<IUser> = model<IUser>("User", userSchema);
