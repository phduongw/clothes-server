import {BrandType, OsType, ProductType} from "../../models/products.schema";

export interface CreateProductRequestDto {
    name: string;
    price: number;
    typeProduct: ProductType;
    os: OsType;
    brand: BrandType;
    specificationsId: string;
    images: Express.Multer.File[];
    createdAt?: Date;
    updatedAt?: Date;
}