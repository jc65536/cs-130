import { convertTo24CharHex } from "../endpoints/utils";
import { getClient } from "./db-lib/db-client";
import { DbItem } from "./db-lib/db-item";
import { COLLECTION } from "./enums";
import { ObjectId, WithId } from "mongodb";
import { Wardrobe } from "./wardrobe";

type UserDatabaseEntry = {
    _id: ObjectId,
    posts: ObjectId[], // the ids of the Post objects
    wardrobe: ObjectId,
    name: string,
    followers: number,
    streaks: number,
};

export class User extends DbItem {
    posts: ObjectId[];
    wardrobe: ObjectId | null;
    name: string;
    followers: number;
    streaks: number;
    // private dbClient = getClient();

    constructor(id: ObjectId) {
        super(id, COLLECTION.USERS)
        this.posts = [];
        this.wardrobe = null;
        this.name = '';
        this.followers = 0;
        this.streaks = 0;
    }

    public static async fromId(userObjectId: ObjectId) {
        const dbClient = getClient();
        const document: UserDatabaseEntry = await dbClient.findDbItem(COLLECTION.USERS, userObjectId);
        if (!document) {
            console.log("User doesn't exist: "+userObjectId);
            return null;
        }
        const user = new User(userObjectId);
        user.posts = document.posts ?? user.posts;
        user.wardrobe = document.wardrobe ?? user.wardrobe;
        user.name = document.name ?? user.name;
        user.followers = document.followers ?? user.followers;
        user.streaks = document.streaks ?? user.streaks;
        return user;
    }
    /**
     * 
     * @param userObjectId the user's google ID
     * should be retrieved from Google API using the google OAuth token
     * @returns 
     */
    public static async create(userObjectId: ObjectId): Promise<User | null> {
        //create wardrobe for the user
        const newWardrobe = await Wardrobe.create(userObjectId);
        const wardrobeUID = newWardrobe != null ? newWardrobe?.id : null;
        const newUser = new User(userObjectId);
        newUser.wardrobe = wardrobeUID;
        await newUser.writeToDatabase();
        return newUser;
    }

    /**
     * 
     * @returns all posts of the user in String format
     */
    public async getPosts(): Promise<ObjectId[] | null> {
        return this.posts;
    }

    /**
     * 
     * @param postUID the new postUID to add to the post String of User
     * @returns void
     */
    public async addPost(postUID: ObjectId): Promise<void> {
        this.posts.push(postUID);
    }

    public setName(newName: string) {
        this.name = newName;
    }

    /**
       * Converts the object into a form for the database
       * @returns a database entry
       */
    public toJson() {
        const { collectionName: _c, ...entry } = this;
        return {
            ...entry,
            posts: this.posts,
            wardrobe: this.wardrobe
        };
    }
}