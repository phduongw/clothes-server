import { Request, Response } from 'express';
import { v4 as uuidv4 } from "uuid";

import Products, { IProduct } from "../models/products";
import { CreateProductRequest } from "./request/CreateProductRequest";
import { BaseResponse } from "./responses/BaseResponse";
import { errorCode } from "../common/errorConstants";
import { bucketName, minioClient } from "../middlewares/minioClient";

export const createNewProduct = async (req: Request<{}, {}, CreateProductRequest>, resp: Response) => {
    const allowsType = ["image/jpeg", "image/png"];
    const body = req.body;
    try {
        const filesBuffer = req.files as { [fieldName: string]: Express.Multer.File[] };

        const imagesUrl: string[] = [];
        if (filesBuffer) {
            for (const file of filesBuffer.images) {
                if (!allowsType.includes(file.mimetype)) {
                    resp.status(200).json(new BaseResponse<null>().failed(400, "File type not allow", errorCode.common.fileImageNotAllow));
                    return;
                }

                const fileName = `${uuidv4()}-${file.originalname}`
                await minioClient.putObject(bucketName, fileName, file.buffer, file.size, {
                    'Content-Type': file.mimetype,
                });

                imagesUrl.push(fileName);
            }
        }

        const product = new Products({
            name: body.name,
            price: body.price,
            typeProduct: body.typeProduct,
            os: body.os,
            brand: body.brand,
            specificationsId: body.specificationsId,
            images: imagesUrl,
        })

        const createdProduct = await product.save();
        if (!createdProduct) {
            resp.status(200).json(new BaseResponse<null>().failed(400, "Failed to create product", errorCode.product.saveProductFailed));
            return;
        }

        resp.status(200).json(new BaseResponse<IProduct>().ok(createdProduct))
    } catch (error) {
        console.log("Creating product failed cause: ", error);
        resp.status(200).json(new BaseResponse<null>().failed(500, "Internal Server Error", errorCode.common.serverDown))
    }
}

export const findById = async (req: Request<{ productId: string }, {}, {}>, res: Response) => {
    const id = req.params.productId;
    try {
        const product = await Products.findById(id).lean();
        if (!product) {
            console.log("Cannot find product with id: " + id);
            res.status(200).json(new BaseResponse<null>().failed(404, "Product doesn't existing", errorCode.product.productNotFound));
            return
        }

        const urlImage = await Promise.all(
            product.images.map(async (image) => await getPresignedUrl(image))
        );

        res.status(200).json(new BaseResponse<IProduct>().ok({
            ...product,
            images: urlImage
        }))
    } catch (error) {
        console.log("Finding product failed cause: ", error);
        res.status(200).json(new BaseResponse<null>().failed(500, "Internal Server Error", errorCode.common.serverDown))
    }
}

async function getPresignedUrl(fileName: string): Promise<string> {
    return await minioClient.presignedGetObject(bucketName, fileName,  7 * 24 * 60 * 60); // URL tồn tại 24h
}