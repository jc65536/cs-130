import { convertTo24CharHex } from "../endpoints/utils";
import { DbItem } from "./db-lib/db-item";
import { COLLECTION } from "./enums";
import { ObjectId } from "mongodb";
import { getClient } from "./db-lib/db-client";

type PostDatabaseEntry = {
    _id: ObjectId,
    clothes: String[],
    imageFilename: String,
    caption: String,
    rating: Number,
    ratingCount: Number,
    userUID: String
};

export class Post extends DbItem {
    clothes: String[];
    imageFilename: String;
    caption: String;
    rating: Number;
    ratingCount: Number;
    userUID: String;

    /**
     * 
     * @param id ObjectId from mongo
     * @param image idk figure out later placeholder
     * @param caption String
     * @param tags string array of ids for Clothing class dbItem
     * @returns 
     */
    constructor(id: ObjectId) {
        super(id, COLLECTION.POSTS)
        this.userUID = '';
        this.imageFilename = '';
        this.caption = '';
        this.clothes = [];
        this.rating = 0;
        this.ratingCount = 0;
    }

    public static async fromId(postObjectId: ObjectId) {
        const dbClient = getClient();
        const document: PostDatabaseEntry = await dbClient.findDbItem(COLLECTION.POSTS, postObjectId);
        const post = new Post(postObjectId);
        post.clothes = document.clothes;
        post.imageFilename = document.imageFilename;
        post.caption = document.caption;
        post.rating = document.rating;
        post.ratingCount = document.ratingCount;
        post.userUID = document.userUID;
        return post;
    }

    /**
     * 
     * @param userUID the user's google ID
     * should be retrieved from Google API using the google OAuth token
     * @returns 
     */
    public static async create(userUID: string, image:String, caption:String, clothes:String[]): Promise<Post | null> {
        const objectId = new ObjectId(convertTo24CharHex(userUID));
        // find the user
        //add the object under the users post string
        const dbClient = getClient();
        const user = await dbClient.findDbItem(COLLECTION.USERS, objectId);
        const newPost = new Post(new ObjectId());
        newPost.imageFilename = image;
        newPost.caption = caption;
        newPost.clothes = clothes;
        newPost.userUID = userUID;
        await user.addPost(newPost.id.toString());
        return newPost;
    }

    /**
     * 
     * @param postUID the user ID
     * @returns 
     */
    public async getClothes(): Promise<String[] | null> {
        return this.clothes;
    }
    public async getImageFilename(): Promise<String | null> {
        return this.imageFilename;
    }
    public async getCaption(): Promise<String | null> {
        return this.caption;
    }
    public async getRating(): Promise<Number | null> {
        return this.rating;
    }
    public async getRatingCount(): Promise<Number | null> {
        return this.ratingCount;
    }

    public async addClothes(clothingUID: String[]): Promise<void> {
        this.clothes.concat(clothingUID);
    }
    public async updateImageFilename(newImageFilename: String): Promise<void> {
        this.imageFilename = newImageFilename;
    }
    public async updateCaption(newCaption: String): Promise<void> {
        this.caption = newCaption;
    }
    public async updateRating(newRating: Number): Promise<void> {
        this.ratingCount = +this.ratingCount + 1;
        this.rating = (+this.rating + +newRating) / (+this.ratingCount);
    }

    /**
       * Converts the object into a form for the database
       * @returns a database entry
       */
    public toJson() {
        const { collectionName: _c, ...entry } = this;
        return {
            ...entry,
            userUID: this.userUID,
            clothes: this.clothes,
            imageFilename: this.imageFilename,
            caption: this.caption,
            rating: this.rating,
            ratingCount: this.ratingCount
        };
    }
}