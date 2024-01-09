import mongoose from "mongoose";

export interface IUserPost {
  title: string;
  message: string;
  owner: string;
}

const userPostSchema = new mongoose.Schema<IUserPost>({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IUserPost>("UserPost", userPostSchema);