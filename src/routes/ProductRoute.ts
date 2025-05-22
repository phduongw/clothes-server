import {Router} from "express";

import {upload} from "../middlewares/uploadFile";
import {
    addBatchFavorite,
    createNewProduct,
    findAll,
    findById,
    reviseFavoriteList
} from "../controllers/ProductController";
import {verifyToken} from "../middlewares/jwt";

const router = Router();



router.get('/', findAll);
router.get('/:productId', findById);
router.post('/revise-favorite', verifyToken, addBatchFavorite);
router.put('/revise-favorite/:productId', verifyToken, reviseFavoriteList);
router.post('/create', upload.fields([
    {name: 'images', maxCount: 5}
]), createNewProduct)

export default router;