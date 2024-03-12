import fs from "node:fs";
import { GridFsStorage } from "multer-gridfs-storage";
import { getClient } from "../lib/db-lib/db-client";
import Jimp from "jimp";
import { Request } from "express";

const gridStorage = new GridFsStorage({
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

export function ImageStorage() {
}

ImageStorage.prototype._handleFile = function _handleFile(req: Request, file: Express.Multer.File, cb: any) {
    const tempPrefix = `temp_${Date.now()}`;
    const tempPath = tempPrefix + file.originalname;

    const outStream = fs.createWriteStream(tempPath);

    file.stream.pipe(outStream);

    outStream.on("error", cb);

    outStream.on("finish", () => {
        Jimp.read(tempPath, (err, img) => {
            if (err) throw err;

            fs.unlink(tempPath, () => {});

            const tempPathMod = `${tempPrefix}_mod.${img.getExtension()}`;

            img.resize(480, Jimp.AUTO)
                .quality(90)
                .write(tempPathMod, () => {
                    const size = fs.statSync(tempPathMod).size;

                    console.log(`Resized from ${tempPath} ${outStream.bytesWritten} to ${tempPathMod} ${size}`);

                    const stream = fs.createReadStream(tempPathMod);

                    stream.on("end", () => {
                        fs.unlink(tempPathMod, () => {});
                    });

                    const newFile: Express.Multer.File = {
                        ...file,
                        size,
                        stream,
                    };

                    gridStorage._handleFile(req, newFile, cb);
                });
        });
    });
}

ImageStorage.prototype._removeFile = function _removeFile(req: any, file: any, cb: any) {
    gridStorage._removeFile(req, file, cb);
}
