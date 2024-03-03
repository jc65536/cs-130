import { convertTo24CharHex } from "../endpoints/utils";
import { DbItem } from "./db-lib/db-item";
import { COLLECTION } from "./enums";
import { ObjectId } from "mongodb";

export class User extends DbItem {
    posts: String[];

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
     * @param user the user item
     * @returns 
     */
    public static async getPosts(user: User): Promise<String[] | null> {
        return user.posts;
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