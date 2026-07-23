import { Router } from "express";
import { db } from "../config/database.js";

const foodsRouter = Router();

foodsRouter.get(
  "/:foodName/intolerances/:intoleranceName",
  async (req, res) => {
    const { foodName, intoleranceName } = req.params;

    try {
      const result = await db.query(
        `
        SELECT 
          f.name AS food_name,
          i.name AS intolerance_name, 
          fi.default_rating AS tolerance_rating,
          fir.rating AS food_intolerance_rating,
          fir.title AS food_intolerance_rule
        FROM foods f
        JOIN food_intolerances fi
          ON fi.food_id = f.id
        JOIN intolerances i
          ON i.id = fi.intolerance_id
        JOIN food_intolerance_rules fir
          ON fir.food_intolerance_id = fi.id
        WHERE LOWER(f.name) = LOWER($1)
          AND LOWER(i.name) = LOWER($2)
        ORDER BY fir.rating ASC;
      `,
        [foodName, intoleranceName],
      );

      const rules = result.rows.map((row) => ({
        rating: row.food_intolerance_rating,
        rule: row.food_intolerance_rule,
      }));

      const firstRow = result?.rows[0];

      const response = {
        food: firstRow.food_name,
        intolerance: firstRow.intolerance_name,
        rating: firstRow.tolerance_rating,
        rules: rules,
      };

      console.log(response);
      res.json(response);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Fehler bei Datenbankabfrage",
      });
    }
  },
);
export default foodsRouter;
