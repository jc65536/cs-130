import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { User } from "../lib/user"
import { Post } from "../lib/post";
import { upload } from "./posts-endpoints";

export const user_router = Router();

user_router.get("/", async (req: Request, res: Response) => {
    const user = await User.fromId(new ObjectId(req.session.userObjectId));
    if (!user) {
        res.status(404).send("User: "+req.session.userObjectId+" does not exist in the database");
    }
    res.status(200).json(user?.toJson());
});

// for getting average rating of a user's posts
user_router.get("/average",async (req: Request, res: Response) => {
    const user = await User.fromId(new ObjectId(req.session.userObjectId));
    const postIds = await user?.getPosts();
    console.log(postIds);
    const ratings = postIds ? await Promise.all(postIds.map(async (postObjectId: ObjectId) => {
        const post = await Post.fromId(postObjectId);
        return post.rating;
    })) : [];
    if (ratings.length == 0) {
        res.status(200).json(-1);
    } else {
        const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        res.status(200).json(avgRating);
    }
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

// for getting all posts from any user
user_router.get("/posts/:userId",async (req: Request, res: Response) => {
    const user = await User.fromId(new ObjectId(req.params.userId));
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
    await user?.setName(req.params.newName);
    res.status(200).send("Successfully updated name to: "+req.params.newName);
});

// for getting user's rating of a post
user_router.get("/rating/:postId",async (req: Request, res: Response) => {
    const user = await User.fromId(new ObjectId(req.session.userObjectId));
    res.status(200).json(await user?.getRatingForPost(new ObjectId(req.params.postId)));
});

// for getting info about users different from the signed in user
user_router.get("/:userId", async (req: Request, res: Response) => {
    const user = await User.fromId(new ObjectId(req.params.userId));
    if (!user) {
        res.status(404).send("User: "+req.params.userId+" does not exist in the database");
    }
    res.status(200).json(user?.toJson());
});

user_router.post("/avatar", upload.single('image'), async (req: Request, res: Response) => {
    if (!req.file?.filename) {
        return res.status(500).send("Error uploading file");
    }
    const user = await User.fromId(new ObjectId(req.session.userObjectId));
    await user?.setAvatarImageFilename(req.file.filename);
    res.status(200).send("Successfully set avatar image to: "+req.file.filename);
});