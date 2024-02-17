import { Request, Response } from "express";
import fetch from "node-fetch";

const url = `https://${process.env.DOG_API_HOST}`;

const options = {
    method: "GET",
    headers: {
        "X-RapidAPI-Key": process.env.DOG_API_KEY,
        "X-RapidAPI-Host": process.env.DOG_API_HOST,
    },
};

const get = async (req: Request, res: Response) => {
    try {
        const result = await fetch(url, options).then((response) => response.json());
        const dogsNames = result.map((breed) => [breed.id, breed.breedName]);

        res.send(dogsNames);
    } catch (err) {
        res.status(500).json({
            message: "Error retrieving all dogs types with error: " + err.message,
        });

        return;
    }
};

const getById = async (req: Request, res: Response) => {
    try {
        const idUrl = url + `/?id=${req.params.id}`;
        const result = await fetch(idUrl, options).then((response) => response.json());

        res.send(result);
    } catch (err) {
        res.status(500).json({
            message: `Error retrieving dog type: ${req.params.id} with error: ` + err.message,
        });
    }
};

export default {
    get,
    getById,
};
