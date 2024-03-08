import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { Clothing } from "../lib/clothing"

export const clothes_router = Router();

// for getting all tags from a clothing
clothes_router.get("/:clothingId/tags",async (req: Request, res: Response) => {
    const clothing = await Clothing.fromId(new ObjectId(req.params["clothingId"]));
    res.status(200).json(clothing.tags);
});

// for setting tags to a clothing
clothes_router.post("/:clothingId/tags",async (req: Request, res: Response) => {
    const clothing = await Clothing.fromId(new ObjectId(req.params["clothingId"]));
    clothing.addTags(req.body.tags); //expects array
    res.status(200).json();
});

// for getting rating from a clothing
clothes_router.get("/:clothingId/rating",async (req: Request, res: Response) => {
    const clothing = await Clothing.fromId(new ObjectId(req.params["clothingId"]));
    res.status(200).json(clothing.rating);
});

// for updating rating with a new single rating for a clothing
clothes_router.post("/:clothingId/rating",async (req: Request, res: Response) => {
    const clothing = await Clothing.fromId(new ObjectId(req.params["clothingId"]));
    clothing.updateRating(+req.body.rating);
    res.status(200).json();
});

// for getting if clothing is onSale 
clothes_router.get("/:clothingId/onSale",async (req: Request, res: Response) => {
    const clothing = await Clothing.fromId(new ObjectId(req.params["clothingId"]));
    res.status(200).json(clothing.onSale);
});

// for toggling onSale on and off of a clothing
clothes_router.post("/:clothingId/onSale",async (req: Request, res: Response) => {
    const clothing = await Clothing.fromId(new ObjectId(req.params["clothingId"]));
    clothing.toggleOnSale();
    res.status(200).json();
});

// for getting cost for a clothing
clothes_router.get("/:clothingId/cost",async (req: Request, res: Response) => {
    const clothing = await Clothing.fromId(new ObjectId(req.params["clothingId"]));
    res.status(200).json(clothing.cost);
});

// for updating cost for a clothing
clothes_router.post("/:clothingId/cost",async (req: Request, res: Response) => {
    const clothing = await Clothing.fromId(new ObjectId(req.params["clothingId"]));
    clothing.updateCost(+req.body.cost);
    res.status(200).json();
});
