import express from "express";

const app = express();
const port = 8000;

app.get("/", (req, res) => {
    const a: string = 4;
    a.k = 5;
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
