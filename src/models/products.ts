import { Schema, model } from "mongoose";

export enum ProductType {
    PHONES = 'Phone',
    LAPTOP = 'Laptop',
    HEADPHONE = 'Headphone',
    WATCH = 'Watch'
}

export enum OsType {
    iOS= 'iOS',
    ANDROID = 'Android',
    MACOS = 'Mac OS'
}

export enum BrandType {
    SAMSUNG = 'Samsung',
    APPLE = 'Apple',
}

export interface ISpecification {
    cpu: string;
    coreCpu: number;
    ram: string;
    screenSize: string;
    mainCamera: string;
    frontCamera: string;
    batteryCapacity: string;
}

export interface IProduct {
    name: string;
    price: number;
    typeProduct: ProductType;
    os: OsType;
    brand: BrandType;
    specifications?: ISpecification;
    images: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

const productSchema = new Schema<IProduct>({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    typeProduct: {
        type: String,
        required: true,
        enum: Object.values(ProductType)
    },
    os: {
        type: String,
        required: true,
        enum: Object.values(OsType)
    },
    brand: {
        type: String,
        required: true,
        enum: Object.values(BrandType)
    },
    specifications: {
        type: Object,
        required: false
    },
    images: {
        type: [String],
        required: true
    }
}, { timestamps: true });

export default model<IProduct>("Products", productSchema);
