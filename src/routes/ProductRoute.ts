import {Router} from "express";

import {upload} from "../middlewares/uploadFile";
import {createNewProduct, findById} from "../controllers/ProductController";

const router = Router();



router.get('/:productId', findById);
router.post('/create', upload.fields([
    {name: 'images', maxCount: 5}
]), createNewProduct)

export default router;