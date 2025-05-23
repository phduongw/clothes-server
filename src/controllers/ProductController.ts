import { Request, Response } from 'express';
import { v4 as uuidv4 } from "uuid";

import User from "../models/user";
import Products, {IColor, IProduct} from "../models/products";
import Specification, { ISpecification } from '../models/specification-product'
import { CreateProductRequest } from "./request/CreateProductRequest";
import { BaseResponse } from "./responses/BaseResponse";
import { errorCode } from "../common/errorConstants";
import { bucketName, minioClient } from "../middlewares/minioClient";
import { getEmailInToken } from "../middlewares/jwt";
import { IAddBatchFavorite } from "./request/AddBatchFavorite";
import {ICreateColorInfoProductRequest} from "./request/CreateColorInfoProductRequest";

type RequestPagingQuery = {
    page: number;
    size: number;
}


type ProductFilter = {
    productFilter: 'best-seller' | 'new-arrival' | 'featured-products' | 'all';
}

type AllProductQueryFilter = ProductFilter & RequestPagingQuery;

export const createNewProduct = async (req: Request<{}, {}, CreateProductRequest>, resp: Response) => {
    const body = req.body;
    try {
        const specification = await Specification.findById(body.specificationsId);
        if (!specification) {
            resp.status(200).json(new BaseResponse<null>().failed(400, "specification doesn't existing", errorCode.product.saveProductFailed));
            return;
        }

        const product = new Products({
            name: body.name,
            price: body.price,
            typeProduct: body.typeProduct,
            specification: specification,
            os: body.os,
            brand: body.brand
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

export const findAll = async (req: Request<{}, {}, {}, AllProductQueryFilter>, res: Response) => {
    const { page = 1, size = 10, productFilter = 'new-arrival' } = req.query;
    try {
        let condition: any = { active: true };
        switch (productFilter) {
            case 'best-seller':
            case 'featured-products':
            case 'new-arrival': {
                const threeMonthAgo = new Date();
                threeMonthAgo.setMonth(threeMonthAgo.getMonth() - 3);
                condition.createdAt = {
                    $gte: threeMonthAgo
                };
                break;
            }
            default:
                break;
        }
        const total = await Products.countDocuments(condition);
        const allProduct = await Products.find(condition)
            .skip((page - 1) * size)
            .limit(size);

        res.status(200).json(new BaseResponse<{ items: IProduct[]; page: number; size: number, totalData: number }>().ok({ items: allProduct, page, size, totalData: total }))
    } catch (error) {
        console.log("Finding all products failed cause: ", error);
        res.status(200).json(new BaseResponse<{ items: IProduct[]; page: number; size: number, totalData: number }>().ok({ items: [], page, size, totalData: 0 }))
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

        res.status(200).json(new BaseResponse<IProduct>().ok(product))
    } catch (error) {
        console.log("Finding product failed cause: ", error);
        res.status(200).json(new BaseResponse<null>().failed(500, "Internal Server Error", errorCode.common.serverDown))
    }
}

export const reviseFavoriteList = async (req: Request<{ productId: string }, {}, {}, {action: 'add' | 'remove'}>, res: Response) => {
    const { productId } = req.params;
    let { action } = req.query;
    const email = getEmailInToken(req);
    try {
        const product = await Products.exists({_id: productId})
        if (!product) {
            console.log("Cannot find product with id: " + productId);
            res.status(200).json(new BaseResponse<null>().failed(404, "Product doesn't existing", errorCode.product.productNotFound));
            return
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.status(200).json(new BaseResponse<null>().failed(404, "User doesn't existing", errorCode.auth.emailExist));
            return;
        }

        const favoritesProduct = user.favoritesProduct;
        action = action ?? 'add'

        if (action === 'add' && !favoritesProduct.includes(productId)) {
            favoritesProduct.push(productId);
        }

        if (action === 'remove' && favoritesProduct.includes(productId)) {
            user.favoritesProduct = favoritesProduct.filter(ele => ele !== productId);
        }

        const response = await user.save();
        res.status(200).json(new BaseResponse<{ favoriteList: string[] }>().ok({ favoriteList: response.favoritesProduct }))
    } catch (error) {
        console.log("Finding product failed cause: ", error);
        res.status(200).json(new BaseResponse<null>().failed(500, "Internal Server Error", errorCode.common.serverDown))
    }
}

export const addBatchFavorite = async (req: Request<{}, {}, IAddBatchFavorite>, resp: Response) => {
    const email = getEmailInToken(req);
    const body = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            resp.status(200).json(new BaseResponse<null>().failed(404, "User doesn't existing", errorCode.auth.emailExist));
            return;
        }

        const products = await Products.find({
            _id: {
                $in: body.favoriteList
            }
        });

        if (!products.length) {
            resp.status(200).json(new BaseResponse<{favoriteList: string[]}>().ok({ favoriteList: user.favoritesProduct }));
        }

        for (const product of products) {
            user.favoritesProduct.push(product._id.toString());
        }

        const savedUser = await user.save();
        resp.status(200).json(new BaseResponse<{favoriteList: string[]}>().ok({ favoriteList: savedUser.favoritesProduct }));
    } catch (error) {
        console.log("Finding product failed cause: ", error);
        resp.status(200).json(new BaseResponse<null>().failed(500, "Internal Server Error", errorCode.common.serverDown))
    }
}

export const createNewSpecifications = async (req: Request<{}, {}, ISpecification>, resp: Response) => {
    const body = req.body;
    try {
        const specification = new Specification(body);
        const response = await specification.save();
        if (response) {
            resp.status(200).json(new BaseResponse<ISpecification>().ok(response));
            return;
        }

        resp.status(200).json(new BaseResponse<ISpecification>().failed(400, 'Creating new specification failed', errorCode.common.serverDown));
        return;
    } catch (error) {
        console.log("Finding product failed cause: ", error);
        resp.status(200).json(new BaseResponse<null>().failed(500, "Internal Server Error", errorCode.common.serverDown))
    }
}

export const getAllSpecification = async (req: Request<{}, {}, {}>, resp: Response)=> {
    try {
        const data = await Specification.find();
        if (data) {
            resp.status(200).json(new BaseResponse<ISpecification[]>().ok(data));
            return;
        }

        resp.status(200).json(new BaseResponse<ISpecification>().failed(400, 'Creating new specification failed', errorCode.common.serverDown));
        return;
    } catch (error) {
        console.log("Finding product failed cause: ", error);
        resp.status(200).json(new BaseResponse<null>().failed(500, "Internal Server Error", errorCode.common.serverDown));
    }
}

export const getSpecificationById = async (req: Request<{id: string}, {}, {}>, resp: Response) => {
    try {
        const data = await Specification.findById(req.params.id);
        if (data) {
            resp.status(200).json(new BaseResponse<ISpecification>().ok(data));
            return;
        }

        resp.status(200).json(new BaseResponse<ISpecification>().failed(400, 'Creating new specification failed', errorCode.common.serverDown));
        return;
    } catch (error) {
        console.log("Finding product failed cause: ", error);
        resp.status(200).json(new BaseResponse<null>().failed(500, "Internal Server Error", errorCode.common.serverDown));
    }
}

export const addColorProduct = async (req: Request<{}, {}, ICreateColorInfoProductRequest>, resp: Response) => {
    const body = req.body;
    try {
        const product = await Products.findById(body.productId);
        if (!product) {
            resp.status(200).json(new BaseResponse<null>().failed(400, "Product doesn't existing", errorCode.product.productNotFound));
            return;
        }

        const colorCode = product.color?.find(ele => ele.colorCode === body.colorCode);
        if (colorCode) {
            resp.status(200).json(new BaseResponse<null>().failed(400, "Color Code is existing", errorCode.product.productNotFound));
            return;
        }

        const details = JSON.parse(body.storage) as [{ storage: number, quantity: number}]

        const allowsType = ["image/jpeg", "image/png"];
        const filesBuffer = req.files as Express.Multer.File[];
        const imagesUrl: string[] = [];
        if (filesBuffer) {
            for (const file of filesBuffer) {
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

        const color: IColor = {
            colorCode: body.colorCode,
            details: details,
            images: imagesUrl
        }

        product.color?.push(color);
        product.save();
        resp.status(200).json(new BaseResponse<null>().ok(null));
    } catch (error) {
        console.log("Finding product failed cause: ", error);
        resp.status(200).json(new BaseResponse<null>().failed(500, "Internal Server Error", errorCode.common.serverDown));
    }
}

async function getPresignedUrl(fileName: string): Promise<string> {
    return await minioClient.presignedGetObject(bucketName, fileName,  7 * 24 * 60 * 60); // URL tồn tại 24h
}