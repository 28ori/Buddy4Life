import mongoose from "mongoose";

export interface IPost {
    _id?: string;
    creationTime?: Date;
    title: string;
    category: string;
    breed: string;
    description: string;
    userid: string;
    age: number;
    color: string;
    city: string;
}

const postSchema = new mongoose.Schema<IPost>({
    creationTime: {
        type: Date,
        required: false,
    },
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    breed: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: true,
    },
    userid: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: false,
    },
    color: {
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: false,
    },
});

export default mongoose.model<IPost>("Post", postSchema);