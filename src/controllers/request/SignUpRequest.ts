import { Gender } from "../../models/user";

export interface ISignUpRequest {
    fullName: string;
    email: string;
    dob: Date;
    gender: Gender;
    phoneNumber: string;
    password: string;
    repeatPassword: string;
}