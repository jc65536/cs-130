import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { User } from "../lib/user";

export const login_router = Router();

login_router.post("/", (req: Request, res: Response) => {
    const user = new User(new ObjectId(req.session.userObjectId));
    res.status(200).json(user.toJson());
});