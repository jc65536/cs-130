import { convertTo24CharHex } from "../endpoints/utils";
import { DbItem } from "./db-lib/db-item";
import { COLLECTION } from "./enums";
import { ObjectId } from "mongodb";
import { getClient } from "./db-lib/db-client";

type ClothingDatabaseEntry = {
    tags: String[],
    reusedCount: Number,
    rating: Number,
    ratingCount: Number,
    cost: Number,
    onSale: Boolean,
    userUID: String
}

export class Clothing extends DbItem {
    tags: String[];
    reusedCount: Number;
    rating: Number;
    ratingCount: Number;
    cost: Number;
    onSale: Boolean;
    userUID: String;

    /**
     * 
     * @param 
     * @returns 
     */
    constructor(id: ObjectId) {
        super(id, COLLECTION.POSTS)
        this.userUID = '';
        this.tags = [];
        this.reusedCount = 0;
        this.rating = 0;
        this.ratingCount = 0;
        this.cost = 0;
        this.onSale = false;
    }

    public static async fromId(clothingObjectId: ObjectId) {
        const dbClient = getClient();
        const document: ClothingDatabaseEntry = await dbClient.findDbItem(COLLECTION.CLOTHES, clothingObjectId);
        const clothing = new Clothing(clothingObjectId);
        clothing.tags = document.tags;
        clothing.reusedCount = document.reusedCount;
        clothing.cost = document.cost;
        clothing.rating = document.rating;
        clothing.ratingCount = document.ratingCount;
        clothing.onSale = document.onSale;
        clothing.userUID = document.userUID;
        return clothing;
    }

    /**
     * 
     * @param userUID the user's google ID
     * should be retrieved from Google API using the google OAuth token
     * @returns 
     */
    public static async create(userUID: string, tags:String[], reusedCount:Number, rating:Number, ratingCount:Number, cost:Number, onSale:Boolean): Promise<Clothing | null> {
        const objectId = new ObjectId(convertTo24CharHex(userUID));
        // find the user
        //add the object under the users post string
        const dbClient = getClient();
        const post = await dbClient.findDbItem(COLLECTION.POSTS, objectId);
        const newClothing = new Clothing(new ObjectId());
        newClothing.tags = tags;
        newClothing.reusedCount = reusedCount;
        newClothing.rating = rating;
        newClothing.ratingCount = ratingCount;
        newClothing.cost = cost;
        newClothing.onSale = onSale;
        await post.addClothing(newClothing.id.toString());
        return newClothing;
    }
    public async getReusedCount(): Promise<Number | null> {
        return this.ratingCount;
    }
    public async getCost(): Promise<Number | null> {
        return this.cost;
    }
    public async getOnSale(): Promise<Boolean | null> {
        return this.onSale;
    }
    public async getTags(): Promise<String[] | null> {
        return this.tags;
    }
    public async getRating(): Promise<Number | null> {
        return this.rating;
    }
    public async getRatingCount(): Promise<Number | null> {
        return this.ratingCount;
    }

    public async addTags(newTags: String[]): Promise<void> {
        this.tags.concat(newTags);
    }
    public async toggleOnSale(): Promise<void> {
        this.onSale = !this.onSale;
    }
    public async updateCost(cost: Number): Promise<void> {
        this.cost = cost;
    }
    public async updateReusedCount(count: Number = -1): Promise<void> {
        if (count == -1) this.reusedCount = +this.reusedCount + 1;
        else this.reusedCount = count;
    }
    public async updateRating(newRating: Number): Promise<void> {
        this.ratingCount = +this.ratingCount + 1;
        this.rating = (+this.rating + +newRating) / (+this.ratingCount);
    }

    /**
       * Converts the object into a form for the database
       * @returns a database entry
       */
    public toJson() {
        const { collectionName: _c, ...entry } = this;
        return {
            ...entry,
            userUID: this.userUID,
            tags: this.tags,
            reusedCount: this.reusedCount,
            rating: this.rating,
            cost: this.cost,
            onSale: this.onSale
        };
    }
}