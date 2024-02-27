"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserClient = void 0;
const db_client_1 = require("./db-lib/db-client");
const enums_1 = require("./enums");
class UserClient {
    static dbClient = (0, db_client_1.getClient)();
    /**
     *
     * @param userUID the user's ID
     * @returns
     */
    static async getPosts(userUID) {
        const dbClient = await this.dbClient;
        const user = await dbClient.findDbItem(enums_1.COLLECTION.USERS, userUID);
        const posts = await user.getPosts();
        return posts;
    }
}
exports.UserClient = UserClient;
