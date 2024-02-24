"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbItem = void 0;
const db_client_1 = require("./db-client");
/**
 * A database item. All database items should extend this class.
 */
class DbItem {
    /**
     * The object id of the item in a collection
     */
    id;
    /**
     * The collection this database item belongs to
     */
    collectionName;
    constructor(id, collectionName, _key = null) {
        this.id = id;
        this.collectionName = collectionName;
    }
    /**
     * Writes this database item to the database
     */
    async writeToDatabase() {
        const client = await (0, db_client_1.getClient)();
        return client.writeDbItems(this);
    }
    /**
     * Remove this database item from the database
     */
    async removeFromDatabase() {
        const client = await (0, db_client_1.getClient)();
        return client.deleteDbItem(this);
    }
}
exports.DbItem = DbItem;
