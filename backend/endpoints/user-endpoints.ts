import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { User } from "../lib/user"
import { Post } from "../lib/post";

export const user_router = Router();

user_router.get("/", async (req: Request, res: Response) => {
    const user = await User.fromId(new ObjectId(req.session.userObjectId));
    if (!user) {
        res.status(404).send("User: "+req.session.userObjectId+" does not exist in the database");
    }
    res.status(200).json(user?.toJson());
});

// for getting all posts from a user
user_router.get("/posts",async (req: Request, res: Response) => {
    const user = await User.fromId(new ObjectId(req.session.userObjectId));
    const postIds = await user?.getPosts();
    const posts = postIds ? await Promise.all(postIds.map(async (postObjectId: ObjectId) => {
        const post = await Post.fromId(postObjectId);
        return post.toJson();
    })) : [];
    res.status(200).json(posts);
});

// for getting best streak from a user
user_router.get("/bestStreak",async (req: Request, res: Response) => {
    const user = await User.fromId(new ObjectId(req.session.userObjectId));
    res.status(200).json(await user?.getBestStreak());
});

// for getting current streak from a user
user_router.get("/currStreak",async (req: Request, res: Response) => {
    const user = await User.fromId(new ObjectId(req.session.userObjectId));
    res.status(200).json(await user?.getCurrStreak());
});

user_router.post("/name/:newName", async (req: Request, res: Response) => {
    const user = await User.fromId(new ObjectId(req.session.userObjectId));
    user?.setName(req.params.newName);
    await user?.writeToDatabase();
    res.status(200).send("Successfully updated name to: "+req.params.newName);
});
