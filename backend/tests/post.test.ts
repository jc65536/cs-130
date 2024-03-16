import { convertTo24CharHex } from '../endpoints/utils';
import { DbItem } from '../lib/db-lib/db-item';
import { User } from '../lib/user';
import { Post } from '../lib/post';
import { Wardrobe } from '../lib/wardrobe';
import { ObjectId } from 'mongodb';
jest.mock('../lib/db-lib/db-client');

import { DbClient, getClient } from '../lib/db-lib/db-client';

const postId = new ObjectId("123412345678901234567890");
const userId = new ObjectId(convertTo24CharHex("randomUserId"));
const wardrobeId = new ObjectId();

beforeAll(() => {
    jest.spyOn(DbItem.prototype, 'writeToDatabase').mockResolvedValue();
    jest.spyOn(Post, 'fromId').mockResolvedValue(new Post(postId));
    jest.spyOn(User, 'fromId').mockResolvedValue(new User(userId));
});

beforeEach(() => {
    jest.resetModules();
});

describe("test Posts", () => {

    test("test Post", async () => {
        const id = convertTo24CharHex("randomUserId");
        const userid = new ObjectId(id);
        const post = await Post.create(userid, "image", "caption", [], false);
        expect(post).toBeTruthy();
        await post?.setTaggedClothes([]);
        await post?.updateImageFilename("hi");
        await post?.updateCaption("cap");
        await post?.updateRating(1);
        expect(await post?.getTaggedClothes()).toEqual([]);
        expect(await post?.getImageFilename()).toEqual("hi");
        expect(await post?.getCaption()).toEqual("cap");
        expect(await post?.getRating()).toEqual(1);
        expect(await post?.getRatingCount()).toEqual(1);
        await post?.updateRatingAfterRated(1, 2);
        await post?.addComment("comment");
        expect(await post?.getRating()).toEqual(2);
        expect(await post?.getRatingCount()).toEqual(1);
        await post?.updateRatingBuckets();
        await post?.setRatingBuckets([]);
        expect(await post?.getRatingBuckets()).toEqual([]);
    });
});
