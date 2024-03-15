import { convertTo24CharHex } from '../endpoints/utils';
import { DbItem } from '../lib/db-lib/db-item';
import { User } from '../lib/user';
import { ObjectId } from 'mongodb';

beforeAll(() => {
    jest.spyOn(DbItem.prototype, 'writeToDatabase').mockResolvedValue();
});

describe("test User", () => {
    test("test constructor", async () => {
        const id = convertTo24CharHex("randomUserId");
        const user = await User.create(new ObjectId(id));
        expect(user).toBeTruthy();
        console.log(user?.toJson());
    });
});