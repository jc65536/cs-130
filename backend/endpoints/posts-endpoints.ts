import { Router, Request, Response } from "express";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import { ObjectId, GridFSBucket } from "mongodb";
import * as dotenv from 'dotenv';
dotenv.config();

import { getClient, uri } from '../lib/db-lib/db-client';
import { User } from '../lib/user';
import { Post } from "../lib/post"
import { Clothing } from "../lib/clothing";
import { Wardrobe } from "../lib/wardrobe";
import { ImageStorage } from "./img-store";


const upload = multer({ storage: new (ImageStorage as any)() });


export const posts_router = Router();

// for uploading an image from a user and adds the image to the user's posts list
// the postId is the id of an existing post, this attaches an image to an existing post
// the filename to use when downloading the image from the server will be in the filename property in the response
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

// creates a new post object and adds it to the user
// returns a postId that can be used to upload an image to that post object
posts_router.post("/new", async (req: Request, res: Response) => {
    // const user = await User.fromId(new ObjectId(req.session.userObjectId));
    const userObjId = new ObjectId(req.session.userObjectId);
    const wardrobe = await Wardrobe.fromId(userObjId);
    // TODO: change this to create a new Posts object and add the post id to User
    console.log(req.body);
    const caption = req.body.caption;
    const blur = req.body.blur;
    const frontendTags = req.body.tags;

    const tags = await Promise.all(frontendTags.map(
        async (tag: { id: ObjectId | number, name: string, x: number, y: number }) => {
            let objId;
            if (!('id' in tag) || tag.id == null || tag.id == -1) {
                const clothingItem = await Clothing.create(userObjId, tag.name, 0, 0, 0, 0, false);
                objId = clothingItem?.id;
            }
            await wardrobe.addClothes(new ObjectId(objId));
            return {
                id: objId,
                name: tag.name,
                x: tag.x,
                y: tag.y
            }
        }));
    const post = await Post.create(new ObjectId(req.session.userObjectId), '', caption, tags, blur);
    if (!post) {
        return res.status(500).json("Unable to create new user");
    }

    console.log(post.toJson());
    res.status(200).json({ postId: post?.id });
})

// download an existing image
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
 * Response type: post.toJSON() & { saved: boolean }
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

//get post object

/**
 * Response type: post.toJSON() & { saved: boolean }
 */

posts_router.get("/:postId", async (req: Request, res: Response) => {
    const post = await Post.fromId(new ObjectId(req.params["postId"]));
    const user = await User.fromId(new ObjectId(req.session.userObjectId));
    const json = post.toJson();
    res.status(200).json({ saved: user?.hasSavedPost(json.id), ...json });
});

//get post's rating
posts_router.get("/:postId/rating", async (req: Request, res: Response) => {
    const post = await Post.fromId(new ObjectId(req.params["postId"]));
    res.status(200).json(post.rating);
});

//update post's rating with single new rating
posts_router.post("/:postId/rating", async (req: Request, res: Response) => {
    const post = await Post.fromId(new ObjectId(req.params["postId"]));
    await post.updateRating(+req.body.rating);
    res.status(200).json();
});

//gets clothes from post
posts_router.get("/:postId/tagged-clothes", async (req: Request, res: Response) => {
    const post = await Post.fromId(new ObjectId(req.params["postId"]));
    res.status(200).json(post.taggedClothes);
});

//add clothes to post
posts_router.post("/:postId/tagged-clothes", async (req: Request, res: Response) => {
    const post = await Post.fromId(new ObjectId(req.params["postId"]));
    await post.addTaggedClothes(req.body.clothes); //expects array
    res.status(200).json();
});

posts_router.post("/:postId/toggleSave", async (req: Request, res: Response) => {
    const user = await User.fromId(new ObjectId(req.session.userObjectId));
    res.status(200).json(await user?.toggleSavePost(new ObjectId(req.params.postId)));
});
