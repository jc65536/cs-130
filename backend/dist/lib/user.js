"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const convert_hex_1 = require("./convert-hex");
const db_item_1 = require("./db-lib/db-item");
const enums_1 = require("./enums");
const mongodb_1 = require("mongodb");
class User extends db_item_1.DbItem {
    posts;
    constructor(id) {
        super(id, enums_1.COLLECTION.USERS);
        this.posts = [];
    }
    /**
     *
     * @param userUID the user's google ID
     * should be retrieved from Google API using the google OAuth token
     * @returns
     */
    static async create(userUID) {
        const objectId = (0, convert_hex_1.convertTo24CharHex)(userUID);
        return new User(new mongodb_1.ObjectId(objectId));
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
        };
    }
}
exports.User = User;
