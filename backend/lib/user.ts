import { convertTo24CharHex } from "./convert-hex";
import { DbItem } from "./db-lib/db-item";
import { COLLECTION } from "./enums";
import { ObjectId } from "mongodb";
import { Wardrobe } from "./wardrobe";

export class User extends DbItem {
    posts: String[];
    wardrobe: String;
    // private dbClient = getClient();

    constructor(id: ObjectId) {
        super(id, COLLECTION.USERS)
        this.posts = [];
        this.wardrobe = '';
    }

    /**
     * 
     * @param userUID the user's google ID
     * should be retrieved from Google API using the google OAuth token
     * @returns 
     */
    public static async create(userUID: string): Promise<User | null> {
        const objectId = convertTo24CharHex(userUID);
        //create wardrobe for the user
        const newWardrobe = await Wardrobe.create(userUID);
        const wardrobeUID = newWardrobe != null ? newWardrobe?.id.toString() : '';
        const newUser = new User(new ObjectId(objectId));
        newUser.wardrobe = wardrobeUID;
        return newUser;
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