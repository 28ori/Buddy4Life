import { checkSchema, validationResult, Schema } from "express-validator";
import { Request, Response, NextFunction } from "express";

const validationMiddleware = (schema: Schema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await checkSchema(schema).run(req);
        } catch (errors) {
            return res.status(400).json({ errors: errors.array() });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

        next();
    };
};

export default validationMiddleware;
