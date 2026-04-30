import { where } from "sequelize";
import Expense from "../models/Expense.js";

export const fetchallExpenses = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const allExpenses = await Expense.findAll({
      where: { userId },
    });
    return res.json({
      message: "All Expense",
      data: allExpenses,
      success: 1,
    });
  } catch (err) {
    console.log("ERROR:", err); 

    return res.json({
      message: "Something Went Wrong",
      data: [],
      success: 0,
    });
  }
};