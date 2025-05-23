import {Router} from "express";

import {upload} from "../middlewares/uploadFile";
import {
    addBatchFavorite, addColorProduct,
    createNewProduct, createNewSpecifications,
    findAll,
    findById, getAllSpecification, getSpecificationById,
    reviseFavoriteList
} from "../controllers/ProductController";
import {verifyToken} from "../middlewares/jwt";

const router = Router();



router.post('/revise-favorite', verifyToken, addBatchFavorite);
router.post('/specification', verifyToken, createNewSpecifications);
router.post('/create', upload.array('images', 5), createNewProduct)
router.post('/add-color', upload.array('images', 5), verifyToken, addColorProduct)

router.get('/', findAll);
router.get('/specification', verifyToken, getAllSpecification);
router.get('/specification/:id', verifyToken, getSpecificationById);
router.get('/:productId', findById);

router.put('/revise-favorite/:productId', verifyToken, reviseFavoriteList);
export default router;