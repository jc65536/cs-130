import { convertTo24CharHex } from "../endpoints/utils";
import { getClient } from "./db-lib/db-client";
import { DbItem } from "./db-lib/db-item";
import { COLLECTION } from "./enums";
import { ObjectId, WithId } from "mongodb";
import { Wardrobe } from "./wardrobe";
import { Post } from "./post";

type UserDatabaseEntry = {
    _id: ObjectId,
    posts: ObjectId[], // the ids of the Post objects
    wardrobe: ObjectId,
    name: string,
    followers: number,
    streaks: number,
    bestStreak: number,
    savedPosts: ObjectId[],
    achievements: string[],
    ratedPosts: { postId: ObjectId; rating: number }[],
    avatarFilename: string,
};

export class User extends DbItem {
    posts: ObjectId[];
    wardrobe: ObjectId | null;
    name: string;
    followers: number;
    streaks: number;
    bestStreak: number;
    savedPosts: ObjectId[];
    achievements: string[];
    // private dbClient = getClient();
    ratedPosts: {postId: ObjectId, rating: number}[];
    avatarFilename: string;

    achievementFuncs = {
        "5 Day Streak": async () => await this.getBestStreak() > 5,
        "10 Day Streak": async () => await this.getBestStreak() > 10,
        "30 Day Streak": async () => await this.getBestStreak() > 30,
        "60 Day Streak": async () => await this.getBestStreak() > 60,
        "100 Day Streak": async () => await this.getBestStreak() > 100,
        "365 Day Streak": async () => await this.getBestStreak() > 365,
        "1000 Day Streak": async () => await this.getBestStreak() > 1000,
        "2000 Day Streak": async () => await this.getBestStreak() > 2000,
        "3000 Day Streak": async () => await this.getBestStreak() > 3000,
        "5000 Day Streak": async () => await this.getBestStreak() > 5000,
        "6000 Day Streak": async () => await this.getBestStreak() > 6000,
        "10000 Day Streak": async () => await this.getBestStreak() > 10000,
    }

    constructor(id: ObjectId) {
        super(id, COLLECTION.USERS);
        this.posts = [];
        this.wardrobe = null;
        this.name = '';
        this.followers = 0;
        this.streaks = 0;
        this.bestStreak = 0;
        this.ratedPosts = [];
        this.savedPosts = [];
        this.achievements = [];
        this.avatarFilename = '';
    }

    public static async fromId(userObjectId: ObjectId) {
        const dbClient = getClient();
        const document: UserDatabaseEntry = await dbClient.findDbItem(COLLECTION.USERS, userObjectId);
        if (!document) {
            console.log("User doesn't exist: " + userObjectId);
            return null;
        }
        const user = new User(userObjectId);
        user.posts = document.posts ?? user.posts;
        user.wardrobe = document.wardrobe ?? user.wardrobe;
        user.name = document.name ?? user.name;
        user.followers = document.followers ?? user.followers;
        user.streaks = document.streaks ?? user.streaks;
        user.bestStreak = document.bestStreak ?? user.bestStreak;
        user.ratedPosts = document.ratedPosts ?? user.ratedPosts;
        user.savedPosts = document.savedPosts ?? user.savedPosts;
        user.achievements = document.achievements ?? user.achievements;
        user.avatarFilename = document.avatarFilename ?? user.avatarFilename;
        return user;
    }
    /**
     *
     * @param userObjectId the user's google ID
     * should be retrieved from Google API using the google OAuth token
     * @returns
     */
    public static async create(userObjectId: ObjectId): Promise<User | null> {
        //create wardrobe for the user
        const newWardrobe = await Wardrobe.create(userObjectId);
        const wardrobeUID = newWardrobe != null ? newWardrobe?.id : null;
        const newUser = new User(userObjectId);
        newUser.wardrobe = wardrobeUID;
        await newUser.writeToDatabase();
        return newUser;
    }

    /**
     *
     * @returns all posts of the user in String format
     */
    public async getPosts(): Promise<ObjectId[] | null> {
        return this.posts;
    }

    public async getCurrStreak(): Promise<number> {
        var streak = 1;
        for (var i = this.posts.length - 1; i > 0; i--) {
            // note: assume posts are sorted by time
            const curr_post = await Post.fromId(this.posts[i]);
            const prev_post = await Post.fromId(this.posts[i - 1]);
            const curr_date = await curr_post.getDate();
            const prev_date = await prev_post.getDate();
            // 1 day
            if (curr_date.getTime() - prev_date.getTime() < 1000 * 60 * 60 * 24) {
                streak++;
            }
        }
        return streak;
    }

    public async getBestStreak(): Promise<number> {
        return this.bestStreak;
    }

    /**
     *
     * @param postUID the new postUID to add to the post String of User
     * @returns void
     */
    public async addPost(postUID: ObjectId): Promise<void> {
        this.posts.push(postUID);
        const streak = await this.getCurrStreak();
        this.streaks = streak;
        if (this.bestStreak < streak) {
            this.bestStreak = streak;
        }

        const newAchievements = [];
        for (const [achievement, achievementFunc] of Object.entries(this.achievementFuncs)) {
            if (await achievementFunc()) {
                newAchievements.push(achievement);
            }
        }
        this.achievements = newAchievements;

        await this.writeToDatabase();
    }

    public async setName(newName: string) {
        this.name = newName;
        await this.writeToDatabase();
    }

    /**
     * 
     * @param postId the id of the post
     * @return the rating the user gave the post
     */
    public async getRatingForPost(postId: ObjectId): Promise<number> {
        // find the post in the ratedPosts
        const post = this.ratedPosts.find((entry) => entry.postId.equals(postId));
        if (post) {
            return post.rating;
        }
        return 0;
    }

    public async setRatingForPost(postId: ObjectId, rating: number): Promise<void> {
        // check if the post is already rated
        const index = this.ratedPosts.findIndex((entry) => entry.postId.equals(postId));
        if (index === -1) {
            this.ratedPosts.push({postId, rating});
        } else {
            this.ratedPosts[index].rating = rating;
        }
        await this.writeToDatabase();
    }

    public async getRatedPosts(): Promise<{postId: ObjectId, rating: number}[]> {
        return this.ratedPosts;
    }

    public async setAvatarImageFilename(filename: string) {
        this.avatarFilename = filename;
        await this.writeToDatabase();
    }

    /**
     * Converts the object into a form for the database
     * @returns a database entry
     */
    public toJson() {
        const { collectionName: _c, achievementFuncs: _a, ...entry } = this;
        return {
            ...entry,
            posts: this.posts,
            wardrobe: this.wardrobe,
            bestStreak: this.bestStreak,
            achievements: this.achievements,
            ratedPosts: Array.from(this.ratedPosts)
        };
    }

    public async toggleSavePost(postID: ObjectId) {
        const idx = this.savedPosts.findIndex(id => postID.equals(id));
        const add = idx === -1;
        if (add) {
            this.savedPosts.push(postID);
        } else {
            this.savedPosts.splice(idx, 1);
        }
        await this.writeToDatabase();
        return add;
    }

    public hasSavedPost(postId: ObjectId) {
        return this.savedPosts.some(id => postId.equals(id));
    }
}
