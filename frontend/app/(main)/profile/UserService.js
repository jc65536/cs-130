export const service = backend_url => ({

  getUser: async () => {
    try {
      const response = await fetch(backend_url("/user/"), { credentials: 'include' });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch user:", error);
      return null;
    }
  },

  getUserPosts: async () => {
    try {
      const response = await fetch(backend_url("/user/posts"), { credentials: 'include' });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      return [];
    }
  },

  getUserSavedPosts: async () => {
    try {
      const response = await fetch(backend_url("/posts/saved"), { credentials: 'include' });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      return [];
    }
  },

  getBestStreak: async () => {
    try {
      const response = await fetch(backend_url("/user/bestStreak"), { credentials: 'include' });
      if (!response.ok) {
        console.error(response);
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      return [];
    }
  },

  getAvgRating: async () => {
    try {
      const response = await fetch(backend_url("/user/average"), { credentials: 'include' });
      if (!response.ok) {
        console.error(response);
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      return [];
    }
  },

})
