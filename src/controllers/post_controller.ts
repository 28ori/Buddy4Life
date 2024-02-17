import Post, { IPost } from "../models/post_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthResquest } from "../authentication/auth_middleware";

class PostController extends BaseController<IPost> {
    constructor() {
        super(Post, "post");
    }

    async post(req: AuthResquest, res: Response) {
        try {
            // Check if a post with the same title already exists
            const existingPosts = await this.model.find({ title: req.body.title });
            if (existingPosts.length) {
                res.status(409).send({ message: "A post with the same title already exists." });
                return;
            }
        } catch (err) {
            res.status(500).json({
                message: `Failed to check if a ${this.modelName} with the same title already exists.`,
                error: err.message,
            });
            return;
        }

        req.body.ownerId = req.user._id;
        super.post(req, res);
    }

    async putById(req: AuthResquest, res: Response) {
        console.log("post id is: " + req.params.id);
        console.log("the user asking is: " + req.user._id);
        const autorizedResponse = await this.isActionAuthorized(req.params.id, req.user._id);
        console.log(autorizedResponse);
        if (autorizedResponse) {
            super.putById(req, res);
        } else {
            res.status(401).send("You are not autorized for that action");
        }
    }

    async deleteById(req: AuthResquest, res: Response) {
        let foundPost: IPost | null;

        // First, check if the post exists
        try {
            foundPost = await this.model.findById(req.params.id).exec();
            if (foundPost == null) {
                res.status(200).send({ message: `${this.modelName} with id '${req.params.id}' wat not found.` });
                return;
            }
        } catch (err) {
            res.status(500).json({
                message: `Failed to find ${this.modelName} with id '${req.params.id}'.`,
                error: err.message,
            });
            return;
        }

        if (this.isActionAuthorized(foundPost, req.user._id)) {
            super.deleteById(req, res);
        } else {
            res.status(403).send({ message: "You do not have the necessary permissions to perform this action." });
        }
    }

    isActionAuthorized(post, userId: string) {
        // Check if the user is the owner of the post
        return userId === post.ownerId;
    }
}

export default new PostController();
