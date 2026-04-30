import Dish from "../models/Dish.js";

export const addDishedDb = async (req, res) => {
    try {
        const dishes = await Dish.bulkCreate(req.body);
        res.status(201).json({
            message: "dishes created successfully",
            success: 1,
        });
    } catch (err) {
        res.status(500).json({ err: err?.message });
    }
}

export const alldishes = async (req, res) => {
    try {
        const { page, limit } = req.body;
        const offset = (page - 1) * limit;
        const { count, rows } = await Dish.findAndCountAll({
            limit,
            offset
        })
        res.status(200).json({
            success: 1,
            totalrecords: count,
            data: rows
        })

    } catch (err) {
        res.status(500).json({ err: err?.message });
    }
}