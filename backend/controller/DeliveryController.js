
import { getIO } from "../config/socket.js";


export const DeliveryOrder = (req, res) => {
  const io = getIO();

  const order = {
    id: Date.now(),
    status: "Order Received",
  };

  io.emit("orderStatus", order);

  setTimeout(() => {
    order.status = "Preparing";
    io.emit("orderStatus", order);
  }, 3000);

  setTimeout(() => {
    order.status = "Out for Delivery";
    io.emit("orderStatus", order);
  }, 6000);

  setTimeout(() => {
    order.status = "Delivered";
    io.emit("orderStatus", order);
  }, 9000);

  res.json({ success: true, order });
};