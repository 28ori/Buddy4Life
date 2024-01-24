import UserPost, { IUserPost } from "../models/user_post_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthResquest } from "../authentication/auth_middleware";

class UserPostController extends BaseController<IUserPost>{
    constructor() {
        super(UserPost)
    }

    async post(req: AuthResquest, res: Response) {
        const _id = req.user._id;
        req.body.userid = _id;
        super.post(req, res);
    }

}

export default new UserPostController();