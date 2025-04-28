import { Schema, model } from "mongoose";

export interface IUser {
    username: string;
    password: string;
    dateOfBirth: Date;

}