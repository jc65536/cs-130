import { convertTo24CharHex } from "./convert-hex";
import { DbItem } from "./db-lib/db-item";
import { COLLECTION } from "./enums";
import { ObjectId } from "mongodb";
// import { getClient } from "./db-lib/db-client";

export class User extends DbItem {
    posts: String[];
    // private dbClient = getClient();

    constructor(id: ObjectId) {
        super(id, COLLECTION.USERS)
        this.posts = [];
    }

    /**
     * 
     * @param userUID the user's google ID
     * should be retrieved from Google API using the google OAuth token
     * @returns 
     */
    public static async create(userUID: string): Promise<User | null> {
        const objectId = convertTo24CharHex(userUID);
        return new User(new ObjectId(objectId));
    }

    /**
     * 
     * @param userUID the user ID
     * @returns all posts of the user in String format
     */
    public async getPosts(): Promise<String[] | null> {
        return this.posts;
    }

    /**
     * 
     * @param userUID the user ID
     * @param postUID the new postUID to add to the post String of User
     * @returns void
     */
    public async addPost(postUID: string): Promise<void> {
        this.posts.push(postUID);
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
        };
    }
}