"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_router = void 0;
const express_1 = require("express");
exports.user_router = (0, express_1.Router)();
// for getting all posts from a user
exports.user_router.get("/users/:userId/posts", (req, res) => {
    const user = req.get('userId');
    res.status(200).json();
});
