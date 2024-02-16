import User, { IUser } from "../models/user_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthResquest } from "../authentication/auth_middleware";
import { getEncryptedPassword } from "../controllers/auth_controller";

class UserController extends BaseController<IUser> {
    constructor() {
        super(User);
    }

    async putById(req: AuthResquest, res: Response) {
        // const autorizedResponse = await this.isActionAuthorized(req.params.id, req.user._id)
        const autorizedResponse = await this.isActionAuthorized(req.params.id, req.user._id);
        console.log(autorizedResponse);

        if (autorizedResponse) {
            const raw_password = req.body.password;
            req.body.password = await getEncryptedPassword(raw_password);
            super.putById(req, res);
        } else {
            res.status(401).send("You are not autorized for that action");
        }
    }

    async deleteById(req: AuthResquest, res: Response) {
        const autorizedResponse = await this.isActionAuthorized(req.params.id, req.user._id);
        console.log(autorizedResponse);
        if (autorizedResponse) {
            super.deleteById(req, res);
        } else {
            res.status(401).send("You are not autorized for that action");
        }
    }

    async isActionAuthorized(postId: string, ownerId: string) {
        try {
            const user = await User.findById(postId);
            console.log("the post content is: " + JSON.stringify(user));
            console.log("the ACTUAL ownerId is: " + JSON.stringify(user._id));

            if (ownerId == user._id) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}

export default new UserController();
