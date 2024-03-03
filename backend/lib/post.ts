import { convertTo24CharHex } from "../endpoints/utils";
import { DbItem } from "./db-lib/db-item";
import { COLLECTION } from "./enums";
import { ObjectId } from "mongodb";
import { getClient } from "./db-lib/db-client";

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
    constructor(id: ObjectId, userUID:String, imageFilename:String, caption:String, clothes:String[]) {
        super(id, COLLECTION.POSTS)
        this.userUID = userUID;
        this.imageFilename = imageFilename;
        this.caption = caption;
        this.clothes = clothes;
        this.rating = 0;
        this.ratingCount = 0;
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
        const dbClient = await getClient();
        const user = await dbClient.findDbItem(COLLECTION.USERS, objectId);
        const newPost = new Post(new ObjectId(), userUID, image, caption, clothes);
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

    public async addClothes(clothingUID: string): Promise<void> {
        this.clothes.push(clothingUID);
    }
    public async updateImageFilename(newImageFilename: string): Promise<void> {
        this.imageFilename = newImageFilename;
    }
    public async updateCaption(newCaption: string): Promise<void> {
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