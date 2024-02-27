"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_endpoints_1 = require("./endpoints/user-endpoints");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 8000;
app.use((0, cors_1.default)({ origin: process.env["FRONTEND_HOST"] }));
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use("/user", user_endpoints_1.user_router);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
