import { convertTo24CharHex } from '../endpoints/utils';
import { DbItem } from '../lib/db-lib/db-item';
import { User } from '../lib/user';
import { Post } from '../lib/post';
import { ObjectId } from 'mongodb';
jest.mock('../lib/db-lib/db-client');

import { DbClient, getClient } from '../lib/db-lib/db-client';

const postId = new ObjectId("123412345678901234567890");
const userId = new ObjectId();
const wardrobeId = new ObjectId();

beforeAll(() => {
    jest.spyOn(DbItem.prototype, 'writeToDatabase').mockResolvedValue();
    jest.spyOn(Post, 'fromId').mockResolvedValue(new Post(postId));
});

beforeEach(() => {
    jest.resetModules();
});

describe("test User", () => {

    test("test add Post", async () => {
        const id = convertTo24CharHex("randomUserId");
        const user = await User.create(new ObjectId(id));
        expect(user).toBeTruthy();

        user?.addPost(postId);
        const userPosts = await user?.getPosts();
        expect(userPosts).toBeTruthy();
        expect(userPosts ? userPosts[0] : null).toEqual(postId);
    });

    test("set name", async () => {
        const id = convertTo24CharHex("randomUserId");
        const user = await User.create(new ObjectId(id));
        expect(user).toBeTruthy();

        user?.setName("new name");
        expect(user?.name).toEqual("new name");
    });

    test("test rate Post", async () => {
        const id = convertTo24CharHex("randomUserId");
        const user = await User.create(new ObjectId(id));
        expect(user).toBeTruthy();

        user?.addPost(postId);
        const userPosts = await user?.getPosts();
        expect(userPosts).toBeTruthy();
        expect(userPosts ? userPosts[0] : null).toEqual(postId);

        user?.setRatingForPost(postId, 4.0);
        const rating = await user?.getRatingForPost(postId);
        expect(rating).toEqual(4.0);
    });

    test("test fromId returns null", async () => {
        // for some reason this test causes jest to not exit properly
        // some async problem
        // jest.spyOn(DbClient.prototype, 'findDbItem').mockResolvedValue(null);
        const user = await User.fromId(new ObjectId());
        expect(user).toBeFalsy();
    });

    test("test fromId returns a document", async () => {
        // for some reason this test causes jest to not exit properly
        // some async problem

        const user = await User.fromId(new ObjectId("123456789012345678901234"));
        console.log(user);

        await user?.addPost(postId);
        expect(user).toBeTruthy();

        await expect(user?.getBestStreak()).resolves.toEqual(20);
        expect(user?.achievements.length).toEqual(2);

        // test rating
        await expect(user?.getRatingForPost(postId)).resolves.toEqual(3.5);
        await expect(user?.getRatedPosts()).resolves.toHaveLength(1);

        // test avatar filename
        expect(user?.avatarFilename).toEqual("randomfile");
        await user?.setAvatarImageFilename("newFilename");
        expect(user?.avatarFilename).toEqual("newFilename");

        // test saved posts
        expect(user?.hasSavedPost(postId)).toBeTruthy();
        await user?.toggleSavePost(postId);
        expect(user?.hasSavedPost(postId)).toBeFalsy();
    })

});