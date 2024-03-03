import { getClient } from "./db-lib/db-client";
import { COLLECTION } from "./enums";
import { ObjectId } from "mongodb";

export class UserClient {
    private static dbClient = getClient();

    /**
     * 
     * @param userUID the user's ID
     * @returns 
     */
        public static async getPosts( userUID: ObjectId ): Promise<String | null> {
            const dbClient = await this.dbClient;
            const user = await dbClient.findDbItem(COLLECTION.USERS, userUID);
            const posts = await user.getPosts();
            return posts;
        }
}