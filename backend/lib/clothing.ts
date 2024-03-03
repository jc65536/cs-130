import { convertTo24CharHex } from "./convert-hex";
import { DbItem } from "./db-lib/db-item";
import { COLLECTION } from "./enums";
import { ObjectId } from "mongodb";
import { getClient } from "./db-lib/db-client";

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
    constructor(id: ObjectId, userUID:String, tags:String[], reusedCount:Number, cost:Number, onSale:Boolean) {
        super(id, COLLECTION.POSTS)
        this.userUID = userUID;
        this.tags = tags;
        this.reusedCount = reusedCount;
        this.rating = 0;
        this.ratingCount = 0;
        this.cost = cost;
        this.onSale = onSale;
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
        const dbClient = await getClient();
        const post = await dbClient.findDbItem(COLLECTION.POSTS, objectId);
        const newClothing = new Clothing(new ObjectId(), userUID, tags, reusedCount, cost, onSale);
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