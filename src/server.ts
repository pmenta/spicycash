import express from "express";
import dotenv from "dotenv";

import { Router, Request, Response } from "express";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3333);

const route = Router();

app.use(express.json());

route.get("/", (req: Request, res: Response) => {
  res.json({ message: "hello world" });
});

app.use(route);

app.listen(port, () => console.log(`💰🚀 server running on port ${port}`));
