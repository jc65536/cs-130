import { NextFunction, Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import crypto from 'crypto';
import { ObjectId } from "mongodb";
import { User } from "../lib/user";
import { DbClient, getClient } from "../lib/db-lib/db-client";
import { COLLECTION } from "../lib/enums";

const client = new OAuth2Client();
const CLIENT_ID = "121044225700-6gotpenj58iao2fo2qkm573h11c7hbof.apps.googleusercontent.com";

/**
 * 
 * @param s string id that needs to be used
 * @returns a 24 character hexadecimal string to use as the id for mongoDB
 * mongoDB requires a 24 character hexadecimal string as the document id
 */
function convertTo24CharHex(s: String) {
    const hash = crypto.createHash('sha256');
    hash.update(Buffer.from(s));
    const fullHash = hash.digest('hex');
    return fullHash.slice(0, 24);
}

/**
 * middleware function to authenticate the google oauth token
 * the token should be placed in the headers as an bearer authorization token
 * the request should be formatted like headers: {Authorization: "Bearer {token}"}
 * 
 * this validates the google oauth token with google to get the user id and checks if the token has expired
 * then it hashes the user id into a 24 character hash to use as the id for mongodb
 * note, mongodb requries 24 character length hexadecimal strings as object ids
 * 
 * this will set res.locals.userID and res.locals.userObjectId which can be accessed in later middleware functions
 * res.locals.userID will be the google user id
 * res.locals.userObjectId will be the 24 character hexadecimal hash of the user id (this is used for indexing the database)
 * @param req 
 * @param res 
 * @param next 
 */
export async function validateGoogleOAuthToken(req: Request, res: Response, next:NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    console.log("inside the start of validateGoogleOAuthToken");
    // using my google oauth token rn for testing purposes
    // const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjU1YzE4OGE4MzU0NmZjMTg4ZTUxNTc2YmE3MjgzNmUwNjAwZThiNzMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxMjEwNDQyMjU3MDAtNmdvdHBlbmo1OGlhbzJmbzJxa201NzNoMTFjN2hib2YuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIxMjEwNDQyMjU3MDAtNmdvdHBlbmo1OGlhbzJmbzJxa201NzNoMTFjN2hib2YuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTI4MTI3NzY1ODc1NDkxNTg3OTEiLCJlbWFpbCI6ImRhcnJlbnpoYW5nMjJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5iZiI6MTcwODMzMTYxNiwibmFtZSI6IkRhcnJlbiBaaGFuZyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NJV0I3dzVjb1JVeHQxRDhrT3BZZEpVZGN1TV9ZYmpfdHJxZVBXNFo3SXQ9czk2LWMiLCJnaXZlbl9uYW1lIjoiRGFycmVuIiwiZmFtaWx5X25hbWUiOiJaaGFuZyIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNzA4MzMxOTE2LCJleHAiOjE3MDgzMzU1MTYsImp0aSI6ImJiNWI5NGI1ODZhY2RhN2RlN2Q2NzY0N2MxMGIwZTM1ZDM2ODg4NmIifQ.U2JeyIR5JflQ9h9uGY05rZc9keFie-tPuQekCbKshIB_8gzv1G3ltZabcdNPvkEDjcMsWuuLESo6Zm6vrB-q_EzWKxZsZ8VSHbPN4zusxVh3MO6OyuxGbF8VUBd_1rcMyrn-scXHIj3WnaLqBbZgl_9a8jkIYOMvfjTBEKdiqgslWxMoAFFyU35edIHi_XX2nC3q-_tCgSLguE_HOObIMoxy7RXz8YXExZqFRN8XDge4CPNXiZ3puLT4X6DGV2DFHlIUqPT5-PH4DZ2IxMs3GDrYNzUpYn2RvbGDSkBnudVNLHbxr4Tjkb7xwzYUJr7-wqwqfUmBzlc7hB0IOE4_6w";
    
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token ?? '',
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const userid = ticket.getUserId();
        console.log("userid: ");
        console.log(userid);
        return userid;
    }

    var userid;
    try {
        userid = await verify();
    } catch (err) {
        console.error("Error validating google oauth token: ",err);
        return res.status(401).json("invalid google oauth token").end();
    }

    console.log("successfully ran verifyId");
    console.log("userid: ",userid);
    if (!userid) {
        return res.status(401).json("invalid user id from google oauth token").end();
    } else {
        // get hashed version of the user id to use as object id for mongodb
        console.log("successfully verified id");
        const userIdHash = convertTo24CharHex(userid);
        const userObjId = new ObjectId(userIdHash);
        console.log("user object id: ",userObjId);

        // if user doesn't exist in database, add the user to the database
        const dbClient: DbClient = await getClient();
        const document = await dbClient.findDbItem(COLLECTION.USERS, userObjId);
        if (document == null) {
            console.log("writing user to db");
            const user = new User(userObjId);
            await user.writeToDatabase();
        } 

        console.log("document: ",document);
        console.log("successfully created/verified user in database");
        res.locals.userID = userid;
        res.locals.userObjectId = userIdHash;
        next();
    }
}
