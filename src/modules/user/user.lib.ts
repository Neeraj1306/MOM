import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { PaginateResult } from "mongoose";
import { Messages } from "./../../constants";
import { logger } from "./../../logger";
import { userModel } from "./user.model";
import { IUser, IUserRequest } from "./user.type";

/**
 * UserLib
 *
 */
export class UserLib {
  public async generateHash(password: string): Promise<string> {
    return bcrypt.hashSync(password, 10);
  }

  public async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compareSync(password, hash);
  }

  public async getUsers(
    filters: any,
    projection: any,
    options: any
  ): Promise<PaginateResult<IUser>> {
    //return userModel.find(filters, projection, options);
    return userModel.paginate(filters, options);
  }

  public async getUserById(id: string): Promise<IUser> {
    return userModel.findById(id);
  }

  public async saveUser(userData: IUser): Promise<IUser> {
    userData.password = await this.generateHash(userData.password);
    const userObj: IUser = new userModel(userData);

    return userObj.save();
  }

  public async getUserByEmail(email: string): Promise<IUser> {
    return userModel.findOne({ email: email }, "+password");
  }

  public async getUserIfLinkNotExpired(email: string): Promise<IUser> {
    return userModel.findOne({
      email: email,
      tmp_forgot_pass_code_Expires: { $gt: new Date(Date.now()) }
    });
  }

  /**
   * updateUser
   * @param userId
   * @param userData
   */
  public async updateUser(
    userId: string,
    userData: IUserRequest
  ): Promise<any> {
    const user: IUser = await userModel.findById(userId);
    user.set(userData);

    return user.save();
  }

  public async updateUserTaskBoolean(): Promise<any> {
    return userModel.updateMany({}, { $set: { todayBool: true } });
  }

  public async deleteUser(id: string): Promise<IUser> {
    return userModel.findOneAndDelete({ _id: id });
  }

  public async loginUserAndCreateToken(
    email: string,
    password: string
  ): Promise<any> {
    let user: IUser = await this.getUserByEmail(email);
    user = JSON.parse(JSON.stringify(user));
    console.log("user", user);
    if (user !== null) {
      const isValidPass: boolean = await this.comparePassword(
        password,
        user.password
      );
      if (isValidPass) {
        const token: string = jwt.sign(
          { id: user._id, role: user.role, userName: user.name },
          process.env.SECRET,
          {
            expiresIn: "365d"
          }
        );
        user.password = undefined;

        return { user, token };
      } else {
        throw new Error(Messages.INVALID_CREDENTIALS);
      }
    } else {
      throw new Error(Messages.INVALID_CREDENTIALS);
    }
  }
}
