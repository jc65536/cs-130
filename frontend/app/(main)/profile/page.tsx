"use client";

import React from 'react';
import styles from './UserProfile.module.css';

// Dummy data for demonstration
const user = {
    name: "Joe Bruin",
    avatar: "https://via.placeholder.com/150", // Placeholder image URL
    followers: 237,
    streaks: 10,
    posts: [
      { id: 1, title: "Post 1", likes: 100 },
      { id: 2, title: "Post 2", likes: 68 },
    ],
  };

export default function Home() {
    return (
        <div style={{ textAlign: 'center' }}>
        <img src={user.avatar} alt="User Avatar" className={styles.avatar} />
        <h1 className={styles.userName}>{user.name}</h1>
        <div className={styles.followersContainer}>
            <div className={styles.followers}>{user.followers} followers</div>
            <button className={styles.followButton}>Follow</button>
        </div>
        <div className={styles.streaksBox}>Streaks: {user.streaks} days</div>
        
        <h2>Posts</h2>
        <div className={styles.postsContainer}>
        {user.posts.map((post) => (
            <div key={post.id} className={styles.postCard}>
                <div>
                    <img src="/tango.jpg" alt="Post" className={styles.postImage} />
                </div>
                <div className={styles.postContent}>
                    <h3>{post.title}</h3>
                    <p>{post.likes} likes</p>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
};
