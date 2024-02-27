"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_router = void 0;
const express_1 = require("express");
const mongodb_1 = require("mongodb");
const user_1 = require("../lib/user");
const utils_1 = require("./utils");
exports.user_router = (0, express_1.Router)();
exports.user_router.use(utils_1.validateGoogleOAuthToken);
exports.user_router.post("/", (req, res) => {
    const user = new user_1.User(new mongodb_1.ObjectId(res.locals.userObjectId));
    res.status(200).json(user.toJson());
});
// for getting all posts from a user
exports.user_router.get("/users/:userId/posts", (req, res) => {
    const user = req.get('userId');
    res.status(200).json();
});
