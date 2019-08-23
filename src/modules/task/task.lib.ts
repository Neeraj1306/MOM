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
  public async addTask(data: Object): Promise<ITask> {
    const taskObj: ITask = new taskModel(data);

    return taskObj.save();
  }

  public async getTasks(): // filters: any,
  // options: any,
  Promise<PaginateResult<ITask>> {
    return taskModel.paginate();
  }

  public async getUserTasks(): // filters: any,
  // options: any,
  Promise<Object> {
    return userModel.aggregate([
      {
        $lookup: {
          from: "tasks",
          localField: "_id",
          foreignField: "userId",
          as: "agendas"
        }
      }
    ]);
  }

  public async getTaskById(id: string): Promise<Object> {
    return taskModel.find({ userId: id });
  }

  public async getTodayTaskById(id: string): Promise<Object> {
    return taskModel.find({
      userId: id,
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
    });
  }

  public async getTodayTaskByTaskId(id: string): Promise<Object> {
    return taskModel.find({
      _id: id,
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
    });
  }

  public async getTodayTask(): Promise<Object> {
    return taskModel.find({
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
    });
  }

  public async findByIdAndUpdate(
    id: Types.ObjectId,
    data: ITask
  ): Promise<ITask> {
    return taskModel.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  public async updateTodayTaskBool(id: Types.ObjectId): Promise<IUser> {
    return userModel.findByIdAndUpdate(
      id,
      { $set: { todayBool: false } },
      { new: true }
    );
  }

  public async addClient(id: Types.ObjectId, data: ITask): Promise<ITask> {
    return taskModel.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  public async addClientById(id: Types.ObjectId, data: string): Promise<IUser> {
    return userModel.findByIdAndUpdate(
      id,
      { $addToSet: { client: data } },
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
