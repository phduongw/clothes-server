import * as Minio from "minio";

export const minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'WWgdq95P87nmTMRgWE33',
    secretKey: '1MnMhWDsC3WULRfDv2t8xFn52gt8aW7AZW4ph065'
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
