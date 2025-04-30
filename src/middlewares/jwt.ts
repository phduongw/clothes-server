import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

import config from '../config/config';
import { IUser } from "../models/user";
import {BaseResponse} from "../controllers/responses/BaseResponse";

export const generateToken = (user: IUser): string => {
    return jwt.sign({
        fullName: user.fullName,
        email: user.email,
        role: user.role
    }, config.clientSecret, { expiresIn: '1h' });
}

export const verifyToken = (req: Request, resp: Response, next: NextFunction)=> {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.split(' ').length > 0) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, config.clientSecret, (err: any, user: any) => {
            if (err) {
                return resp.status(401).json(new BaseResponse().failed(401, "Token invalid"));
            }

            (req as any).user = user;

            return next();
        });

        return;
    }

    return resp.status(401).json(new BaseResponse().failed(401, "Unauthorized"));
}