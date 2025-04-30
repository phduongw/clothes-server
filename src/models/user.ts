import { Schema, model } from "mongoose";

export enum Gender {
    MALE = "male",
    FEMALE = 'female',
    OTHER = 'other'
}

export enum AddressType {
    HOME = 'home',
    WORK = 'work',
    OTHER = 'other'
}

export enum Role {
    ADMIN = 'admin',
    USER = 'user',
    GUEST = 'guest'
}

export interface IAddress {
    addressType: AddressType;
    address: string;
    receiver: string;
    receiverPhoneNumber: string
}

export interface IUser {
    fullName: string;
    email: string;
    password: string;
    dob: Date;
    gender: Gender
    phoneNumber: string;
    infoReceiving?: IAddress[];
    role: Role;
    active: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
    password: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: false
    },
    gender: {
        type: String,
        required: true,
        enum: Object.values(Gender)
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    infoReceiving: {
        type: [Object],
        required: false
    },
    phoneNumber: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: Object.values(Role)
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default model<IUser>("Users", userSchema);