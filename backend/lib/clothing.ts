import { convertTo24CharHex } from "../endpoints/utils";
import { DbItem } from "./db-lib/db-item";
import { COLLECTION } from "./enums";
import { ObjectId } from "mongodb";
import { getClient } from "./db-lib/db-client";
import {Post, PostDatabaseEntry} from './post';

type ClothingDatabaseEntry = {
    _id: ObjectId,
    name: string,
    reusedCount: number,
    rating: number,
    ratingCount: number,
    cost: number,
    onSale: Boolean,
    userObjectId: ObjectId
}

export class Clothing extends DbItem {
    name: string;
    reusedCount: number;
    rating: number;
    ratingCount: number;
    cost: number;
    onSale: Boolean;
    userObjectId: ObjectId;
    /**
     * 
     * @param 
     * @returns 
     */
    constructor(id: ObjectId, userObjectId: ObjectId) {
        super(id, COLLECTION.CLOTHES)
        this.userObjectId = userObjectId;
        this.name = '';
        this.reusedCount = 0;
        this.rating = 0;
        this.ratingCount = 0;
        this.cost = 0;
        this.onSale = false;
    }

    public static async fromId(clothingObjectId: ObjectId) {
        const dbClient = getClient();
        const document: ClothingDatabaseEntry = await dbClient.findDbItem(COLLECTION.CLOTHES, clothingObjectId);
        const clothing = new Clothing(clothingObjectId, document.userObjectId);
        clothing.name = document.name;
        clothing.reusedCount = document.reusedCount;
        clothing.cost = document.cost;
        clothing.rating = document.rating;
        clothing.ratingCount = document.ratingCount;
        clothing.onSale = document.onSale;
        clothing.userObjectId = document.userObjectId;
        return clothing;
    }

    /**
     * Creates a new Clothing object
     * this method does not add the clothing id to any Post object
     * @param userUID the user's google ID
     * should be retrieved from Google API using the google OAuth token
     * @returns 
     */
    public static async create(userObjectId: ObjectId, name: string, reusedCount:number, rating:number, ratingCount:number, cost:number, onSale:Boolean): Promise<Clothing | null> {
        const newClothing = new Clothing(new ObjectId(), userObjectId);
        newClothing.userObjectId = userObjectId;
        newClothing.name = name;
        newClothing.reusedCount = reusedCount;
        newClothing.rating = rating;
        newClothing.ratingCount = ratingCount;
        newClothing.cost = cost;
        newClothing.onSale = onSale;
        await newClothing.writeToDatabase();
        return newClothing;
    }
    public async getReusedCount(): Promise<number | null> {
        return this.ratingCount;
    }
    public async getCost(): Promise<Number | null> {
        return this.cost;
    }
    public async getOnSale(): Promise<Boolean | null> {
        return this.onSale;
    }
    public async getRating(): Promise<Number | null> {
        return this.rating;
    }
    public async getRatingCount(): Promise<Number | null> {
        return this.ratingCount;
    }
    public async toggleOnSale(): Promise<void> {
        this.onSale = !this.onSale;
    }
    public async updateCost(cost: number): Promise<void> {
        this.cost = cost;
    }
    public async updateReusedCount(count: number = -1): Promise<void> {
        if (count == -1) this.reusedCount = +this.reusedCount + 1;
        else this.reusedCount = count;
    }
    public async updateRating(newRating: number): Promise<void> {
        this.rating = (this.rating * this.ratingCount + newRating) / (this.ratingCount+1);
        this.ratingCount++;
    }

    /**
       * Converts the object into a form for the database
       * @returns a database entry
       */
    public toJson() {
        const { collectionName: _c, ...entry } = this;
        return {
            ...entry,
            userObjectId: this.userObjectId,
            reusedCount: this.reusedCount,
            rating: this.rating,
            cost: this.cost,
            onSale: this.onSale
        };
    }
}