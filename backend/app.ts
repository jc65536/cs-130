import express from "express";
import { User } from "./lib/user";

const app = express();
const port = 8000;

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// test endpoint
app.get("/test-create-user", async (req, res) => {
    const u = new User(123);
    u.posts.push("post1");
    u.posts.push("post2");
    await u.writeToDatabase();
    res.send("wrote user to database!");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
