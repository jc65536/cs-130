import { DbItem } from "./db-lib/db-item";
import { COLLECTION } from "./enums";

export class User extends DbItem {
    posts: String[];

    constructor(id: number) {
        super(id, COLLECTION.USERS)
        this.posts = [];
    }
    /**
       * Converts the object into a form for the database
       * @returns a database entry
       */
    public toJson() {
        const { collectionName: _c, ...entry } = this;
        return {
            ...entry,
            posts: this.posts,
        };
    }
}