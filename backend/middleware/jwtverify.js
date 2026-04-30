import jwt from "jsonwebtoken";
import User from '../models/user.js'
export const verifyToken = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization;
    if (!token) {
      return res.json({ err: "Token is missing", success: 0, data: [] });
    }
    const decoded  = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded?.id) {
      return res.json({ err: "Token is invalid", success: 0 });
    }
    const FindUser = await User.findOne({
      where: {
        id: decoded?.id,
      },
    });
    req.user = FindUser?.dataValues;
    next();
  } catch (err) {
    console.log("VerifyToken", err);
    return res.json({ err: "Something went wrong", success: 0 });
  }
};