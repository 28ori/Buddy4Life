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
        const result = await fetch(url, options).then((response) =>
            response.json()
        );
        const dogsNames = result.map((breed) => [breed.id, breed.breedName]);

        res.send(dogsNames);
    } catch (err) {
        res.status(500).json({
            message:
                "Error retrieving all dogs types with error: " + err.message,
        });

        return;
    }
};

const getById = async (req: Request, res: Response) => {
    try {
        const idUrl = url + `/?id=${req.params.id}`;
        const result = await fetch(idUrl, options).then((response) =>
            response.json()
        );

        res.send(result);
    } catch (err) {
        res.status(500).json({
            message:
                `Error retrieving dog type: ${req.params.id} with error: ` +
                err.message,
        });
    }
};

//     async post(req: Request, res: Response) {
//         console.log("POST: " + JSON.stringify(req.body));
//         try {
//             const obj = await this.model.create(req.body);
//             res.status(201).send(obj);
//         } catch (err) {
//             console.log(err);
//             res.status(406).send("fail: " + err.message);
//         }
//     }

//     async putById(req: Request, res: Response) {
//         console.log("put by id: " + JSON.stringify(req.params._id));
//         try {
//             const obj = await this.model.findByIdAndUpdate(req.params.id, req.body);
//             res.status(200).send(obj);
//         } catch (err) {
//             console.log(err);
//         }
//     }

//     async deleteById(req: Request, res: Response) {
//         console.log("delete by id: " + JSON.stringify(req.params.id));
//         try {
//             const obj = await this.model.findByIdAndDelete(req.params.id);
//             res.status(200).send(obj);
//         } catch (err) {
//             console.log(err);
//         }
//     }

//     // async isActionAuthorized(postId: String, userid: String) {
//     //     console.log("autorized action from base");
//     //     try {
//     //         const obj = await this.model.findById(postId);
//     //         console.log("object is: " + obj.userid)
//     //     } catch (err) {
//     //         console.log(err);
//     //         return false;
//     //     }
//     // }

// }

export default {
    get,
    getById,
};
