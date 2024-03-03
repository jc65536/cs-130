import { convertTo24CharHex } from "../endpoints/utils";
import { getClient } from "./db-lib/db-client";
import { DbItem } from "./db-lib/db-item";
import { COLLECTION } from "./enums";
import { ObjectId, WithId } from "mongodb";

type UserDatabaseEntry = {
    _id: ObjectId,
    posts: String[],
};

export class User extends DbItem {
    posts: String[];

    constructor(id: ObjectId) {
        super(id, COLLECTION.USERS)
        this.posts = [];
    }

    public static async fromId(userObjectId: ObjectId) {
        const dbClient = getClient();
        const document: UserDatabaseEntry = await dbClient.findDbItem(COLLECTION.USERS, userObjectId);
        const user = new User(userObjectId);
        user.posts = document.posts;
        return user;
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