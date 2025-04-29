import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import Users from '../models/user';
import { ISignUpRequest } from "./request/SignUpRequest";
import { BaseResponse } from "./responses/BaseResponse";


export const signup = async (req: Request<{}, {}, ISignUpRequest>, resp: Response) => {
    const body = req.body;
    try {
        if (await isExistAccount(body.email)) {
            resp.status(200).json(new BaseResponse().failed(400, "Email already exist"));
            return;
        }

        if (body.password !== body.repeatPassword) {
            resp.status(200).json(new BaseResponse().failed(400, "Password and not match"));
            return;
        }

        const hashedPassword = await bcrypt.hash(body.password, 12)
        const user = new Users({
            ...body,
            password: hashedPassword
        });

        const createdUser = await user.save();
        if (!createdUser) {
            resp.status(200).json(new BaseResponse().failed(400, "Failed to create account"));
            return;
        }

        resp.status(200).json(new BaseResponse().ok(createdUser));
    } catch (error) {
        console.log("Creating account failed cause: ", error)
        resp.status(200).json(new BaseResponse().failed(500, "Internal Server Error"));
    }
}


const isExistAccount = async (email: string) => {
    const existingUser = await Users.findOne({ email, active: true });
    return !!existingUser;
}