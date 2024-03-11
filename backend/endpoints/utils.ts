import express, { NextFunction, Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import crypto from 'crypto';
import { ObjectId } from "mongodb";
import { User } from "../lib/user";
import { DbClient, getClient } from "../lib/db-lib/db-client";
import { COLLECTION } from "../lib/enums";
import session, { SessionOptions } from 'express-session';

const client = new OAuth2Client();
const CLIENT_ID = "121044225700-6gotpenj58iao2fo2qkm573h11c7hbof.apps.googleusercontent.com";

/**
 * 
 * @param s string id that needs to be used
 * @returns a 24 character hexadecimal string to use as the id for mongoDB
 * mongoDB requires a 24 character hexadecimal string as the document id
 */
export function convertTo24CharHex(s: String) {
    const hash = crypto.createHash('sha256');
    hash.update(Buffer.from(s));
    const fullHash = hash.digest('hex');
    return fullHash.slice(0, 24);
}

/**
 * middleware function to authenticate the user by either:
 * * validating the google oauth token when the original url is /login
 * * or checking that the session contains the userID
 * when the /login route is called, the token should be placed in the headers as an bearer authorization token
 * the request should be formatted like headers: {Authorization: "Bearer {token}"}
 * 
 * this validates the google oauth token with google to get the user id and checks if the token has expired
 * then it hashes the user id into a 24 character hash to use as the id for mongodb
 * note, mongodb requries 24 character length hexadecimal strings as object ids
 * 
 * this will set req.session.userID and req.session.userObjectId which can be accessed in later middleware functions and be placed as a cookie
 * req.session.userID will be the google user id
 * req.session.userObjectId will be the 24 character hexadecimal hash of the user id (this is used for indexing the database)
 * 
 * if the userID from the google token is different than the userID in the session (aka the user logged in with a different account before)
 * we generate a new session and override the userID with the new userID
 * 
 * if this is called not at the /login route, it will check:
 * that the session contains a valid user id and userObjectId
 * @param req 
 * @param res 
 * @param next 
 */
export async function validateUser(req: Request, res: Response, next: NextFunction) {
    if (req.originalUrl == '/login') { // verify google token and write user id to session
        console.log("inside validate user logic")
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        console.log("inside the start of validateGoogleOAuthToken");

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
            console.error("Error validating google oauth token: ", err);
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session:', err);
                    res.status(500).send('Error destroying session');
                }
            });
            return res.status(401).json("invalid google oauth token").end();
        }

        console.log("successfully ran verifyId");
        console.log("userid: ", userid);
        if (!userid) {
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session:', err);
                    res.status(500).send('Error destroying session');
                } else {
                    console.log("Successfully destroyed user session");
                }
            });
            return res.status(401).json("invalid user id from google oauth token").end();
        }
        if (req.session.userID && req.session.userID != userid) {
            req.session.regenerate((err) => {
                if (err) {
                    console.error("Error regenerating new session after receiving new google userid: " + err);
                    res.status(500).send('Error regenerating session');
                } else {
                    console.log("Successfully generated new session: " + req.sessionID);
                }
            });
        }
        // get hashed version of the user id to use as object id for mongodb
        const userIdHash = convertTo24CharHex(userid);
        const userObjId = new ObjectId(userIdHash);

        // if user doesn't exist in database, add the user to the database
        const dbClient: DbClient = getClient();
        const document = await dbClient.findDbItem(COLLECTION.USERS, userObjId);
        if (document == null) {
            const user = await User.create(userObjId);
            if (!user) {
                console.log("Failed to create new user in google verification");
            }
        }
        req.session.userID = userid;
        req.session.userObjectId = userIdHash;

        next();
    } else { // verify session contains user id
        if (!req.session.userID || !req.session.userObjectId) {
            return res.status(401).json("User is not signed in. Session does not contain user id");
        } else {
            const dbClient: DbClient = getClient();
            const document = await dbClient.findDbItem(COLLECTION.USERS, new ObjectId(req.session.userObjectId));
            if (document == null) {
                return res.status(401).json("User is not signed in. Invalid user id in session");
            }
        }
        console.log("session contains user id: " + req.session.userID+", objectID: "+req.session.userObjectId);
        next();
    }
}


export async function createNewPost(req: Request, res: Response, next:NextFunction) {
    const authHeader = req.headers.authorization;
}