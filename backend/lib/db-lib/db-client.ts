import { Collection, Db, Document, ObjectId, MongoClient, WithId, ServerApiVersion } from "mongodb";
import { COLLECTION } from '../enums';

// Replace the placeholder with your Atlas connection string
export const uri = "mongodb://root:example@mongo:27017/";
// const MONGODB_USER_PASSWORD = process.env["MONGODB_USER_PASSWORD"]
// const uri = "mongodb+srv://darrenzhang22:"+MONGODB_USER_PASSWORD+"@cs130-db.nwgwcug.mongodb.net/?retryWrites=true&w=majority&appName=cs130-db";

import { DbItem } from './db-item';

/**
 * A Client for managing database connections.
 */
export class DbClient {
    /**
     * The MongoDB Client.
     *
     * @throws if the Client is not configured
     */

    /**
     * Database collections where the key is the collection name.
     */
    public readonly collections: Record<string, any>;

    get mongoDB(): Db {
        if (this._mongoDB == null) {
            throw new Error(
                'MongoDB is not configured'
            );
        }
        return this._mongoDB;
    }

    /**
     * The private variable containing the mongoDB connection reference
     */
    private _mongoDB?: Db;

    public constructor() {
        console.log(uri);
        console.log("Trying to connect to mongod client")
        const mongoClient = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        mongoClient.connect();
        this._mongoDB = mongoClient.db("admin");
        this.mongoDB.command({ ping: 1 });
        console.log("successfulyl connected to mongodb")
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
    public async openCollection(collectionName: COLLECTION): Promise<Collection<Document>> {
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
    public async findDbItem(collectionName: COLLECTION, id: ObjectId): Promise<any | null> {
        const collection = await this.openCollection(collectionName);
        const item = await collection.findOne({_id: id});
        return item ?? null;
    }

    /**
     * Get all the items in a collecion
     *
     * @param collectionName the collection to query
     * @returns all the items in a collection
     * the items are represent as json objects
     */
    public async getCollectionItems(collectionName: COLLECTION): Promise<WithId<Document>[]> {
        const collection = await this.openCollection(collectionName);
        const docs = await collection.find();
        const data: WithId<Document>[] = [];
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
    public async writeDbItems(...items: DbItem[]): Promise<void> {
        items.forEach(async item => {
            console.log("inside write DB items");
            console.log(item);
            const collection = await this.openCollection(item.collectionName);
            // void collection.doc(item.id).set(item.toJson());
            void collection.replaceOne({"_id": new ObjectId(item.id)}, item.toJson(), {upsert: true});
        });
    }

    /**
     * Remove a document by the id and collection name
     *
     * @param item the item to delete from the database
     */
    public async deleteDbItem(item: DbItem): Promise<any> {
        const collection = await this.openCollection(item.collectionName);
        return collection.deleteOne({_id: item.id});
    }
}

let CLIENT: DbClient;

export function getClient(): DbClient {
    if (CLIENT != undefined) return CLIENT;

    CLIENT = new DbClient();
    return CLIENT;
}