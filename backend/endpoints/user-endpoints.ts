import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { User } from "../lib/user";
import { validateGoogleOAuthToken } from "./utils";



export const user_router = Router();

user_router.use(validateGoogleOAuthToken);

user_router.post("/", (req: Request, res: Response) => {
    const user = new User(new ObjectId(res.locals.userObjectId));
    res.status(200).json(user.toJson());
});
// for getting all posts from a user
user_router.get("/users/:userId/posts", (req: Request, res: Response) => {
    const user = req.get('userId');
    
    res.status(200).json();
});