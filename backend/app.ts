import express from "express";
import { user_router } from "./endpoints/user-endpoints";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors({ origin: process.env["FRONTEND_HOST"] }))

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/user", user_router);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
