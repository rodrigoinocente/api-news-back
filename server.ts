import app from "./app"
import * as dotenv from "dotenv";

dotenv.config();

// const app = express();


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port http://localhost:${port}`));