import { backend_url } from "@/app/settings";


export const getUser = async () => {
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
};

export const getUserPosts = async () => {
  try {
    const response = await fetch(backend_url("/posts"), { credentials: 'include' });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
};

export const getBestStreak = async () => {
  try {
    const response = await fetch(backend_url("/bestStreak"), { credentials: 'include' });
    if (!response.ok) {
        console.error(response);
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
};
