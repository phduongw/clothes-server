
import { ICreatReviewRequest } from "../controllers/request/CreatReviewRequest";
import Review from "../models/review";


export const createReview = async (request: ICreatReviewRequest, ownerReview: string) => {
    const review = new Review({
        name: ownerReview,
        content: request.content,
        rating: request.rating
    });

    try {
        return await review.save();
    } catch (error) {
        console.log("Creating review failed cause: ", error);
        throw error;
    }
}