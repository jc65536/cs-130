import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { User } from "../lib/user"
import { Post } from "../lib/post";
import { upload } from "./posts-endpoints";

export const user_router = Router();

/**
 * Retrieves the currently logged-in user's details.
 *
 * @route GET /
 * @param {Request} req The request object, must include a session with userObjectId.
 * @param {Response} res The response object.
 * @returns Returns a JSON representation of the user if found, otherwise sends a 404 status with an error message.
 */
user_router.get("/", async (req: Request, res: Response) => {
    const user = await User.fromId(new ObjectId(req.session.userObjectId));
    if (!user) {
        res.status(404).send("User: "+req.session.userObjectId+" does not exist in the database");
    }
    res.status(200).json(user?.toJson());
});

/**
 * Calculates and returns the average rating of all posts made by the currently logged-in user.
 *
 * @route GET /average
 * @param {Request} req The request object, must include a session with userObjectId.
 * @param {Response} res The response object.
 * @returns Returns the average rating as JSON if posts exist, otherwise returns -1.
 */
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

/**
 * Retrieves all posts made by the currently logged-in user.
 *
 * @route GET /posts
 * @param {Request} req The request object, must include a session with userObjectId.
 * @param {Response} res The response object.
 * @returns Returns a JSON array of posts.
 */
user_router.get("/posts",async (req: Request, res: Response) => {
    const user = await User.fromId(new ObjectId(req.session.userObjectId));
    const postIds = await user?.getPosts();
    const posts = postIds ? await Promise.all(postIds.map(async (postObjectId: ObjectId) => {
        const post = await Post.fromId(postObjectId);
        return post.toJson();
    })) : [];
    res.status(200).json(posts);
});

/**
 * Retrieves all posts made by a specified user.
 *
 * @route GET /posts/:userId
 * @param {Request} req The request object, containing the userId parameter.
 * @param {Response} res The response object.
 * @returns Returns a JSON array of posts by the specified user.
 */
user_router.get("/posts/:userId",async (req: Request, res: Response) => {
    const user = await User.fromId(new ObjectId(req.params.userId));
    const postIds = await user?.getPosts();
    const posts = postIds ? await Promise.all(postIds.map(async (postObjectId: ObjectId) => {
        const post = await Post.fromId(postObjectId);
        return post.toJson();
    })) : [];
    res.status(200).json(posts);
});

/**
 * Retrieves the best posting streak of the currently logged-in user.
 *
 * @route GET /bestStreak
 * @param {Request} req The request object, must include a session with userObjectId.
 * @param {Response} res The response object.
 * @returns Returns the best streak as JSON.
 */
user_router.get("/bestStreak",async (req: Request, res: Response) => {
    const user = await User.fromId(new ObjectId(req.session.userObjectId));
    res.status(200).json(await user?.getBestStreak());
});

/**
 * Retrieves the current posting streak of the currently logged-in user.
 *
 * @route GET /currStreak
 * @param {Request} req The request object, must include a session with userObjectId.
 * @param {Response} res The response object.
 * @returns Returns the current streak as JSON.
 */
user_router.get("/currStreak",async (req: Request, res: Response) => {
    const user = await User.fromId(new ObjectId(req.session.userObjectId));
    res.status(200).json(await user?.getCurrStreak());
});

/**
 * Updates the name of the currently logged-in user.
 *
 * @route POST /name/:newName
 * @param {Request} req The request object, containing the newName parameter and a session with userObjectId.
 * @param {Response} res The response object.
 * @returns Sends a success message upon updating the name.
 */
user_router.post("/name/:newName", async (req: Request, res: Response) => {
    const user = await User.fromId(new ObjectId(req.session.userObjectId));
    await user?.setName(req.params.newName);
    res.status(200).send("Successfully updated name to: "+req.params.newName);
});

/**
 * Retrieves the rating given by the currently logged-in user for a specific post.
 *
 * @route GET /rating/:postId
 * @param {Request} req The request object, containing the postId parameter and a session with userObjectId.
 * @param {Response} res The response object.
 * @returns Returns the rating for the post as JSON.
 */
user_router.get("/rating/:postId",async (req: Request, res: Response) => {
    const user = await User.fromId(new ObjectId(req.session.userObjectId));
    res.status(200).json(await user?.getRatingForPost(new ObjectId(req.params.postId)));
});

/**
 * Retrieves details of a specific user by their userId.
 *
 * @route GET /:userId
 * @param {Request} req The request object, containing the userId parameter.
 * @param {Response} res The response object.
 * @returns Returns a JSON representation of the user if found, otherwise sends a 404 status with an error message.
 */
user_router.get("/:userId", async (req: Request, res: Response) => {
    const user = await User.fromId(new ObjectId(req.params.userId));
    if (!user) {
        res.status(404).send("User: "+req.params.userId+" does not exist in the database");
    }
    res.status(200).json(user?.toJson());
});

/**
 * Updates the avatar image of the currently logged-in user.
 *
 * @route POST /avatar
 * @param {Request} req The request object, must include a session with userObjectId and a file upload.
 * @param {Response} res The response object.
 * @returns Sends a success message upon setting the avatar image.
 */
user_router.post("/avatar", upload.single('image'), async (req: Request, res: Response) => {
    if (!req.file?.filename) {
        return res.status(500).send("Error uploading file");
    }
    const user = await User.fromId(new ObjectId(req.session.userObjectId));
    await user?.setAvatarImageFilename(req.file.filename);
    res.status(200).send("Successfully set avatar image to: "+req.file.filename);
});