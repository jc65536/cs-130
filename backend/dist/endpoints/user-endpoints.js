"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_router = void 0;
const express_1 = require("express");
const mongodb_1 = require("mongodb");
const user_1 = require("../lib/user");
exports.user_router = (0, express_1.Router)();
// for getting all posts from a user
exports.user_router.get("/:userId/posts", async (req, res) => {
    const user = await user_1.User.fromId(new mongodb_1.ObjectId(req.session.userObjectId));
    res.status(200).json(user.posts);
});
