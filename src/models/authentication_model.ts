import { Schema as validationSchema } from "express-validator";

export const authValidationSchema: validationSchema = {
    authorization: {
        in: ["headers"],
        isString: {
            errorMessage: "Authorization header is required and must be a string.",
        },
    },
};

export const refreshTokenValidationSchema: validationSchema = {
    refreshToken: {
        in: ["cookies"],
        isString: {
            errorMessage: "Cookie with value refreshToken is required and must be a string.",
        },
    },
};
