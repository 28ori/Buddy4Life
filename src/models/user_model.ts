import mongoose from "mongoose";
import { Schema as validationSchema } from "express-validator";

export const userCredentialsValidationSchema: validationSchema = {
    email: {
        in: ["body"],
        isEmail: true,
        errorMessage: "Email is required and must be a valid email address.",
    },
    password: {
        in: ["body"],
        isString: true,
        isLength: {
            options: { min: 6, max: 20 },
            errorMessage: "Password must be a string between 6 and 20 characters long.",
        },
        errorMessage: "Password is required and must be a string between 6 and 20 characters long.",
    },
};

export const createUserValidationSchema: validationSchema = {
    ...userCredentialsValidationSchema,
    firstName: {
        in: ["body"],
        isString: true,
        isLength: {
            options: { min: 2 },
            errorMessage: "firstName must be a string with at least 2 characters.",
        },
        errorMessage: "First name is required and must be a string with at least 2 characters.",
    },
    lastName: {
        in: ["body"],
        isString: true,
        isLength: {
            options: { min: 2 },
            errorMessage: "lastName must be a string with at least 2 characters.",
        },
        errorMessage: "Last name is required and must be a string with at least 2 characters.",
    },
    imageUrl: {
        in: ["body"],
        optional: true,
        isString: true,
    },
};

export interface IUser {
    _id?: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    imageUrl?: string;
    refreshTokens?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: false,
        },
        refreshTokens: {
            type: [String],
            required: false,
        },
    },
    { collection: "users", timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
