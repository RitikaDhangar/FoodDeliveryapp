import User from "../models/user.js";
import bcrypt from "bcrypt";
import { generateToken } from "./utils/jwt.js";
import crypto from "crypto";
import { Op } from "sequelize";
export const createUser = async (req, res) => {
  try {
    const { name, address, phone } = req?.body;
    const phoneNo = phone;
    const existUser = await User.findOne({
      where: {
        phoneNo: phone,
      },
    });
    if (existUser) {
      return res.json({ message: "User already exist", data: [], success: 0 });
    }
    const createdUser = await User.create({
      name,
      address,
      phoneNo: phone,
    });
    const token = generateToken(createdUser?.id);
    return res.status(201).json({
      message: "User created successfully",
      data: { token },
      success: 1,
    });
  } catch (err) {
    console.log('createUser err', err);
    if (err?.name === "SequelizeValidationError") {
      return res.json({
        message: err.errors[0].message,
        success: 0,
      });
    }
    return res.json({ message: "User not created", data: [], success: 0 });
  }
};



export const loginUser = async (req, res) => {
  try {
    const { phone } = req?.body;
    const existUser = await User.findOne({
      where: {
        phoneNo: phone,
      },
    });
    
    if (!existUser) {
      return res.json({
        message: "No Record Found, please Sign Up!",
        data: [],
        success: 0,
      });
    }
    const token = generateToken(existUser?.dataValues?.id);
    return res.json({
      message: "User successfully LoggedIn",
      data: { username: existUser?.name, token },
      success: 1,
    });
  } catch (err) {
    console.log("The error is", err);
    return res.json({ message: "User not Found", data: [], success: 0 });
  }
};

