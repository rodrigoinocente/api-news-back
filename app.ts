import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import router from "./src/routes/index"

dotenv.config();

const app = express();

app.use(
    express.json(),
    cors({
        origin: process.env.CORS_ORIGIN || "https://nginx-75mn.onrender.com",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.use(router)

export default app;