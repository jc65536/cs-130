import { Router, Request, Response } from "express";

export const user_router = Router();

// for getting all posts from a user
user_router.get("/users/:userId/posts", (req: Request, res: Response) => {
    const user = req.get('userId');

    res.status(200).json();
});