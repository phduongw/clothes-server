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
    specifications: ISpecification;
}
