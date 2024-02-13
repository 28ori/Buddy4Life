import UserPost, { IUserPost } from "../models/user_post_model";
import { BaseController } from "./base_controller";
import { Request, Response } from "express";
import { AuthResquest } from "../authentication/auth_middleware";

class UserPostController extends BaseController<IUserPost>{
    constructor() {
        super(UserPost)
    }

    async post(req: AuthResquest, res: Response) {
        console.log("TZ is:" + process.env.TZ)
        const _id = req.user._id;
        req.body.userid = _id;
        // req.body.creationTime = new Date()
        req.body.creationTime = new Date().toLocaleString('en-US', {
            timeZone: `${process.env.TZ}`
          });
        super.post(req, res);
    }

    async putById(req: AuthResquest, res: Response) {
        console.log("post id is: " + req.params.id)
        console.log("the user asking is: " + req.user._id)
        // const autorizedResponse = await this.isActionAuthorized(req.params.id, req.user._id)
        const autorizedResponse = await this.isActionAuthorized(req.params.id, req.user._id)
        console.log(autorizedResponse)
        if (autorizedResponse) {
            super.putById(req, res);
        } else {
            res.status(401).send("You are not autorized for that action");
        }
      
    }

    async deleteById(req: AuthResquest, res: Response) {
        console.log("post id is: " + req.params.id)
        console.log("the user asking is: " + req.user._id)
        // const autorizedResponse = await super.isActionAuthorized(req.params.id, req.user._id)
        const autorizedResponse = await this.isActionAuthorized(req.params.id, req.user._id)
        console.log(autorizedResponse)
        if (autorizedResponse) {
            super.deleteById(req, res);
        } else {
            res.status(401).send("You are not autorized for that action");
        }
      
    }

    async isActionAuthorized(postId: String, userid: String) {
        try {
            const post = await UserPost.findById(postId);
            console.log("the post content is: " + JSON.stringify(post));
            console.log("the ACTUAL userid is: " + JSON.stringify(post.userid));
            if (userid == post.userid) {
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

export default new UserPostController();