import config from '../config/config';
import jwt from 'jsonwebtoken';

import { IUser } from "../models/user";

export const generateToken = (user: IUser): string => {
    return jwt.sign({
        fullName: user.fullName,
        email: user.email,
        role: user.role
    }, config.clientSecret, { expiresIn: '1h' });
}