import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3, 225],
          msg: "Name must be between 3 to 225 characters long",
        },
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [10, 10],
          msg: "Phone number must be exactly 10 digits",
        },
        isNumeric: {
          msg: "Phone number must contain only digits",
        },
      },
    },
  },
  {
    timestamps: false,
  }
);

export default User;