import { Schema, model } from "mongoose";

export interface IReview {
    name: string;
    content: string;
    rating: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const reviewSchema = new Schema<IReview>({
    name: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    }
}, { timestamps: true });

export default model<IReview>("Reviews", reviewSchema);
