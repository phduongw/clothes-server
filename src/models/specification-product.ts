import { Schema, model } from "mongoose";

export interface ISpecification {
    name: string
    cpu: string;
    coreCpu: number;
    ram?: string;
    screenSize: number;
    mainCamera: string;
    frontCamera: string;
    batteryCapacity: number;
}

const specificationSchema = new Schema<ISpecification>({
    name: {
        type: String,
        required: true,
    },
    cpu: {
        type: String,
        required: true
    },
    coreCpu: {
        type: Number,
        required: true
    },
    ram: {
        type: String,
        required: false
    },
    screenSize: {
        type: Number,
        required: true
    },
    mainCamera: {
        type: String,
        required: true
    },
    frontCamera: {
        type: String,
        required: true
    },
    batteryCapacity: {
        type: Number,
        required: true
    }
})

export default model<ISpecification>("Specifications", specificationSchema);
