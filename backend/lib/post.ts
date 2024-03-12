import { convertTo24CharHex } from "../endpoints/utils";
import { DbItem } from "./db-lib/db-item";
import { COLLECTION } from "./enums";
import { ObjectId } from "mongodb";
import { getClient } from "./db-lib/db-client";
import { User } from "./user";

export type Tag = {
    x: number,
    y: number,
    name: string,
    id: ObjectId
};

export type PostDatabaseEntry = {
    _id: ObjectId,
    taggedClothes: Tag[],
    imageFilename: String,
    caption: String,
    rating: number,
    ratingCount: number,
    userObjectId: ObjectId,
    blur: boolean,
    date: Date,
    comments: String[],
};

export class Post extends DbItem {
    imageFilename: String;
    caption: String;
    rating: number;
    ratingCount: number;
    date: Date;
    userObjectId: ObjectId | null;
    blur: boolean;
    taggedClothes: Tag[];
    comments: String[];

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
        this.rating = 0;
        this.ratingCount = 0;
        this.blur = false;
        this.taggedClothes = [];
        this.date = new Date();
        this.comments = [];
    }

    public static async fromId(postObjectId: ObjectId) {
        const dbClient = getClient();
        const document: PostDatabaseEntry = await dbClient.findDbItem(COLLECTION.POSTS, postObjectId);
        const post = new Post(postObjectId);
        post.taggedClothes = document.taggedClothes;
        post.imageFilename = document.imageFilename;
        post.caption = document.caption;
        post.rating = document.rating;
        post.ratingCount = document.ratingCount;
        post.date = document.date;
        post.userObjectId = new ObjectId(document.userObjectId);
        post.blur = document.blur;
        post.comments = document.comments;
        return post;
    }

    /**
     * 
     * @param userUID the user's google ID
     * should be retrieved from Google API using the google OAuth token
     * also adds the post to the user's posts list
     * @returns the new Post object
     */
    public static async create(userObjectId: ObjectId, image:String, caption:String, taggedClothes:Tag[], blur: boolean): Promise<Post | null> {
        // find the user
        //add the object under the users post string
        const newPost = new Post(new ObjectId());
        newPost.imageFilename = image;
        newPost.caption = caption;
        newPost.taggedClothes = taggedClothes;
        newPost.userObjectId = userObjectId;
        newPost.blur = blur;
        await newPost.writeToDatabase();

        const user = await User.fromId(userObjectId);
        await user?.addPost(newPost.id);
        await user?.writeToDatabase();
        return newPost;
    }

    /**
     * @returns an array of all the Post objects that exist in the database
     */
    public static async all(): Promise<Post[]> {
        const dbClient = getClient();
        const docs = await dbClient.getCollectionItems(COLLECTION.POSTS);

        const posts = [];
        for (const doc of docs) {
            const post = await Post.fromId(doc.id);
            posts.push(post);
        } 
        return posts;
    }

    /**
     * 
     * @param postUID the user ID
     * @returns 
     */
    public async getTaggedClothes(): Promise<Tag[] | null> {
        return this.taggedClothes;
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
    public async getDate(): Promise<Date> {
        return this.date;
    }

    public async addTaggedClothes(clothingTag: Tag[]): Promise<void> {
        this.taggedClothes.concat(clothingTag);
        await this.writeToDatabase();
    }
    public async updateImageFilename(newImageFilename: String): Promise<void> {
        this.imageFilename = newImageFilename;
        await this.writeToDatabase();
    }
    public async updateCaption(newCaption: String): Promise<void> {
        this.caption = newCaption;
        await this.writeToDatabase();
    }
    // TODO: double check this, this might be wrong
    public async updateRating(newRating: number): Promise<void> {
        this.rating = (this.rating * this.ratingCount + newRating) / (this.ratingCount+1);
        this.ratingCount++;
        await this.writeToDatabase();
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
            taggedClothes: this.taggedClothes,
            imageFilename: this.imageFilename,
            caption: this.caption,
            rating: this.rating,
            ratingCount: this.ratingCount,
            date: this.date
        };
    }

    public async addComment(c: String) {
        this.comments.push(c);
        await this.writeToDatabase();
    }
}
