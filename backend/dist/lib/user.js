"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const db_client_1 = require("./db-lib/db-client");
const db_item_1 = require("./db-lib/db-item");
const enums_1 = require("./enums");
const wardrobe_1 = require("./wardrobe");
class User extends db_item_1.DbItem {
    posts;
    wardrobe;
    // private dbClient = getClient();
    constructor(id) {
        super(id, enums_1.COLLECTION.USERS);
        this.posts = [];
        this.wardrobe = null;
    }
    static async fromId(userObjectId) {
        const dbClient = (0, db_client_1.getClient)();
        const document = await dbClient.findDbItem(enums_1.COLLECTION.USERS, userObjectId);
        const user = new User(userObjectId);
        user.posts = document.posts;
        user.wardrobe = document.wardrobe;
        return user;
    }
    /**
     *
     * @param userObjectId the user's google ID
     * should be retrieved from Google API using the google OAuth token
     * @returns
     */
    static async create(userObjectId) {
        //create wardrobe for the user
        const newWardrobe = await wardrobe_1.Wardrobe.create(userObjectId);
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
    async getPosts() {
        return this.posts;
    }
    /**
     *
     * @param postUID the new postUID to add to the post String of User
     * @returns void
     */
    async addPost(postUID) {
        this.posts.push(postUID);
    }
    /**
       * Converts the object into a form for the database
       * @returns a database entry
       */
    toJson() {
        const { collectionName: _c, ...entry } = this;
        return {
            ...entry,
            posts: this.posts,
            wardrobe: this.wardrobe
        };
    }
}
exports.User = User;
