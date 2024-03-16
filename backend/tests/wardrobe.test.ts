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

describe("test Wardrobe", () => {

    test("test add Clothes", async () => {
        const id = convertTo24CharHex("randomUserId");
        const userid = new ObjectId(id);
        const wardrobe = await Wardrobe.create(userid);
        expect(wardrobe).toBeTruthy();
        const clothing = new ObjectId();
        wardrobe.addClothes(clothing);
        expect(await wardrobe.getClothes()).toEqual([clothing]);
        await wardrobe.clear();
        expect(await wardrobe.getClothes()).toEqual([]);
        expect(await wardrobe.getPosts()).toEqual([]);
    });
});
