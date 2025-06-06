import { Router } from "express";
import {creatReview} from "../controllers/review.controller";
import {verifyToken} from "../middlewares/jwt.middleware";

const router = Router();

router.post('/create', verifyToken, creatReview);

export default router;
