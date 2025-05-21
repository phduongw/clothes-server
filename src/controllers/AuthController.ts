import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import config from "../config/config";
import Users, {IUser, Role} from '../models/user';
import { ISignUpRequest } from "./request/SignUpRequest";
import { ISignInRequest } from "./request/SignInRequest";
import { BaseResponse } from "./responses/BaseResponse";
import { generateToken } from "../middlewares/jwt";
import { ILoginResponse } from "./responses/LoginResponse";
import {errorCode} from "../common/errorConstants";

export const signup = async (req: Request<{}, {}, ISignUpRequest>, resp: Response) => {
    const body = req.body;
    try {
        if (await isExistAccount(body.email)) {
            resp.status(200).json(new BaseResponse<null>().failed(400, "Email already exist", errorCode.auth.emailExist));
            return;
        }

        if (body.password !== body.repeatPassword) {
            resp.status(200).json(new BaseResponse<null>().failed(400, "Password and not match", errorCode.auth.passwordNotMatch));
            return;
        }

        const hashedPassword = await bcrypt.hash(body.password, 12)
        const user = new Users({
            fullName: body.fullName,
            email: body.email,
            password: hashedPassword,
            dob: body.dob,
            gender: body.gender,
            phoneNumber: body.phoneNumber,
            role: Role.GUEST,
        });

        const createdUser = await user.save();
        if (!createdUser) {
            resp.status(200).json(new BaseResponse().failed(400, "Failed to create account", errorCode.auth.failedToSave));
            return;
        }

        resp.status(200).json(new BaseResponse<IUser>().ok(createdUser));
    } catch (error) {
        console.log("Creating account failed cause: ", error);
        resp.status(200).json(new BaseResponse().failed(500, "Internal Server Error", errorCode.common.serverDown));
    }
}

export const login = async (req: Request<{}, {}, ISignInRequest>, resp: Response) => {
    const body = req.body;
    const user = await findUserByEmail(body.email);
    if (!user) {
        resp.status(200).json(new BaseResponse().failed(400, "Email or password isn't correct", errorCode.auth.loginFailure));
        return;
    }

    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) {
        console.log("login ---> " + body.email + "'s password is incorrect")
        resp.status(200).json(new BaseResponse().failed(400, "Email or password isn't correct", errorCode.auth.loginFailure));
        return;
    }

    const accessToken = generateToken(user);
    const data: ILoginResponse = {
        accessToken,
        expiresIn: config.expiresIn,
        favoriteList: user.favoritesProduct
    }
    resp.status(200).json(new BaseResponse<ILoginResponse>().ok(data));
}

const isExistAccount = async (email: string) => {
    const existingUser = await findUserByEmail(email);
    return !!existingUser;
}

const findUserByEmail = async (email: string) => {
    return Users.findOne({ email, active: true });
}