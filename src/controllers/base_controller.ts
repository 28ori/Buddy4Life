import { Request, Response } from "express";
import { Model } from "mongoose";

export class BaseController<ModelType> {
    model: Model<ModelType>;
    modelName: string;

    constructor(model: Model<ModelType>, modelName: string) {
        this.model = model;
        this.modelName = modelName;
    }

    async get(req: Request, res: Response) {
        let filters = {};
        filters = { ...req.query };

        try {
            const foundDocuments = await this.model.find(filters).exec();
            res.status(200).json(foundDocuments);
        } catch (err) {
            res.status(500).json({
                message: `Failed to get ${this.modelName} with filters: ${filters}.`,
                error: err.message,
            });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const foundObj = await this.model.findById(req.params.id).exec();

            if (foundObj == null) {
                res.status(404).send({ message: `${this.modelName} with id '${req.params.id}' wat not found.` });
                return;
            }

            res.status(200).send(foundObj);
        } catch (err) {
            res.status(500).json({
                message: `Failed to find ${this.modelName} with id '${req.params.id}'.`,
                error: err.message,
            });
        }
    }

    async post(req: Request, res: Response) {
        try {
            const createdObj = await this.model.create(req.body);
            res.status(201).send(createdObj);
        } catch (err) {
            res.status(500).send({
                message: `Failed to create ${this.modelName} with values: ${req.body}.`,
                error: err.message,
            });
        }
    }

    async putById(req: Request, res: Response) {
        try {
            const updatedObj = await this.model.findByIdAndUpdate(req.params.id, req.body);
            res.status(200).send(updatedObj);
        } catch (err) {
            res.status(500).send({ message: `Failed to update ${this.modelName} with id '${req.params.id}'.` });
        }
    }

    async deleteById(req: Request, res: Response) {
        try {
            const deletedObj = await this.model.findByIdAndDelete(req.params.id);
            res.status(200).send(deletedObj);
        } catch (err) {
            res.status(500).send({ message: `Failed to delete ${this.modelName} with id '${req.params.id}'.` });
        }
    }
}
