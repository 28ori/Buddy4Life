import UserPost, { IUserPost } from "../models/user_post_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
// import { AuthResquest } from "../common/auth_middleware";

class UserPostController extends BaseController<IUserPost>{
    constructor() {
        super(UserPost)
    }

}

export default new UserPostController();