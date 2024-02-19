import express from "express";
import { user_router } from "./endpoints/user-endpoints";

const app = express();
const port = 8000;

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/user", user_router);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
