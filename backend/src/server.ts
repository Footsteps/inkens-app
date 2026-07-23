import "dotenv/config";

import cors from "cors";
import express from "express";

import foodsRouter from "./routes/foods.js"





const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.use("/foods", foodsRouter);

app.listen(port, () => {
    console.log(`Backend läuft auf http://localhost:${port}`);
})