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

                const objects = await this.model.find({ name: req.query.category });
                res.send(objects);

            } else if (req.query.userid) {

                const objects = await this.model.find({ name: req.query.userid });
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
        console.log("getById: " + req.params.id);
        try {
            const student = await this.model.findById(req.params.id);
            res.send(student);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async post(req: Request, res: Response) {
        console.log("post: " + req.body);
        try {
            const obj = await this.model.create(req.body);
            res.status(201).send(obj);
        } catch (err) {
            console.log(err);
            res.status(406).send("fail: " + err.message);
        }
    }

    putById(req: Request, res: Response) {
        res.send("put by id: " + req.params.id);
    }

    deleteById(req: Request, res: Response) {
        res.send("delete by id: " + req.params.id);
    }
}

const createController = <ModelType>(model: Model<ModelType>) => {
    return new BaseController<ModelType>(model);
}

export default createController;