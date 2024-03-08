import Post, { IPost } from "../models/post_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthResquest } from "../authentication/auth_middleware";
class PostController extends BaseController<IPost> {
    constructor() {
        super(Post, "post");
    }

    async get(req: AuthResquest, res: Response) {
        const filters = {
            ...(req.query.ownerId !== undefined && { ownerId: req.query.ownerId }),
            ...(req.query.gender !== undefined && { "dogInfo.gender": req.query.gender }),
            ...(req.query.breed !== undefined && { "dogInfo.breed": req.query.breed }),
            ...(req.query.city !== undefined && { city: req.query.city }),
        };

        super.get(req, res, filters);
    }

    async post(req: AuthResquest, res: Response) {
        // First, check if a post with the same title already exists
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

        req.body.ownerId = req.user._id;
        super.post(req, res);
    }

    async putById(req: AuthResquest, res: Response) {
        let foundPost;

        // First, check if the post exists
        try {
            foundPost = await this.model.findById(req.params.id).exec();
            if (!foundPost) {
                res.status(404).send({
                    message: `${this.modelName} with id '${req.params.id}' wat not found.`,
                });
                return;
            }
        } catch (err) {
            res.status(500).json({
                message: `Failed to find ${this.modelName} with id '${req.params.id}'.`,
                error: err.message,
            });
            return;
        }

        if (this.isPostActionAuthorized(foundPost, req.user._id)) {
            // Check if a post with the same title already exists (not including the current post)
            try {
                const existingPosts = await this.model.find({ title: req.body.title });
                if (existingPosts.length > 1) {
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
            res.status(403).send({
                message: "You do not have the necessary permissions to perform this action.",
            });
        }
    }

    async deleteById(req: AuthResquest, res: Response) {
        let foundPost;

        // First, check if the post exists
        try {
            foundPost = await this.model.findById(req.params.id).exec();
            if (!foundPost) {
                res.status(200).send({
                    message: `${this.modelName} with id '${req.params.id}' wat not found.`,
                });
                return;
            }
        } catch (err) {
            res.status(500).json({
                message: `Failed to find ${this.modelName} with id '${req.params.id}'.`,
                error: err.message,
            });
            return;
        }

        if (this.isPostActionAuthorized(foundPost, req.user._id)) {
            super.deleteById(req, res);
        } else {
            res.status(403).send({
                message: "You do not have the necessary permissions to perform this action.",
            });
        }
    }

    async postComment(req: AuthResquest, res: Response) {
        let foundPost;

        // First, check if the post exists
        try {
            foundPost = await this.model.findById(req.params.id).exec();
            if (!foundPost) {
                res.status(404).send({
                    message: `${this.modelName} with id '${req.params.id}' wat not found.`,
                });
                return;
            }
        } catch (err) {
            res.status(500).json({
                message: `Failed to find ${this.modelName} with id '${req.params.id}'.`,
                error: err.message,
            });
            return;
        }

        // Prepare the new comment object
        const newComment = { ...req.body, authorId: req.user._id };

        try {
            // Add the comment to the post
            foundPost.comments.push(newComment);
            await foundPost.save();
            res.status(200).send(foundPost.comments[foundPost.comments.length - 1]);
        } catch (err) {
            res.status(500).send({ message: `Failed to add comment to post with id '${req.params.id}'.` });
        }
    }

    async putComment(req: AuthResquest, res: Response) {
        try {
            let foundPost;

            // First, check if the post exists
            try {
                foundPost = await this.model.findById(req.params.id).exec();
                if (!foundPost) {
                    res.status(404).send({
                        message: `${this.modelName} with id '${req.params.id}' wat not found.`,
                    });
                    return;
                }
            } catch (err) {
                res.status(500).json({
                    message: `Failed to find ${this.modelName} with id '${req.params.id}'.`,
                    error: err.message,
                });
                return;
            }

            // Check if comment exist inside the post
            const comment = foundPost.comments.id(req.params.commentId);
            if (!comment) {
                res.status(404).send({
                    message: `Comment with id '${req.params.commentId}' was not found within the post with id '${req.params.id}'.`,
                });
                return;
            }

            // Check if the user is authorized to edit the comment
            if (this.isCommentActionAuthorized(comment, req.user._id)) {
                try {
                    // Edit the comment from the post
                    comment.text = req.body.text;
                    await foundPost.save();
                    res.status(200).send(comment);
                } catch (err) {
                    res.status(500).send({
                        message: `Failed to edit comment with id '${req.params.commentId}' in post with id '${req.params.id}'.`,
                    });
                }
            } else {
                res.status(403).send({
                    message: "You do not have the necessary permissions to perform this action.",
                });
            }
        } catch (err) {
            res.status(500).send({ message: `Failed to add comment to post with id '${req.params.id}'.` });
        }
    }

    async deleteComment(req: AuthResquest, res: Response) {
        try {
            let foundPost;

            // First, check if the post exists
            try {
                foundPost = await this.model.findById(req.params.id).exec();
                if (!foundPost) {
                    res.status(404).send({
                        message: `${this.modelName} with id '${req.params.id}' wat not found.`,
                    });
                    return;
                }
            } catch (err) {
                res.status(500).json({
                    message: `Failed to find ${this.modelName} with id '${req.params.id}'.`,
                    error: err.message,
                });
                return;
            }

            // Check if comment exist inside the post
            const comment = foundPost.comments.id(req.params.commentId);
            if (!comment) {
                res.status(404).send({
                    message: `Comment with id '${req.params.commentId}' was not found within the post with id '${req.params.id}'.`,
                });
                return;
            }

            // Check if the user is authorized to delete the comment
            if (this.isCommentActionAuthorized(comment, req.user._id)) {
                // Delete the comment from the post
                const commentIndex = foundPost.comments.indexOf(comment);
                if (commentIndex !== -1) {
                    foundPost.comments.splice(commentIndex, 1);
                    await foundPost.save();
                    res.status(200).send(comment);
                } else {
                    res.status(404).send({
                        message: `Comment with id '${req.params.commentId}' was not found within the post with id '${req.params.id}'.`,
                    });
                }
            } else {
                res.status(403).send({
                    message: "You do not have the necessary permissions to perform this action.",
                });
            }
        } catch (err) {
            res.status(500).send({ message: `Failed to add comment to post with id '${req.params.id}'.` });
        }
    }

    isPostActionAuthorized(post, userId: string) {
        // Check if the user is the owner of the post
        return userId === post.ownerId;
    }

    isCommentActionAuthorized(comment, userId: string) {
        // Check if the user is the author of the comment
        return userId === comment.authorId;
    }
}

export default new PostController();
