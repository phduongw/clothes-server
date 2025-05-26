import { HydratedDocument } from "mongoose";

import { IReview } from "../models/review";
import { IProduct } from "../models/products";

export const addReviews = async (review: IReview, product: HydratedDocument<IProduct>) => {
    addReviewByRating(review, product);
    try {
        await product.save();
    } catch (error) {
        console.log("Adding review failed cause: ", error);
        throw error;
    }
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