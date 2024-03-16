import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { Clothing } from "../lib/clothing"
import { Wardrobe } from "../lib/wardrobe";

export const clothes_router = Router();

/**
 * @Route("query tags")
 * search through a user's wardrobe for clothing objects based on query string
 * a clothing is considered a match if the query string is a substring of the clothing's name
 * to get all clothes, use the empty string, aka request from "/clothing/tags/"
 *
 * @api {get} /clothing/tags/:queryString
 * @apiName GETMatching clothing tags
 * @apiGroup Clothing
 *
 * @apiParam {queryString} queryString to search clothing tags
 *
 * @apiSuccess {Tag[]} name and id of matching tags
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

/**
 * Retrieves the rating of a specific clothing item.
 * 
 * @route GET /:clothingId/rating
 * @param {Request} req The request object, containing the clothingId parameter.
 * @param {Response} res The response object used to return the clothing item's rating.
 * @returns Returns the rating of the clothing item as JSON.
 */
clothes_router.get("/:clothingId/rating",async (req: Request, res: Response) => {
    const clothing = await Clothing.fromId(new ObjectId(req.params["clothingId"]));
    res.status(200).json(clothing?.rating);
});

/**
 * Updates the rating of a specific clothing item with a new rating.
 * 
 * @route POST /:clothingId/rating
 * @param {Request} req The request object, containing the clothingId parameter and the new rating in the body.
 * @param {Response} res The response object used to acknowledge the operation.
 * @returns Acknowledges the operation with a 200 status code.
 */
clothes_router.post("/:clothingId/rating",async (req: Request, res: Response) => {
    const clothing = await Clothing.fromId(new ObjectId(req.params["clothingId"]));
    await clothing?.updateRating(+req.body.rating);
    res.status(200).json();
});

/**
 * Gets the onSale status of a specific clothing item.
 * 
 * @route GET /:clothingId/onSale
 * @param {Request} req The request object, containing the clothingId parameter.
 * @param {Response} res The response object used to return the onSale status.
 * @returns Returns the onSale status of the clothing item as JSON.
 */
clothes_router.get("/:clothingId/onSale",async (req: Request, res: Response) => {
    const clothing = await Clothing.fromId(new ObjectId(req.params["clothingId"]));
    res.status(200).json(clothing?.onSale);
});

/**
 * Toggles the onSale status of a specific clothing item.
 * 
 * @route POST /:clothingId/onSale
 * @param {Request} req The request object, containing the clothingId parameter.
 * @param {Response} res The response object used to acknowledge the operation.
 * @returns Acknowledges the operation with a 200 status code, effectively toggling the onSale status.
 */
clothes_router.post("/:clothingId/onSale",async (req: Request, res: Response) => {
    const clothing = await Clothing.fromId(new ObjectId(req.params["clothingId"]));
    await clothing?.toggleOnSale();
    res.status(200).json();
});

/**
 * Retrieves the cost of a specific clothing item.
 * 
 * @route GET /:clothingId/cost
 * @param {Request} req The request object, containing the clothingId parameter.
 * @param {Response} res The response object used to return the clothing item's cost.
 * @returns Returns the cost of the clothing item as JSON.
 */
clothes_router.get("/:clothingId/cost",async (req: Request, res: Response) => {
    const clothing = await Clothing.fromId(new ObjectId(req.params["clothingId"]));
    res.status(200).json(clothing?.cost);
});

/**
 * Updates the cost of a specific clothing item.
 * 
 * @route POST /:clothingId/cost
 * @param {Request} req The request object, containing the clothingId parameter.
 * @param {Response} res The response object used to acknowledge the operation.
 * @returns Acknowledges the operation with a 200 status code.
 */
clothes_router.post("/:clothingId/cost",async (req: Request, res: Response) => {
    const clothing = await Clothing.fromId(new ObjectId(req.params["clothingId"]));
    await clothing?.updateCost(+req.body.cost);
    res.status(200).json();
});
