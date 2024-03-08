import User, { IUser } from "../models/user_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthResquest } from "../authentication/auth_middleware";
import { getEncryptedPassword } from "../controllers/auth_controller";

class UserController extends BaseController<IUser> {
    constructor() {
        super(User, "user");
    }

    async getById(req: AuthResquest, res: Response) {
        try {
            const foundUser = await this.model.findById(req.params.id).exec();

            if (foundUser == null) {
                res.status(404).send({
                    message: `${this.modelName} with id '${req.params.id}' wat not found.`,
                });
                return;
            }

            const { _id, email, firstName, lastName } = foundUser;
            res.status(200).send({ _id, email, firstName, lastName });
        } catch (err) {
            res.status(500).json({
                message: `Failed to find ${this.modelName} with id '${req.params.id}'.`,
                error: err.message,
            });
        }
    }

    async putById(req: AuthResquest, res: Response) {
        try {
            const autorizedResponse = await this.isActionAuthorized(req.params.id, req.user._id);

            if (autorizedResponse) {
                if (req.body.password) {
                    const raw_password = req.body.password;
                    req.body.password = await getEncryptedPassword(raw_password);
                }

                super.putById(req, res);
            }
        } catch (err) {
            res.status(401).send("You are not autorized for that action");
        }
    }

    async getCurrent(req: AuthResquest, res: Response) {

        try {
            
            const userId = req.user._id;
            const userInfo = await User.findById(userId).select(["firstName", "lastName","email","imageUrl",]);
            res.send(userInfo);
  
        } catch(err) {
            res.status(401).send("You are not autorized for that action");
        }
    }

    async isActionAuthorized(postId: string, ownerId: string) {
        try {
            const user = await User.findById(postId);

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
