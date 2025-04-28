import mongoose from "mongoose";


import app from './app'
import config from "./config/config";

mongoose.connect("mongodb://localhost:27017/clothes-web")
    .then(() => {
        console.log("MongoDB Connected");
        app.listen(config.port, () => {
            console.log(`Server running on port ${config.port}`);
        })
    })
    .catch(error => {
        console.log("Failed to connect to the server", error);
    });

