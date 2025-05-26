import { Request, Response } from "express";

import Product from "../models/products";
import { IReview } from "../models/review";
import { ICreatReviewRequest } from "./request/CreatReviewRequest";
import { getFullNameInToken } from "../middlewares/jwt";
import { BaseResponse } from "./responses/BaseResponse";
import { errorCode } from "../common/errorConstants";
import {createReview} from "../services/review.service";
import {addReviews} from "../services/product.service";

export const creatReview = async (req: Request<{}, {}, ICreatReviewRequest>, resp: Response) => {
    const fullName = getFullNameInToken(req);

    try {
        const body = req.body;
        const product = await Product.findById(body.productId);
        if (!product) {
            resp.status(200).json(new BaseResponse<null>().failed(404, "Product doesn't existing", errorCode.product.productNotFound));
            return;
        }

        const models = await createReview(body, fullName);
        await addReviews(models, product)
        resp.status(200).json(new BaseResponse<IReview>().ok(models));
        return;
    } catch (error) {
        console.log("Creating review failed cause: ", error);
        resp.status(200).json(new BaseResponse<null>().failed(500, "Internal Server Error", errorCode.common.serverDown));
    }
}