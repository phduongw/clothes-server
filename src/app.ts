import express from 'express';
import bodyParser from "body-parser";

import { errorHandlerMiddleware } from "./middlewares/errorHandler.middleware";
import { reviewRoute, productRoute, authRoute } from './routes/index.routes';
import {bucketName, checkExistBucket} from "./middlewares/minioClient.middleware";

const app = express();
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); //CORS
    res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

app.use(bodyParser.json());
app.use(express.json());
app.use('/auth', authRoute);
app.use('/product', productRoute);
app.use('/review', reviewRoute);
app.use(errorHandlerMiddleware);


checkExistBucket(bucketName).then(() => {
    console.log("Connecting to Minio successfully!")
})

export default app;