
import { ICreatReviewRequest } from "../controllers/request/CreatReviewRequest.dto";
import Review from "../models/review.schema";


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