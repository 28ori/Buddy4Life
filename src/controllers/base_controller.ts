import { Request, Response } from "express";
import { Document, Model } from "mongoose";

export class BaseController<ModelType> {
    model: Model<ModelType>;
    constructor(model: Model<ModelType>) {
        this.model = model;
    }

    async get(req: Request, res: Response) {
        try {
            let objects: Document[];

            if (req.query.category) {
                objects = await this.model.find({
                    category: req.query.category,
                });
            } else if (req.query.ownerId) {
                objects = await this.model.find({
                    ownerId: req.query.ownerId,
                });
            } else {
                objects = await this.model.find();
            }

            res.send(objects);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const obj = await this.model.findById(req.params.id);
            res.send(obj);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async post(req: Request, res: Response) {
        try {
            const createdObj = await this.model.create(req.body);
            return res.status(201).send(createdObj.toObject({ versionKey: false }));
        } catch (err) {
            return res
                .status(500)
                .send({ message: `Failed to create object with values: ${req.body}`, error: err.message });
        }
    }

    async putById(req: Request, res: Response) {
        try {
            const obj = await this.model.findByIdAndUpdate(req.params.id, req.body);
            res.status(200).send(obj);
        } catch (err) {
            res.status(500).send("Fail: " + err.message);
        }
    }

    async deleteById(req: Request, res: Response) {
        try {
            const obj = await this.model.findByIdAndDelete(req.params.id);
            res.status(200).send(obj);
        } catch (err) {
            console.log(err);
        }
    }

    // async isActionAuthorized(postId: String, ownerId: String) {
    //     console.log("autorized action from base");
    //     try {
    //         const obj = await this.model.findById(postId);
    //         console.log("object is: " + obj.ownerId)
    //     } catch (err) {
    //         console.log(err);
    //         return false;
    //     }
    // }
}

const createController = <ModelType>(model: Model<ModelType>) => {
    return new BaseController<ModelType>(model);
};

export default createController;
