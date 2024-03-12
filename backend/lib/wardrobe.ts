import { DbItem } from "./db-lib/db-item";
import { COLLECTION } from "./enums";
import { ObjectId } from "mongodb";
import { getClient } from "./db-lib/db-client";

type WardrobeDatabaseEntry = {
    _id: ObjectId,
    posts: ObjectId[],
    clothes: ObjectId[],
    userObjectId: ObjectId,
};

export class Wardrobe extends DbItem {
    clothes: ObjectId[];
    posts: ObjectId[];
    userObjectId: ObjectId;

    /**
     * 
     * @param 
     * @returns 
     */
    constructor(id: ObjectId) {
        super(id, COLLECTION.WARDROBE)
        this.userObjectId = new ObjectId();
        this.clothes = [];
        this.posts = [];
    }

    /**
     * Get wardrobe from userObjectId because each user has one unique wardrobe
     * @param userObjectId 
     * @returns 
     */
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
     * @param userObjectID the user's google ID
     * should be retrieved from Google API using the google OAuth token
     * this is usually called by User.create()
     * @returns 
     */
    public static async create(userObjectId: ObjectId): Promise<Wardrobe | null> {
        const newWardrobe = new Wardrobe(new ObjectId());
        newWardrobe.userObjectId = userObjectId;
        await newWardrobe.writeToDatabase();
        return newWardrobe;
    }

    public getClothes(): ObjectId[] {
        return this.clothes;
    }

    public addClothes(clothingObjectId: ObjectId) {
        this.clothes.push(clothingObjectId);
    }

    public async getPosts(): Promise<ObjectId[] | null> {
        return this.posts;
    }
    
    public async clear() {
        this.clothes = [];
        this.posts = [];
        await this.writeToDatabase(); // TODO: need to update DB?
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
            userObjectId: this.userObjectId
        };
    }
}
