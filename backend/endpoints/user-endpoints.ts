import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { User } from "../lib/user"

export const user_router = Router();

// for getting all posts from a user
user_router.get("/:userId/posts",async (req: Request, res: Response) => {
    const user = await User.fromId(new ObjectId(req.session.userObjectId));
    res.status(200).json(user?.getPosts());
});

// for getting best streak from a user
user_router.get("/:userId/bestStreak",async (req: Request, res: Response) => {
    const user = await User.fromId(new ObjectId(req.session.userObjectId));
    res.status(200).json(user.getBestStreak());
});

// for getting current streak from a user
user_router.get("/:userId/currStreak",async (req: Request, res: Response) => {
    const user = await User.fromId(new ObjectId(req.session.userObjectId));
    res.status(200).json(user.getCurrStreak());
});
