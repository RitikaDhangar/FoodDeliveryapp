import express from "express";
const app = express();
import cors from "cors";
import sequelize from "./config/database.js";
import User from "./models/User.js";
import UserRouter from "./routes/UserRouter.js";
import DishRouter from './routes/DishRouter.js'
import OrderRouter from './routes/OrderRouter.js'
import ExpenseRouter from './routes/ExpenseRouter.js'
import DeliveryRouter from "./routes/DeliveryRouter.js";
import Expense from "./models/Expense.js";
import {initSocket} from './config/socket.js'
import http from 'http';

app.use(express.json());
app.use(cors());
app.use(UserRouter);
app.use(DishRouter);
app.use(OrderRouter);
app.use(ExpenseRouter);
app.use(DeliveryRouter);

const server = http.createServer(app);
initSocket(server);

//One to many relationship between User & Expenses
User.hasMany(Expense, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
Expense.belongsTo(User);

const startServer = async () => {
  try {
    const PORT = process.env.PORT || 9000;
    await sequelize.sync();
    server.listen(PORT, () => {
      console.log("listen to the server");
    });
  } catch (err) {
    console.log("Unable to correct the db", err);
  }
};

startServer();
