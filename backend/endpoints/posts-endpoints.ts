import { Router, Request, Response } from "express";
import multer from "multer";
import { ObjectId, GridFSBucket } from "mongodb";
import * as dotenv from 'dotenv';
dotenv.config();

import { getClient, uri } from '../lib/db-lib/db-client';
import { User } from '../lib/user';
import { Post, Tag } from "../lib/post"
import { TrendingPosts } from "../lib/trending_posts";
import { Clothing } from "../lib/clothing";
import { Wardrobe } from "../lib/wardrobe";
import { GridFsStorage } from "multer-gridfs-storage";

const storage = new GridFsStorage({
    db: getClient().mongoDB,
    file: (req, file) => {

        console.log("File: " + file.mimetype + ", " + file.originalname);
        //If it is an image, save to photos bucket
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            return {
                bucketName: "photos",
                filename: `${Date.now()}_${file.originalname}`,
            }
        } else {
            //Otherwise save to default bucket
            return `${Date.now()}_${file.originalname}`
        }
    },
});

export const upload = multer({ storage });


export const posts_router = Router();


/**
 * Uploads an image from a user for a specific post and and adds the image to the user's posts list.
 * The postId is the id of an existing post, this attaches an image to an existing post, 
 * The filename to use when downloading the image from the server will be in the filename property in the response
 *
 * @route POST /upload-image/:postId
 * @param {Request} req The request object, containing the postId parameter and image file.
 * @param {Response} res The response object.
 * @returns Returns the file information of the uploaded image.
 */
posts_router.post("/upload-image/:postId", upload.single('image'), async (req: Request, res: Response) => {
    // const user = await User.fromId(new ObjectId(req.session.userObjectId));
    // TODO: change this to create a new Posts object and add the post id to User
    if (req.file?.filename && req.session.userID && req.session.userObjectId) {
        // user.posts.push(req.file?.filename);
        console.log("req.params.postId: " + req.params.postId);
        const post = await Post.fromId(new ObjectId(req.params.postId));
        await post.updateImageFilename(req.file.filename);
        console.log("added image: " + req.file.filename + " to  post: " + post?.id);
        // await user.writeToDatabase();
    }
    // console.log(user.toJson());
    res.status(200).json(req.file);
});

/**
 * Creates a new post with specified details and tags, associating it with the user's wardrobe.
 *
 * @route POST /new
 * @param {Request} req The request object, must include body with caption, blur, tags.
 * @param {Response} res The response object.
 * @returns Returns the postId of the newly created post.
 */
posts_router.post("/new", async (req: Request, res: Response) => {
    // const user = await User.fromId(new ObjectId(req.session.userObjectId));
    const userObjId = new ObjectId(req.session.userObjectId);
    const wardrobe = await Wardrobe.fromId(userObjId);
    // TODO: change this to create a new Posts object and add the post id to User
    console.log(req.body);
    const caption = req.body.caption;
    const blur = req.body.blur;
    const frontendTags = req.body.tags;

    const post = await Post.create(new ObjectId(req.session.userObjectId), '', caption, frontendTags, blur);
    if (!post) {
        return res.status(500).json("Unable to create new user");
    }

    const tags: Tag[] = await Promise.all(frontendTags.map(
        async (tag: { id: ObjectId | number, name: string, x: number, y: number }) => {
            let objId;
            let clothingItem;
            // const notExistingClothing = !('id' in tag) || tag.id == null || tag.id == -1;
            let clothingItemAlreadyExists = 'id' in tag && tag.id != null && tag.id !=  -1;
            if (clothingItemAlreadyExists) {
                clothingItem = await Clothing.fromId(new ObjectId(tag.id));
            }
            if (!clothingItemAlreadyExists || clothingItem == null) {
                clothingItemAlreadyExists = false;
                clothingItem = await Clothing.create(userObjId, tag.name, 0, 0, 0, 0, false);
                objId = clothingItem?.id;
            }

            await clothingItem?.incrementReusedCount();
            await clothingItem?.addPost(post.id);
            clothingItem && !clothingItemAlreadyExists && await wardrobe.addClothes(clothingItem.id);
            return {
                id: objId,
                name: tag.name,
                x: tag.x,
                y: tag.y
            }
        }));

    await post.setTaggedClothes(tags);

    console.log(post.toJson());
    res.status(200).json({ postId: post?.id });
})

/**
 * Downloads an image by filename from the 'photos' bucket.
 *
 * @route GET /image/:filename
 * @param {Request} req The request object, containing the filename parameter.
 * @param {Response} res The response object.
 * @returns Streams the image file or sends an error if not found.
 */
posts_router.get('/image/:filename', (req, res) => {
    try {
        const dbClient = getClient();
        const imageBucket = new GridFSBucket(dbClient.mongoDB, {
            bucketName: "photos",
        });

        let downloadStream = imageBucket.openDownloadStreamByName(
            req.params.filename
        );

        downloadStream.on("data", function (data) {
            return res.status(200).write(data)
        });

        downloadStream.on("error", function (data) {
            return res.status(404).send({ error: "Image not found" })
        });

        downloadStream.on("end", () => {
            return res.end()
        });
    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: "Error Something went wrong downloading the image",
            error,
        })
    }

});

/**
 * Retrieves all posts, annotating each with whether the current user has saved it.
 *
 * @route GET /
 * @param {Request} req The request object, includes the user session.
 * @param {Response} res The response object.
 * @returns Returns an array of posts with a 'saved' flag for each.
 */
posts_router.get("/", async (req: Request, res: Response) => {
    const posts = await Post.all();
    const user = await User.fromId(new ObjectId(req.session.userObjectId));
    res.status(200).json(
        posts.map(post => post.toJson())
            .map(post => ({
                saved: user?.hasSavedPost(post.id),
                ...post
            }))
    );
});

/**
 * Retrieves the posts saved by the current user.
 *
 * @route GET /saved
 * @param {Request} req The request object, includes the user session.
 * @param {Response} res The response object.
 * @returns Returns an array of the user's saved posts.
 */
posts_router.get("/saved", async (req: Request, res: Response) => {
    const user = await User.fromId(new ObjectId(req.session.userObjectId));
    const postIds = user?.savedPosts;
    const savedPosts = postIds ? await Promise.all(postIds.map(async postId => {
        const post = await Post.fromId(postId);
        return post.toJson();
    })) : [];
    res.status(200).json(savedPosts);
});

/**
 * Retrieves and updates trending posts, then returns them.
 *
 * @route GET /trending
 * @param {Request} req The request object.
 * @param {Response} res The response object.
 * @returns Returns an array of trending posts after updating.
 */
posts_router.get("/trending", async (req: Request, res: Response) => {
    const trending = await TrendingPosts.getTrendingPosts();
    await trending.updateTrendingPosts();
    // get all posts from list of post ids
    const posts = await Promise.all(trending.posts.map(async (id) => {
        return await Post.fromId(id);
    }));
    res.status(200).json(posts);
});

/**
 * Updates trending posts without returning them.
 *
 * @route GET /trending/update
 * @param {Request} req The request object.
 * @param {Response} res The response object.
 * @returns Acknowledges the operation with a 200 status code.
 */
posts_router.get("/trending/update", async (req: Request, res: Response) => {
    const trending = await TrendingPosts.getTrendingPosts();
    await trending.updateTrendingPosts();
    res.status(200).json();
});

/**
 * Retrieves a single post by postId, annotating it with whether the current user has saved it.
 *
 * @route GET /:postId
 * @param {Request} req The request object, containing the postId parameter.
 * @param {Response} res The response object.
 * @returns Returns the post with a 'saved' flag.
 */
posts_router.get("/:postId", async (req: Request, res: Response) => {
    const post = await Post.fromId(new ObjectId(req.params["postId"]));
    const user = await User.fromId(new ObjectId(req.session.userObjectId));
    const json = post.toJson();
    res.status(200).json({ saved: user?.hasSavedPost(json.id), ...json });
});

/**
 * Updates the rating of a specific post.
 *
 * @route POST /:postId/rating
 * @param {Request} req The request object, containing the new rating in the body.
 * @param {Response} res The response object.
 * @returns Acknowledges the rating update with a 200 status code.
 */
posts_router.get("/:postId/rating", async (req: Request, res: Response) => {
    const post = await Post.fromId(new ObjectId(req.params["postId"]));
    res.status(200).json(post.rating);
});

/**
 * Retrieves the tagged clothes associated with a post.
 *
 * @route GET /:postId/tagged-clothes
 * @param {Request} req The request object, containing the postId parameter.
 * @param {Response} res The response object.
 * @returns Returns an array of tagged clothes for the post.
 */
posts_router.post("/:postId/rating", async (req: Request, res: Response) => {
    const post = await Post.fromId(new ObjectId(req.params["postId"]));

    const userId = new ObjectId(req.session.userObjectId);
    const user = await User.fromId(userId);
    let postId = new ObjectId(req.params["postId"]);
    if (user != null) {
        const ratedPosts = await user.getRatedPosts();
        console.log(ratedPosts);
        // check if user already rated post
        if(ratedPosts.some((ratedPost) => ratedPost.postId.equals(postId))) {
            await post.updateRatingAfterRated(
                await user.getRatingForPost(postId),
                +req.body.rating
            );
        } else {
            await post.updateRating(+req.body.rating);
            await post.updateRatingBuckets();
        }
        user.setRatingForPost(postId, +req.body.rating);
    } else {
        res.status(500).json("User not found");
        return;
    }
    user.writeToDatabase();

    res.status(200).json();
});


/**
 * Retrieves the tagged clothes associated with a post.
 *
 * @route GET /:postId/tagged-clothes
 * @param {Request} req The request object, containing the postId parameter.
 * @param {Response} res The response object.
 * @returns Returns an array of tagged clothes for the post.
 */
posts_router.get("/:postId/tagged-clothes", async (req: Request, res: Response) => {
    const post = await Post.fromId(new ObjectId(req.params["postId"]));
    res.status(200).json(post.taggedClothes);
});

/**
 * Adds tagged clothes to a post.
 *
 * @route POST /:postId/tagged-clothes
 * @param {Request} req The request object, containing the postId parameter and clothes array in the body.
 * @param {Response} res The response object.
 * @returns Acknowledges the addition of tagged clothes with a 200 status code.
 */
posts_router.post("/:postId/tagged-clothes", async (req: Request, res: Response) => {
    const post = await Post.fromId(new ObjectId(req.params["postId"]));
    await post.addTaggedClothes(req.body.clothes); //expects array
    res.status(200).json();
});

/**
 * Toggles the save status of a post for the current user.
 *
 * @route POST /:postId/toggleSave
 * @param {Request} req The request object, containing the postId parameter.
 * @param {Response} res The response object.
 * @returns Returns the new save status of the post.
 */
posts_router.post("/:postId/toggleSave", async (req: Request, res: Response) => {
    const user = await User.fromId(new ObjectId(req.session.userObjectId));
    res.status(200).json(await user?.toggleSavePost(new ObjectId(req.params.postId)));
});

/**
 * Adds a comment to a specific post.
 *
 * @route POST /:postId/addComment
 * @param {Request} req The request object, containing the postId parameter and comment in the body.
 * @param {Response} res The response object.
 * @returns Acknowledges the comment addition with an empty response body.
 */
posts_router.post("/:postId/addComment", async (req: Request, res: Response) => {
    const post = await Post.fromId(new ObjectId(req.params["postId"]));
    await post.addComment(req.body["comment"]);
    res.status(200).end();
});
