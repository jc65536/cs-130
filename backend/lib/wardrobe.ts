import { DbItem } from "./db-lib/db-item";
import { COLLECTION } from "./enums";
import { ObjectId } from "mongodb";
import { getClient } from "./db-lib/db-client";

type WardrobeDatabaseEntry = {
    _id: ObjectId,
    posts: String[],
    clothes:String[]
};

export class Wardrobe extends DbItem {
    clothes: String[];
    posts: String[];
    userUID: String;

    /**
     * 
     * @param 
     * @returns 
     */
    constructor(id: ObjectId) {
        super(id, COLLECTION.POSTS)
        this.userUID = '';
        this.clothes = [];
        this.posts = [];
    }

    public static async fromId(userObjectId: ObjectId) {
        const dbClient = getClient();
        const user = await dbClient.findDbItem(COLLECTION.USERS, userObjectId);
        const wardrobeObjId =  new ObjectId(user.wardrobe);
        const document: WardrobeDatabaseEntry = await dbClient.findDbItem(COLLECTION.WARDROBE, wardrobeObjId);
        const wardrobe = new Wardrobe(wardrobeObjId);
        wardrobe.posts = document.posts;
        wardrobe.clothes = document.clothes;
        return wardrobe;
    }
    /**
     * 
     * @param userUID the user's google ID
     * should be retrieved from Google API using the google OAuth token
     * @returns 
     */
    public static async create(userUID: string): Promise<Wardrobe | null> {
        const newWardrobe = new Wardrobe(new ObjectId());
        newWardrobe.userUID = userUID;
        return newWardrobe;
    }

    public async getClothes(): Promise<String[] | null> {
        return this.clothes;
    }

    public async getPosts(): Promise<String[] | null> {
        return this.posts;
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