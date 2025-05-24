import * as Minio from "minio";
import dotenv from 'dotenv';

dotenv.config();
export const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_IP!,
    port: parseInt(process.env.MINIO_PORT!),
    useSSL: false,
    accessKey: process.env.ACCESS_KEY!,
    secretKey: process.env.SECRET_KEY!,
});

export const bucketName = 'e-commerce';


export const checkExistBucket = async (bucket: string) => {
    try {
        const exists = await minioClient.bucketExists(bucket)
        if (!exists) {
            await minioClient.makeBucket(bucket)
            console.log("Creating new Bucket successfully")
        } else {
            console.log("Bucket already exists")
        }
    } catch (err) {
        console.error('Error with bucket:', err);
    }
}
