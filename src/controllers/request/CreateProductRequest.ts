import {BrandType, OsType, ProductType} from "../../models/products";

export interface CreateProductRequest {
    name: string;
    price: number;
    typeProduct: ProductType;
    os: OsType;
    brand: BrandType;
    specificationsId?: number;
    images: Express.Multer.File[];
    createdAt?: Date;
    updatedAt?: Date;
}