import { Router, Request, Response } from "express";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import { ObjectId, GridFSBucket } from "mongodb";
import * as dotenv from 'dotenv';
dotenv.config();

import { getClient, uri } from '../lib/db-lib/db-client';
import { User } from '../lib/user';


const storage = new GridFsStorage({
    url: uri + 'admin',
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
})

const upload = multer({ storage })


export const posts_router = Router();

// for uploading an image from a user and adds the image to the user's posts list
// the filename to use when downloading the image from the server will be in the filename property in the response
posts_router.post("/upload", upload.single('image'), async (req: Request, res: Response) => {
    const user = await User.fromId(new ObjectId(req.session.userObjectId));
    if (req.file?.filename) {
        user.posts.push(req.file?.filename);
        console.log("added new post: " + req.file.filename);
        await user.writeToDatabase();
    }
    console.log(user.toJson());
    res.status(200).json(req.file);
});

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