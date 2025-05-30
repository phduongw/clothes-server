import { HydratedDocument } from "mongoose";

import { IReview } from "../models/review";
import Products, {IProduct, ProductType} from "../models/products";
import {RequestPagingQuery} from "../controllers/request/PagingRequest";
import {getPresignedUrl} from "../controllers/ProductController";

export const addReviews = async (review: IReview, product: HydratedDocument<IProduct>) => {
    addReviewByRating(review, product);
    try {
        await product.save();
    } catch (error) {
        console.log("Adding review failed cause: ", error);
        throw error;
    }
}

export const findAllByProductType = async (request: RequestPagingQuery & { catalog: string }) => {
    const productType = getProductType(request.catalog);
    if (!productType) {
        throw new Error("Product type not found.");
    }

    const condition = {
        typeProduct: productType,
    };

    try {
        const total = await Products.countDocuments(condition);
        const items = await Products
            .find(condition)
            .skip((request.page - 1) * request.size)
            .limit(request.size);

        if (items) {
            await generateUrlImage(items)

            return {
                items,
                page: request.page,
                size: request.size,
                total,
            }
        }

        return {
            items: [],
            page: request.page,
            size: request.size,
            total: 0,
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const generateUrlImage = async (items: IProduct[]) => {
    for (const product of items) {
        if (product.color) {
            for (const color of product.color) {
                for (let i = 0; i < color.images.length; i++) {
                    color.images[i] = await getPresignedUrl(color.images[i]);
                }
            }
        }
    }

    return items;
}

const addReviewByRating = (review: IReview, product: IProduct) => {
    switch (review.rating) {
        case 1: {
            product.reviews._1.push(review);
            break;
        }
        case 2: {
            product.reviews._2.push(review);
            break;
        }
        case 3: {
            product.reviews._3.push(review);
            break;
        }
        case 4: {
            product.reviews._4.push(review);
            break;
        }
        case 5: {
            product.reviews._5.push(review);
        }
    }
}

const getProductType = (catalog: string) => {
    return Object.values(ProductType).find(value => value === catalog);
}