import { Request, Response } from 'express';


export interface AppError extends Error {
    status?: number;
}

export const errorHandlerMiddleware = (
    err: AppError,
    req: Request,
    resp: Response,
) => {
    console.error(err);
    resp.status(err.status ?? 500).json({
        message: err.message || "Internal Server Error",
    });
}