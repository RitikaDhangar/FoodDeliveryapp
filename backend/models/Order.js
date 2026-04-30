import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Order = sequelize.define("order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  razorpay_order_id: DataTypes.STRING,
  razorpay_payment_id: DataTypes.STRING,
  status: DataTypes.STRING,
});
export default Order;