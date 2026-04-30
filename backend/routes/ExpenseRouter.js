import express from 'express'
const router=express.Router();
import { verifyToken } from '../middleware/jwtverify.js';
import { fetchallExpenses } from '../controller/ExpenseController.js';
router.get('/fetchAllExpense',verifyToken, fetchallExpenses);
export default router;