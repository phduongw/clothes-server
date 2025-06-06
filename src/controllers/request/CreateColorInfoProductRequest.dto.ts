export interface ICreateColorInfoProductRequest {
    productId: string;
    colorCode: string;
    images: Express.Multer.File[];
    storage: string
}