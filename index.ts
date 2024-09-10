import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

import userRoute from "./src/routes/user.route";
import authRoute from "./src/routes/auth.route";
import newsRoute from "./src/routes/news.route";
import swaggerRoute from "./src/routes/swagger.route";
import reseteRoute from "./reseteRoute";


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


app.use(
    express.json(),
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    })
);

app.use("/user", userRoute);
app.use("/auth", authRoute);
app.use("/news", newsRoute);
app.use("/doc", swaggerRoute);
app.use("/resete", reseteRoute);

app.listen(port, () => console.log(`Server running on port http://localhost:${port}`));