import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { User } from "../lib/user";

export const login_router = Router();

login_router.post("/", (req: Request, res: Response) => {
    // to indicate that a user is authenticated we see if the session has the userID set
    req.session.userID = res.locals.userID;
    req.session.userObjectId = res.locals.userObjectId;
    const user = new User(new ObjectId(res.locals.userObjectId));
    console.log(req.session);
    res.status(200).json(user.toJson());
});