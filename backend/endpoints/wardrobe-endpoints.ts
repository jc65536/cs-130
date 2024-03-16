import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { Wardrobe } from "../lib/wardrobe"
import { Clothing } from "../lib/clothing";

export const wardrobe_router = Router();

/**
 * Retrieves all clothing items from the currently logged-in user's wardrobe.
 *
 * @route GET /clothes
 * @param {Request} req The request object, must include a session with userObjectId.
 * @param {Response} res The response object.
 * @returns Returns a JSON array of clothing items in the wardrobe.
 */
wardrobe_router.get("/clothes",async (req: Request, res: Response) => {
    const wardrobe = await Wardrobe.fromId(new ObjectId(req.session.userObjectId));
    const clothingIds = await wardrobe.getClothes();
    const clothingObjects = await Promise.all(clothingIds.map(async (clothingId) => {
        const clothing = await Clothing.fromId(clothingId);
        if (clothing) {
            return clothing.toJson();
        }
    }));
    const filtered = clothingObjects.filter(clothing => clothing != null );
    res.status(200).json(filtered);
});

/**
 * Retrieves all posts associated with the currently logged-in user's wardrobe.
 *
 * @route GET /posts
 * @param {Request} req The request object, must include a session with userObjectId.
 * @param {Response} res The response object.
 * @returns Returns a JSON array of post IDs associated with the wardrobe.
 */
wardrobe_router.get("/posts",async (req: Request, res: Response) => {
    const wardrobe = await Wardrobe.fromId(new ObjectId(req.session.userObjectId));
    res.status(200).json(await wardrobe.getPosts());
});

/**
 * Clears all items from the currently logged-in user's wardrobe.
 *
 * @route POST /clear
 * @param {Request} req The request object, must include a session with userObjectId.
 * @param {Response} res The response object.
 * @returns Responds with a 200 status code after successfully clearing the wardrobe.
 */
wardrobe_router.post("/clear", async (req: Request, res: Response) => {
    const wardrobe = await Wardrobe.fromId(new ObjectId(req.session.userObjectId));
    await wardrobe.clear();
    res.status(200).json();
});
