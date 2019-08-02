import { PaginateResult, Types } from "mongoose";
import { taskModel } from "./task.model";
import { ITask } from "./task.type";
import { userModel } from "../user/user.model";
import { IUser } from "modules/user/user.type";

const isDelete: any = { isDelete: false };

/**
 * ProductLib
 */
export class TaskLib {
  public async addTask(data: ITask): Promise<ITask> {
    const taskObj: ITask = new taskModel(data);

    return taskObj.save();
  }

  public async getTasks(): // filters: any,
  // options: any,
  Promise<PaginateResult<ITask>> {
    return taskModel.paginate();
  }

  public async getTaskById(id: string): Promise<ITask> {
    return taskModel.findById(id);
  }

  public async findByIdAndUpdate(
    id: Types.ObjectId,
    data: ITask
  ): Promise<ITask> {
    return taskModel.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  public async addClient(id: Types.ObjectId, data: ITask): Promise<ITask> {
    return taskModel.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  public async addClientById(id: Types.ObjectId, data: string): Promise<IUser> {
    return userModel.findByIdAndUpdate(
      id,
      { $push: { client: data } },
      { new: true }
    );
  }

  public async addIssue(id: Types.ObjectId, data: ITask): Promise<ITask> {
    return taskModel.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  public async addHelp(id: Types.ObjectId, data: ITask): Promise<ITask> {
    return taskModel.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  public async addAdminComment(
    id: Types.ObjectId,
    data: ITask
  ): Promise<ITask> {
    return taskModel.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  public async deleteUser(id: string): Promise<ITask> {
    return taskModel.findOneAndDelete({ _id: id });
  }
}
