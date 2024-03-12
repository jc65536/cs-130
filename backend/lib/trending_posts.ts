import { convertTo24CharHex } from "../endpoints/utils";
import { DbItem } from "./db-lib/db-item";
import { COLLECTION } from "./enums";
import { ObjectId } from "mongodb";
import { getClient } from "./db-lib/db-client";
import { User } from "./user";
import { Post } from "./post";

export type TrendingPostsDatabaseEntry = {
    posts: ObjectId[], // the ids of the Post objects
    dateLastUpdated: Date
};

export class TrendingPosts extends DbItem {
    posts: ObjectId[];
    dateLastUpdated: Date;

    /**
     * 
     * @param id ObjectId from mongo
     * @param imageFilename string
     * @param caption String
     * @param tags string array of ids for Clothing class dbItem
     * @returns 
     */
    constructor() {
        super(new ObjectId(convertTo24CharHex("0")), COLLECTION.TRENDING)
        this.posts = [];
        this.dateLastUpdated = new Date();
    }

    public static async getTrendingPosts(): Promise<TrendingPosts> {
        const dbClient = getClient();
        console.log("AKSDJAKLSD " + convertTo24CharHex("0"));
        const trendingPosts = await dbClient.findDbItem(COLLECTION.TRENDING, new ObjectId(convertTo24CharHex("0")));
        if (trendingPosts) {
            const trending = new TrendingPosts();
            trending.posts = trendingPosts.posts;
            trending.dateLastUpdated = trendingPosts.dateLastUpdated;
            return trending;
        }
        else {
            const trending = new TrendingPosts();
            await trending.writeToDatabase();
            return trending;
        }
    }

    public async updateTrendingPosts() {
            // get all posts
            const allPosts = await Post.all();
            console.log("ALL POSTS: " + allPosts);

            // loop through their rating buckets
            const trendingPosts = [];
            for (const post of allPosts) {
                const ratingBuckets = await post.getRatingBuckets();

                // get ratings from last 7 days
                const validRatingBuckets = ratingBuckets.filter((rating) => rating.date >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

                // update post to have only the valid rating buckets
                post.setRatingBuckets(validRatingBuckets);
                // sum number of ratings in last 7 days
                let sum = 0;
                for (const rating of validRatingBuckets) {
                        sum += rating.numRatings;
                    }

                // add post to trendingPosts array with sum as a property
                trendingPosts.push({ post, sum });
            }

            // sort by sum in descending order
            trendingPosts.sort((a, b) => b.sum - a.sum);

            // update date for trending posts
            this.dateLastUpdated = new Date();

            // update posts array with the ids of the trending posts
            this.posts = trendingPosts.map((trendingPost) => trendingPost.post.id);

            // save the updated trending posts to the database
            await this.writeToDatabase();
    }
    
    /**
       * Converts the object into a form for the database
       * @returns a database entry
       */
    public toJson() {
        const { collectionName: _c, ...entry } = this;
        return {
            ...entry,
        };
    }

}
