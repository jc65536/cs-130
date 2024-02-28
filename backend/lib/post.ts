import { convertTo24CharHex } from "./convert-hex";
import { DbItem } from "./db-lib/db-item";
import { COLLECTION } from "./enums";
import { ObjectId } from "mongodb";
import { getClient } from "./db-lib/db-client";

export class Post extends DbItem {
    clothes: String[];
    image: String;
    caption: String;

    /**
     * 
     * @param id ObjectId from mongo
     * @param image idk figure out later placeholder
     * @param caption String
     * @param tags string array of ids for Clothing class dbItem
     * @returns 
     */
    constructor(id: ObjectId, image:String, caption:String, clothes:String[]) {
        super(id, COLLECTION.POSTS)
        this.image = image;
        this.caption = caption;
        this.clothes = clothes;
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
        const newPost = new Post(new ObjectId(), image, caption, clothes);
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
    public async getImage(): Promise<String | null> {
        return this.image;
    }
    public async getCaption(): Promise<String | null> {
        return this.caption;
    }

    public async addClothes(clothingUID: string): Promise<void> {
        this.clothes.push(clothingUID);
    }
    public async updateImage(newImage: string): Promise<void> {
        this.image = newImage;
    }
    public async updateCaption(newCaption: string): Promise<void> {
        this.caption = newCaption;
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
            image: this.image,
            caption: this.caption
        };
    }
}