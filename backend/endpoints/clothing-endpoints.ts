import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { Clothing } from "../lib/clothing"
import { Wardrobe } from "../lib/wardrobe";

export const clothes_router = Router();

/**
 * @GET
 * search through a user's wardrobe for clothing objects based on query string
 * a clothing is considered a match if the query string is a substring of the clothing's name
 * to get all clothes, use the empty string, aka request from "/clothing/tags/"
 * @route GET /tags/:queryString
 * @returns {{tagName: string, tagId: string}[]} 200 - An array of clothing tags
 */
clothes_router.get("/tags/:queryString", async (req: Request, res: Response) => {
    const queryString = req.params.queryString;
    const matchStrings = [];

    const wardrobe = await Wardrobe.fromId(new ObjectId(req.session.userObjectId));
    const clothes = await wardrobe.getClothes();

    for (const clothingId of clothes) {
        const clothing = await Clothing.fromId(clothingId);
        if (clothing?.name.includes(queryString)) {
            matchStrings.push({
                tagName: clothing?.name,
                tagId: clothingId
            });
        }
    }
    res.status(200).json(matchStrings);
});

// for getting rating from a clothing
clothes_router.get("/:clothingId/rating",async (req: Request, res: Response) => {
    const clothing = await Clothing.fromId(new ObjectId(req.params["clothingId"]));
    res.status(200).json(clothing?.rating);
});

// for updating rating with a new single rating for a clothing
clothes_router.post("/:clothingId/rating",async (req: Request, res: Response) => {
    const clothing = await Clothing.fromId(new ObjectId(req.params["clothingId"]));
    await clothing?.updateRating(+req.body.rating);
    res.status(200).json();
});

// for getting if clothing is onSale 
clothes_router.get("/:clothingId/onSale",async (req: Request, res: Response) => {
    const clothing = await Clothing.fromId(new ObjectId(req.params["clothingId"]));
    res.status(200).json(clothing?.onSale);
});

// for toggling onSale on and off of a clothing
clothes_router.post("/:clothingId/onSale",async (req: Request, res: Response) => {
    const clothing = await Clothing.fromId(new ObjectId(req.params["clothingId"]));
    await clothing?.toggleOnSale();
    res.status(200).json();
});

// for getting cost for a clothing
clothes_router.get("/:clothingId/cost",async (req: Request, res: Response) => {
    const clothing = await Clothing.fromId(new ObjectId(req.params["clothingId"]));
    res.status(200).json(clothing?.cost);
});

// for updating cost for a clothing
clothes_router.post("/:clothingId/cost",async (req: Request, res: Response) => {
    const clothing = await Clothing.fromId(new ObjectId(req.params["clothingId"]));
    await clothing?.updateCost(+req.body.cost);
    res.status(200).json();
});
