import { DbItem } from "./db-lib/db-item";
import { COLLECTION } from "./enums";
import { ObjectId } from "mongodb";
import { getClient } from "./db-lib/db-client";

export class Wardrobe extends DbItem {
    clothes: String[];
    posts: String[];
    userUID: String;

    /**
     * 
     * @param 
     * @returns 
     */
    constructor(id: ObjectId, userUID:String, clothes:String[], posts:String[]) {
        super(id, COLLECTION.POSTS)
        this.userUID = userUID;
        this.clothes = clothes;
        this.posts = posts;
    }

    /**
     * 
     * @param userUID the user's google ID
     * should be retrieved from Google API using the google OAuth token
     * @returns 
     */
    public static async create(userUID: string): Promise<Wardrobe | null> {
        return new Wardrobe(new ObjectId(), userUID, [], []);;
    }
    

    /**
       * Converts the object into a form for the database
       * @returns a database entry
       */
    public toJson() {
        const { collectionName: _c, ...entry } = this;
        return {
            ...entry,
            clothes: this.clothes,
            posts: this.posts,
            userUID: this.userUID
        };
    }
}