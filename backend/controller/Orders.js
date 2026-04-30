import Razorpay from "./utils/razorpay.js";
import Orders from "../models/Order.js";
import Expense from "../models/Expense.js";
import crypto from "crypto";
import Order from "../models/Order.js";
import { where } from "sequelize";
import sequelize from "../config/database.js";
import { generateToken } from "./utils/jwt.js";
export const createOrder = async (req, res) => {
    const amount=req.body.amount;
  try {
    const newOrder = await Razorpay.orders.create({
      amount,
      currency: "INR",
    });
    await Orders.create({
      razorpay_order_id: newOrder?.id,
      status: "CREATED",
      userId: req?.user?.id,
    });
    return res.json({
      message: "Order created successfully",
      data: newOrder,
      key_id: process.env.RAZORPAY_KEY_ID,
      success: 1,
    });
  } catch (err) {
    console.log(`Error in createOrder is ${err}`);
    return res.json({ message: "Something went wrong", data: [], success: 0 });
  }
};

export const verifyPayment = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cartItems,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await t.rollback();
      return res.json({
        message: "Payment verification failed",
        success: 0,
      });
    }

    const formattedExpenses = cartItems.map((item) => ({
      dishName: item.dishName,
      price: item.price,
      quantity: Number(item.quantity),
      userId:req.user.id
    }));

    await Expense.bulkCreate(formattedExpenses, {
      transaction: t,
    });

    await Order.update(
      {
        razorpay_payment_id,
        status: "SUCCESS",
      },
      {
        where: { razorpay_order_id },
        transaction: t,
      }
    );

    await t.commit();

    return res.json({
      message: "Payment has been done",
      success: 1,
    });

  } catch (err) {
    if (!t.finished) {
      await t.rollback();
    }

    return res.json({
      message: "Something went wrong",
      success: 0,
    });
  }
};