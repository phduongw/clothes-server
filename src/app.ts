import express from 'express';
import bodyParser from "body-parser";

import { errorHandler } from "./middlewares/errorHandler";
import authRoute from './routes/AuthRoute';
import productRoute from './routes/ProductRoute';
import {bucketName, checkExistBucket} from "./middlewares/minioClient";

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
app.use(errorHandler);


checkExistBucket(bucketName).then(() => {
    console.log("Connecting to Minio successfully!")
})

export default app;