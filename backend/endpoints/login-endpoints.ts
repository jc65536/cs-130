import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { User } from "../lib/user";

export const login_router = Router();

/**
 * Handles user login by verifying if the user exists in the database.
 * The user's ID is expected to be stored in the session object. If the user exists,
 * their information is returned as JSON. If the user does not exist, an error message
 * is sent back.
 * 
 * @route POST /
 * @param {Request} req The request object, expecting a session object with userObjectId.
 * @param {Response} res The response object used to return the user's information or an error message.
 * @returns For a successful login, returns the user's information as JSON with a 200 status code.
 *          If the user does not exist, returns an error message with a 400 status code.
 */
login_router.post("/", async (req: Request, res: Response) => {
    // const user = new User(new ObjectId(req.session.userObjectId));
    const user = await User.fromId(new ObjectId(req.session.userObjectId));
    if (!user) {
        return res.status(400).send("User doesn't exist in database");
    }
    res.status(200).json(user.toJson());
});