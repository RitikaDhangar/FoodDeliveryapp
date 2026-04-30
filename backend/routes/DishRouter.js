import express from 'express'
const router=express.Router();
import {addDishedDb, alldishes} from '../controller/dishController.js';
import { verifyToken } from '../middleware/jwtverify.js';
router.use(verifyToken)
router.post('/createDishes',addDishedDb);
router.post('/alldishes',alldishes);
export default router;