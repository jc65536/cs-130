import { Router, Request, Response } from "express";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import * as dotenv from 'dotenv';
dotenv.config();

import { uri } from '../lib/db-lib/db-client';


const storage = new GridFsStorage({
    url: uri,
    file: (req, file) => {
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

// for getting all posts from a user
posts_router.post("/upload", upload.single('image'), (req: Request, res: Response) => {
    console.log(req.file?.originalname);
    res.status(200).json();
});