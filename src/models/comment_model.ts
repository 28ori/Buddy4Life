import mongoose from "mongoose";
import { Schema as validationSchema } from "express-validator";
import { postIdValidationSchema } from "./post_model";

export const commentIdValidationSchema: validationSchema = {
    commentId: {
        in: ["params"],
        isString: true,
        errorMessage: "commentId is required and must be a string.",
    },
    ...postIdValidationSchema,
};

export const createCommentValidationSchema: validationSchema = {
    text: {
        in: ["body"],
        isString: true,
        isLength: { options: { min: 1, max: 1000 } },
        errorMessage: "Text is required and must be a string between 1 and 1000 characters long.",
    },
};

export interface IComment {
    authorId: string;
    text: string;
}

export const commentSchema = new mongoose.Schema<IComment>({
    authorId: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 1000,
    },
});

export default mongoose.model<IComment>("Comment", commentSchema);
