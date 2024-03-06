import Post, { IPost } from "../models/post_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthResquest } from "../authentication/auth_middleware";
import { Document } from "mongoose";
class PostController extends BaseController<IPost> {
    constructor() {
        super(Post, "post");
    }

    async post(req: AuthResquest, res: Response) {
        // First, check if a post with the same title already exists
        try {
            const existingPosts = await this.model.find({ title: req.body.title });
            if (existingPosts.length) {
                res.status(409).send({ message: "A post with the same title already exists." });
                return;
            }

            req.body.ownerId = req.user._id;
        } catch (err) {
            res.status(500).json({
                message: `Failed to check if a ${this.modelName} with the same title already exists.`,
                error: err.message,
            });
            return;
        }

        super.post(req, res);
    }

    async putById(req: AuthResquest, res: Response) {
        let foundPost: Document<unknown, object, IPost> | null;

        // First, check if the post exists
        try {
            foundPost = await this.model.findById(req.params.id).exec();
            if (foundPost == null) {
                res.status(404).send({ message: `${this.modelName} with id '${req.params.id}' wat not found.` });
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
            // Check if a post with the same title already exists
            try {
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

            // Update the post
            super.putById(req, res);
        } else {
            res.status(403).send({ message: "You do not have the necessary permissions to perform this action." });
        }
    }

    async deleteById(req: AuthResquest, res: Response) {
        let foundPost: Document<unknown, object, IPost> | null;

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
