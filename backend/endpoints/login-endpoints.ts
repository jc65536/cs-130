import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { User } from "../lib/user";

export const login_router = Router();

login_router.post("/", async (req: Request, res: Response) => {
    // const user = new User(new ObjectId(req.session.userObjectId));
    const user = await User.fromId(new ObjectId(req.session.userObjectId));
    if (!user) {
        return res.status(400);
    }
    res.status(200).json(user.toJson());
});