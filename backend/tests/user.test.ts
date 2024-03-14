import { convertTo24CharHex } from '../endpoints/utils';
import { User } from '../lib/user';
import { ObjectId } from 'mongodb';

describe("test User", () => {
    test("test constructor", () => {
        const id = convertTo24CharHex("randomUserId");
        console.log(id);
        const user = new User(new ObjectId(id));
        expect(user).toBeTruthy();
    });
});