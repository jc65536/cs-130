import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { Wardrobe } from "../lib/wardrobe"

export const user_router = Router();

// for getting all clothes from a wardrobe
user_router.get("/wardrobe/clothes",async (req: Request, res: Response) => {
    const wardrobe = await Wardrobe.fromId(new ObjectId(req.session.userObjectId));
    res.status(200).json(wardrobe.clothes);
});

// for getting all posts from a wardrobe
user_router.get("/wardrobe/posts",async (req: Request, res: Response) => {
    const wardrobe = await Wardrobe.fromId(new ObjectId(req.session.userObjectId));
    res.status(200).json(wardrobe.posts);
});
