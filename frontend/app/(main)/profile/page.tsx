"use client";

import React, { useEffect, useState } from 'react';
import styles from './UserProfile.module.css';
import { backend_url } from "@/app/settings";
import { FaFire, FaHeart } from "react-icons/fa6";
import { getUser, getUserPosts, getBestStreak, getAvgRating } from './UserService';
import { MdOutlineSettings } from "react-icons/md";
import Link from "next/link";


// Dummy data for demonstration
const testUser = {
    name: "Joe Bruin",
    avatar: "https://via.placeholder.com/150", // Placeholder image URL
    followers: 237,
    streaks: 10,
    bestStreak: 10,
    posts: [
      { id: 1, caption: "Post 1", likes: 100 },
      { id: 2, caption: "Post 2", likes: 68 },
    ],
  };

export default function Home() {
    const [user, setUser] = useState(testUser);
    const [posts, setPosts] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [avgRating, setAvgRating] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
          const userData = await getUser();
          if (userData) {
            if (!userData.avatar || userData.avatar === null) {
                userData.avatar = "https://api.dicebear.com/7.x/big-smile/svg";
            } 
            if ((!userData.name || userData.name === "")) {
                userData.name = "New User";
            }
            setUser(userData);

            const postsData = await getUserPosts();
            setPosts(postsData);
            setBestStreak(await getBestStreak());
            const avgRatingData = await getAvgRating();
            setAvgRating(avgRatingData);
            console.log(userData);
            console.log(postsData);
            console.log(bestStreak);
            console.log(avgRatingData);
          }
        };
        
        fetchData();
      }, []);


    return (
        <div style={{ textAlign: 'center' }} className="page-profile">
            <Link href="/setting" style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000, color:'black' }}>
                <MdOutlineSettings />
            </Link>
            <img src={user.avatar} alt="User Avatar" className={styles.avatar} />
            <h1 className={styles.userName}>{user.name}</h1>
            <div className={styles.followersContainer}>
                <div className={styles.followers}>{user.followers} followers</div>
                <button className={styles.followButton}>Follow</button>
            </div>
            <div className={styles.streaksBox}><FaFire /> {user.streaks} days</div>

            <div className='post-nav-contain'>
                <div className='post-nav'>
                    <h2>Posts</h2>
                    <h2>Saved Posts</h2>
                </div>
                <hr/>
                <div className='my-posts'>
                    <div className={styles.postsContainer}>
                    {posts.map((post: any) => (
                        <Link href={`/post/${post.id}`}>
                            <div key={post.id} className={styles.postCard}>
                                <div>
                                    <img src={backend_url(`/posts/image/${post.imageFilename}`)} alt="Post" className={styles.postImage} />
                                </div>
                                <div className={styles.postContent}>
                                    <div className={styles.postContentTop}>
                                        <p>{new Date(post.date).toLocaleDateString()}</p>
                                        <h2>{Number((post.rating).toFixed(1))}</h2>
                                    </div>
                                    <div className={styles.postContentBottom}>
                                        <p>{post.caption}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                        ))}
                    </div>
                </div>
                <div className='my-saved-posts'>
                    <div className={styles.postsContainer}>
                    {posts.map((post: any) => (
                        <Link href={`/post/${post.id}`}>
                            <div key={post.id} className={styles.postCard}>
                                <div>
                                    <img src={backend_url(`/posts/image/${post.imageFilename}`)} alt="Post" className={styles.postImage} />
                                </div>
                                <div className={styles.postContent}>
                                    <div className={styles.postContentTop}>
                                        <p>{new Date(post.date).toLocaleDateString()}</p>
                                        <h2>{Number((post.rating).toFixed(1))}</h2>
                                    </div>
                                    <div className={styles.postContentBottom}>
                                        <p>{post.caption}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
