import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { User } from "../lib/user";
import { validateGoogleOAuthToken } from "./utils";



export const user_router = Router();

user_router.use(validateGoogleOAuthToken);

user_router.get("/", (req: Request, res: Response) => {
    const user = new User(new ObjectId(res.locals.userObjectId));
    res.status(200).json(user.toJson());
});