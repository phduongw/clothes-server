import { Schema, model } from "mongoose";
import { ISpecification } from "./specification-product";

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

export interface IColor {
    colorCode: string;
    images: string[];
    details: [
        {
            storage: number;
            quantity: number;
        }
    ];
}

export interface IProduct {
    name: string;
    active: boolean;
    price: number;
    typeProduct: ProductType;
    os: OsType;
    brand: BrandType;
    color?: IColor[];
    createdAt?: Date;
    updatedAt?: Date;
    specification: ISpecification
}

const productSchema = new Schema<IProduct>({
    name: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
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
    specification: {
        type: Schema.Types.ObjectId,
        ref: 'Specifications',
        required: true
    },
    color: [
        {
            colorCode: {
                type: String,
                required: true,
                unique: true
            },
            images: {
                type: [String],
                required: true
            },
            details: [
                {
                    storage: {
                        type: Number,
                        required: true
                    },
                    quantity: {
                        type: Number,
                        default: 0
                    }
                }
            ]
        }
    ]
}, { timestamps: true });

export default model<IProduct>("Products", productSchema);
