import {Router} from "express";

import {upload} from "../middlewares/uploadFile";
import {createNewProduct, findAll, findById} from "../controllers/ProductController";

const router = Router();



router.get('/', findAll);
router.get('/:productId', findById);
router.post('/create', upload.fields([
    {name: 'images', maxCount: 5}
]), createNewProduct)

export default router;