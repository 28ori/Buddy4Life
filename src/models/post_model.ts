import mongoose from "mongoose";
import { Schema as validationSchema } from "express-validator";

enum Gender {
    MALE = "male",
    FEMALE = "female",
}

export const postIdValidationSchema: validationSchema = {
    id: {
        in: ["params"],
        isString: true,
        errorMessage: "id is required and must be a string.",
    },
};

export const getPostsValidationSchema: validationSchema = {
    ownerId: {
        in: ["query"],
        optional: true,
        isString: true,
        errorMessage: "ownerId must be a string.",
    },
};

const dogInfoValidationSchema: validationSchema = {
    "dogInfo.name": {
        in: ["body"],
        isString: true,
        isLength: { options: { min: 2, max: 30 } },
        errorMessage: "Name is required and must be a string between 2 and 30 characters long.",
    },
    "dogInfo.breed": {
        in: ["body"],
        isString: true,
        isLength: { options: { min: 2, max: 50 } },
        errorMessage: "Breed is required and must be a string between 2 and 50 characters long.",
    },
    "dogInfo.gender": {
        in: ["body"],
        isString: true,
        isIn: { options: [Object.values(Gender)] },
        errorMessage: `Gender is required and must be a valid option. Allowed options are: ${Object.values(Gender)}`,
    },
    "dogInfo.age": {
        in: ["body"],
        isInt: { options: { min: 0, max: 40 } },
        errorMessage: "Age is required and must be a number between 0 and 40.",
    },
    "dogInfo.weight": {
        in: ["body"],
        optional: true,
        isInt: { options: { gt: 0 } },
        errorMessage: "Weight must be a number greater than 0.",
    },
    "dogInfo.height": {
        in: ["body"],
        optional: true,
        isInt: { options: { gt: 0 } },
        errorMessage: "Height must be a number greater than 0.",
    },
    "dogInfo.color": {
        in: ["body"],
        optional: true,
        isString: true,
        isLength: { options: { min: 2, max: 30 } },
        errorMessage: "Color must be a string between 2 and 30 characters long.",
    },
};

export const createPostValidationSchema: validationSchema = {
    title: {
        in: ["body"],
        isString: true,
        isLength: { options: { min: 2, max: 50 } },
        errorMessage: "Title is required and must be a string between 2 and 50 characters long.",
    },
    description: {
        in: ["body"],
        isString: true,
        isLength: { options: { min: 2, max: 1000 } },
        errorMessage: "Description is required and must be a string between 2 and 1000 characters long.",
    },
    city: {
        in: ["body"],
        optional: true,
        isString: true,
        isLength: { options: { min: 2 } },
        errorMessage: "City must be a string with at least 2 characters.",
    },
    imageUrl: {
        in: ["body"],
        optional: true,
        isString: true,
    },
    dogInfo: {
        in: ["body"],
        isObject: { errorMessage: "dogInfo must be valid." },
        errorMessage: "dogInfo is required.",
    },
    ...dogInfoValidationSchema,
};

export const updatePostValidationSchema: validationSchema = {
    ...postIdValidationSchema,
    ...createPostValidationSchema,
};

interface IDogInfo {
    name: string;
    breed: string;
    gender: Gender;
    age: number;
    weight?: number;
    height?: number;
    color?: string;
}

export interface IPost {
    _id?: string;
    title: string;
    ownerId: string;
    description: string;
    dogInfo: IDogInfo;
    city?: string;
    imageUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const dogInfoSchema = new mongoose.Schema<IDogInfo>({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
    },
    breed: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female"],
    },
    age: {
        type: Number,
        required: true,
        min: 0,
        max: 40,
    },
    weight: {
        type: Number,
        required: false,
        min: 0,
    },
    height: {
        type: Number,
        required: false,
        min: 0,
    },
    color: {
        type: String,
        required: false,
        minlength: 2,
        maxlength: 30,
    },
});

const postSchema = new mongoose.Schema<IPost>(
    {
        title: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 50,
        },
        ownerId: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 1000,
        },
        dogInfo: {
            type: dogInfoSchema,
            required: true,
        },
        city: {
            type: String,
            required: false,
            minlength: 2,
        },
        imageUrl: {
            type: String,
            required: false,
        },
    },
    { collection: "posts", timestamps: true, versionKey: false }
);

export default mongoose.model<IPost>("Post", postSchema);
