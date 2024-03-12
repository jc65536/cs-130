import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { Wardrobe } from "../lib/wardrobe"

export const wardrobe_router = Router();

// for getting all clothes from a wardrobe
wardrobe_router.get("/clothes",async (req: Request, res: Response) => {
    const wardrobe = await Wardrobe.fromId(new ObjectId(req.session.userObjectId));
    res.status(200).json(await wardrobe.getClothes());
});

// for getting all posts from a wardrobe
wardrobe_router.get("/posts",async (req: Request, res: Response) => {
    const wardrobe = await Wardrobe.fromId(new ObjectId(req.session.userObjectId));
    res.status(200).json(await wardrobe.getPosts());
});

// for clearing a wardrobe
wardrobe_router.post("/clear", async (req: Request, res: Response) => {
    const wardrobe = await Wardrobe.fromId(new ObjectId(req.session.userObjectId));
    await wardrobe.clear();
    res.status(200).json();
});
