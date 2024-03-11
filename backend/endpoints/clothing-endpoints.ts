import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { Clothing } from "../lib/clothing"
import { getClient } from "../lib/db-lib/db-client";
import { COLLECTION } from "../lib/enums";

export const clothes_router = Router();

// search all clothing objects based on query string
// a clothing is considered a match if the query string is a substring of the clothing's name
// to get all clothes, use the empty string, aka request from "/clothing/tags/"
clothes_router.get("/tags/:queryString", async (req: Request, res: Response) => {
    const queryString = req.params.queryString;
    const dbClient = getClient();
    const matchStrings = [];
    const clothingDocs = await dbClient.getCollectionItems(COLLECTION.CLOTHES);
    for (const clothingDoc of clothingDocs) {
        if (clothingDoc.name.includes(queryString)) {
            matchStrings.push({
                tagName: clothingDoc.name,
                tagId: clothingDoc._id,
            });
        }
    }
    res.status(200).json(matchStrings);
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
