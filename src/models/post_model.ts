import mongoose from "mongoose";
import { Schema as validationSchema } from "express-validator";

enum Category {
    ADOPT = "adopt",
    REHOME = "rehome",
}

enum Gender {
    MALE = "male",
    FEMALE = "female",
}

const dogInfoValidationSchema: validationSchema = {
    "dogInfo.name": {
        in: ["body"],
        optional: true,
        isString: true,
        isLength: { options: { min: 2, max: 30 } },
        errorMessage: "Name must be a string between 2 and 30 characters long.",
    },
    "dogInfo.breed": {
        in: ["body"],
        optional: true,
        isString: true,
        isLength: { options: { min: 2, max: 50 } },
        errorMessage: "Breed must be a string between 2 and 50 characters long.",
    },
    "dogInfo.gender": {
        in: ["body"],
        optional: true,
        isString: true,
        isIn: { options: [Object.values(Gender)] },
        errorMessage: `Gender is required and must be a valid option. Allowed options are: ${Object.values(Gender)}`,
    },
    "dogInfo.age": {
        in: ["body"],
        optional: true,
        isInt: { options: { min: 0, max: 40 } },
        errorMessage: "Age must be a number between 0 and 40.",
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
    category: {
        in: ["body"],
        isString: true,
        isIn: { options: [Object.values(Category)] },
        errorMessage: `Category is required and must be a valid option. Allowed options are: ${Object.values(
            Category
        )}`,
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
        errorMessage: "City is required and must be a string with at least 2 characters.",
    },
    imageUrl: {
        in: ["body"],
        optional: true,
        isString: true,
    },
    dogInfo: {
        in: ["body"],
        exists: {
            if: (value: unknown, { req }) => req.body.category === Category.REHOME,
            errorMessage: "dogInfo is required in case the chosen category is 'rehome'.",
        },
        isObject: { errorMessage: "dogInfo must be valid." },
    },
    ...dogInfoValidationSchema,
};

interface IDogInfo {
    name?: string;
    breed?: string;
    gender?: string;
    age?: number;
    weight?: number;
    height?: number;
    color?: string;
}

export interface IPost {
    _id?: string;
    title: string;
    ownerId: string;
    category: string;
    description: string;
    dogInfo?: IDogInfo;
    city?: string;
    imageUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const dogInfoSchema = new mongoose.Schema<IDogInfo>({
    name: {
        type: String,
        required: false,
        minlength: 2,
        maxlength: 30,
    },
    breed: {
        type: String,
        required: false,
        minlength: 2,
        maxlength: 50,
    },
    gender: {
        type: String,
        required: false,
        enum: ["male", "female"],
    },
    age: {
        type: Number,
        required: false,
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
        category: {
            type: String,
            required: true,
            enum: Category,
        },
        description: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 1000,
        },
        dogInfo: {
            type: dogInfoSchema,
            required: false,
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
