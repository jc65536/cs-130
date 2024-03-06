"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const utils_1 = require("../endpoints/utils");
const db_client_1 = require("./db-lib/db-client");
const db_item_1 = require("./db-lib/db-item");
const enums_1 = require("./enums");
const mongodb_1 = require("mongodb");
const wardrobe_1 = require("./wardrobe");
class User extends db_item_1.DbItem {
    posts;
    wardrobe;
    // private dbClient = getClient();
    constructor(id) {
        super(id, enums_1.COLLECTION.USERS);
        this.posts = [];
        this.wardrobe = '';
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
     * @param userUID the user's google ID
     * should be retrieved from Google API using the google OAuth token
     * @returns
     */
    static async create(userUID) {
        const objectId = (0, utils_1.convertTo24CharHex)(userUID);
        //create wardrobe for the user
        const newWardrobe = await wardrobe_1.Wardrobe.create(userUID);
        const wardrobeUID = newWardrobe != null ? newWardrobe?.id.toString() : '';
        const newUser = new User(new mongodb_1.ObjectId(objectId));
        newUser.wardrobe = wardrobeUID;
        return newUser;
    }
    /**
     *
     * @param userUID the user ID
     * @returns all posts of the user in String format
     */
    async getPosts() {
        return this.posts;
    }
    /**
     *
     * @param userUID the user ID
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
