import { convertTo24CharHex } from "../endpoints/utils";
import { DbItem } from "./db-lib/db-item";
import { COLLECTION } from "./enums";
import { ObjectId } from "mongodb";
import { getClient } from "./db-lib/db-client";
import { User } from "./user";

export type PostDatabaseEntry = {
    _id: ObjectId,
    clothes: ObjectId[],
    imageFilename: String,
    caption: String,
    rating: number,
    ratingCount: number,
    userObjectId: ObjectId
};

export class Post extends DbItem {
    clothes: ObjectId[];
    imageFilename: String;
    caption: String;
    rating: number;
    ratingCount: number;
    userObjectId: ObjectId | null;

    /**
     * 
     * @param id ObjectId from mongo
     * @param imageFilename string
     * @param caption String
     * @param tags string array of ids for Clothing class dbItem
     * @returns 
     */
    constructor(id: ObjectId) {
        super(id, COLLECTION.POSTS)
        this.userObjectId = null;
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
        post.userObjectId = new ObjectId(document.userObjectId);
        return post;
    }

    /**
     * 
     * @param userUID the user's google ID
     * should be retrieved from Google API using the google OAuth token
     * also adds the post to the user's posts list
     * @returns the new Post object
     */
    public static async create(userObjectId: ObjectId, image:String, caption:String, clothes:ObjectId[]): Promise<Post | null> {
        // find the user
        //add the object under the users post string
        const newPost = new Post(new ObjectId());
        newPost.imageFilename = image;
        newPost.caption = caption;
        newPost.clothes = clothes;
        newPost.userObjectId = userObjectId;

        const user = await User.fromId(userObjectId);
        await user.addPost(newPost.id);
        await user.writeToDatabase();
        await newPost.writeToDatabase();
        return newPost;
    }

    /**
     * 
     * @param postUID the user ID
     * @returns 
     */
    public async getClothes(): Promise<ObjectId[] | null> {
        return this.clothes;
    }
    public async getImageFilename(): Promise<String | null> {
        return this.imageFilename;
    }
    public async getCaption(): Promise<String | null> {
        return this.caption;
    }
    public async getRating(): Promise<number | null> {
        return this.rating;
    }
    public async getRatingCount(): Promise<number | null> {
        return this.ratingCount;
    }

    public async addClothes(clothingUID: ObjectId[]): Promise<void> {
        this.clothes.concat(clothingUID);
    }
    public async updateImageFilename(newImageFilename: String): Promise<void> {
        this.imageFilename = newImageFilename;
    }
    public async updateCaption(newCaption: String): Promise<void> {
        this.caption = newCaption;
    }
    // TODO: double check this, this might be wrong
    public async updateRating(newRating: number): Promise<void> {
        this.rating = (this.rating * this.ratingCount + newRating) / (this.ratingCount+1);
        this.ratingCount++;
    }

    /**
       * Converts the object into a form for the database
       * @returns a database entry
       */
    public toJson() {
        const { collectionName: _c, ...entry } = this;
        return {
            ...entry,
            userObjectId: this.userObjectId,
            clothes: this.clothes,
            imageFilename: this.imageFilename,
            caption: this.caption,
            rating: this.rating,
            ratingCount: this.ratingCount
        };
    }
}