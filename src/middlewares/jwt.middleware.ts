import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

import config from '../config/config';
import { IUser } from "../models/user.schema";
import {BaseResponseDto} from "../controllers/responses/BaseResponse.dto";
import {errorCode} from "../common/errorConstants";

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
                return resp.status(401).json(new BaseResponseDto().failed(401, "Token invalid", errorCode.auth.tokenInvalid));
            }

            (req as any).user = user;

            next();
        });
    } else {
        resp.status(401).json(new BaseResponseDto().failed(401, "Unauthorized", errorCode.auth.authenticatedFailed));
    }
}

export const getEmailInToken = (req: Request) => {
    return (req as any).user.email;
}

export const getFullNameInToken = (req: Request) => {
    return (req as any).user.fullName;
}

