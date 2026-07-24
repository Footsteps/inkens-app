import { db } from "../config/database.js";
import { Router } from "express";

const foodSearchRouter = Router();
foodSearchRouter.get("/search", async (req, res) => {
    const {q} = req.query;

    if (typeof q !== "string" || q.trim() === "") {
        return res.status(400).json({
            message: "Der Suchparameter fehlt oder ist ungültig."
        })
    }

    const result = await db.query(
        `
        SELECT id, name
        FROM foods
        WHERE name ILIKE $1
        ORDER BY name ASC
        LIMIT 10
        `,
        [`%${q}%`]
    )

    return res.json({
        searchterm: q
    })
})

export default foodSearchRouter;