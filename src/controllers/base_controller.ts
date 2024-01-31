import { Request, Response } from "express";
import { Model } from "mongoose";

export class BaseController<ModelType>{

    model: Model<ModelType>
    constructor(model: Model<ModelType>) {
        this.model = model;
    }

    async get(req: Request, res: Response) {
        console.log("Get all");
        try {
            if (req.query.category) {

                const objects = await this.model.find({ category: req.query.category });
                res.send(objects);

            } else if (req.query.userid) {

                const objects = await this.model.find({ userid: req.query.userid });
                res.send(objects);

            } else {

                const objects = await this.model.find();
                res.send(objects);
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async getById(req: Request, res: Response) {
        console.log("getById: " + JSON.stringify(req.params.id));
        try {
            const obj = await this.model.findById(req.params.id);
            res.send(obj);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async post(req: Request, res: Response) {
        console.log("POST: " + JSON.stringify(req.body));
        try {
            const obj = await this.model.create(req.body);
            res.status(201).send(obj);
        } catch (err) {
            console.log(err);
            res.status(406).send("fail: " + err.message);
        }
    }

    async putById(req: Request, res: Response) {
        console.log("put by id: " + JSON.stringify(req.params._id));
        try {
            const obj = await this.model.findByIdAndUpdate(req.params.id, req.body);
            res.status(200).send(obj);
        } catch (err) {
            console.log(err);
        }
    }

    async deleteById(req: Request, res: Response) {
        console.log("delete by id: " + JSON.stringify(req.params.id));
        try {
            const obj = await this.model.findByIdAndDelete(req.params.id);
            res.status(200).send(obj);
        } catch (err) {
            console.log(err);
        }
    }

    // async isActionAuthorized(postId: String, userid: String) {
    //     console.log("autorized action from base");
    //     try {
    //         const obj = await this.model.findById(postId);
    //         console.log("object is: " + obj.userid)
    //     } catch (err) {
    //         console.log(err);
    //         return false;
    //     }
    // }


}

const createController = <ModelType>(model: Model<ModelType>) => {
    return new BaseController<ModelType>(model);
}

export default createController;