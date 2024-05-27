import express from "express";
import dotenv from "dotenv";

import userRoute from "./src/routes/user.route.js";
import authRoute from "./src/routes/auth.route.js";
import newsRoute from "./src/routes/news.route.js";
import reseteRoute from "./reseteRoute.js";


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());

app.use("/user", userRoute);
app.use("/auth", authRoute);
app.use("/news", newsRoute);
app.use("/resete", reseteRoute);

app.listen(port, () => console.log(`Server running on port http://localhost:${port}`));