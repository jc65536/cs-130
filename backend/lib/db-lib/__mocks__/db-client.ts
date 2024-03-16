import { ObjectId } from "mongodb";

export const getClient = jest.fn(() => {
  return {
    findDbItem: jest.fn((_, id) => {
      console.log("mock findDbItem called: " + id)
      const userId = new ObjectId("123456789012345678901234");
      const wardrobeId = new ObjectId("098765432112345678901234");
      const postId = new ObjectId("123412345678901234567890");
      if (id.equals(userId)) {
        return {
          _id: userId,
          posts: [postId], // the ids of the Post objects
          wardrobe: wardrobeId,
          name: "testuser",
          followers: 5,
          streaks: 10,
          bestStreak: 20,
          savedPosts: [postId],
          achievements: [],
          ratedPosts: [{ postId: postId, rating: 3.5 }],
          avatarFilename: 'randomfile',
        };
      } else if (id.equals(wardrobeId)) {
        return {
          _id: wardrobeId,
          posts: [postId],
          clothes: [postId],
          userObjectId: userId,
        };
      } else {
        return null;
      }
    }),
  }
});