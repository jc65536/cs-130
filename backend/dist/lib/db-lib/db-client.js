"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClient = exports.DbClient = exports.uri = void 0;
const mongodb_1 = require("mongodb");
// Replace the placeholder with your Atlas connection string
exports.uri = "mongodb://root:example@mongo:27017/";
/**
 * A Client for managing database connections.
 */
class DbClient {
    /**
     * The MongoDB Client.
     *
     * @throws if the Client is not configured
     */
    /**
     * Database collections where the key is the collection name.
     */
    collections;
    get mongoDB() {
        if (this._mongoDB == null) {
            throw new Error('MongoDB is not configured');
        }
        return this._mongoDB;
    }
    /**
     * The private variable containing the mongoDB connection reference
     */
    _mongoDB;
    constructor() {
        console.log(exports.uri);
        console.log("Trying to connect to mongod client");
        const mongoClient = new mongodb_1.MongoClient(exports.uri, {
            serverApi: {
                version: mongodb_1.ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        mongoClient.connect();
        this._mongoDB = mongoClient.db("admin");
        this.mongoDB.command({ ping: 1 });
        console.log("successfulyl connected to mongodb");
        this.collections = {};
    }
    /**
     * Open a database collection given the collection name.
     *
     *
     * For example:
     * ```
     * client.openCollection('users')  // looks up `users`
     * ```
     *
     * @param collectionName the name of the collection
     */
    async openCollection(collectionName) {
        if (this.collections[collectionName] != null)
            return this.collections[collectionName];
        const collection = await this.mongoDB.collection(collectionName);
        if (collection == undefined) {
            throw new Error('Collection not found. Make sure you provide the correct collection name.');
        }
        this.collections[collectionName] = collection;
        return collection;
    }
    /**
     * Query for a document by the id and collection name
     *
     * @param id the id of the document
     * @param collectionName the collection to query from
     * @returns the soda document associated with the query
     */
    async findDbItem(collectionName, id) {
        const collection = await this.openCollection(collectionName);
        const item = await collection.findOne({ _id: id });
        return item ?? null;
    }
    /**
     * Get all the items in a collecion
     *
     * @param collectionName the collection to query
     * @returns all the items in a collection
     * the items are represent as json objects
     */
    async getCollectionItems(collectionName) {
        const collection = await this.openCollection(collectionName);
        const docs = await collection.find();
        const data = [];
        for await (const doc of docs) {
            data.push(doc);
        }
        return data;
    }
    /**
     * Write database items to a database
     *
     * @param items the items to insert into the database
     */
    async writeDbItems(...items) {
        items.forEach(async (item) => {
            console.log("inside write DB items");
            console.log(item);
            const collection = await this.openCollection(item.collectionName);
            // void collection.doc(item.id).set(item.toJson());
            void collection.replaceOne({ "_id": new mongodb_1.ObjectId(item.id) }, item.toJson(), { upsert: true });
        });
    }
    /**
     * Remove a document by the id and collection name
     *
     * @param item the item to delete from the database
     */
    async deleteDbItem(item) {
        const collection = await this.openCollection(item.collectionName);
        return collection.deleteOne({ _id: item.id });
    }
}
exports.DbClient = DbClient;
let CLIENT;
function getClient() {
    if (CLIENT != undefined)
        return CLIENT;
    CLIENT = new DbClient();
    return CLIENT;
}
exports.getClient = getClient;
