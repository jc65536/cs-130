"use client";

import React, { useEffect, useState, useRef } from 'react';
import styles from './UserProfile.module.css';
import { backend_url } from "@/app/settings";
import { FaFire, FaHeart } from "react-icons/fa6";
import { getUser, getUserPosts, getBestStreak, getAvgRating, getUserSavedPosts, getUserAchievements } from './UserService';
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
    const [savedPosts, setSavedPosts] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);
    const [currentStreak, setCurrentStreak] = useState(0);

    const myPostsRef = useRef<HTMLDivElement>(null);
    const mySavedPostsRef = useRef<HTMLDivElement>(null);
    const myAchieveRef = useRef<HTMLDivElement>(null);

    // const toggleNavSelected = async (e: React.MouseEvent) => {
    //     if (!(e.currentTarget instanceof HTMLElement))
    //         return;

    //     const target = e.currentTarget;
    //     document.getElementByClassname('postContainer')[e.currentTarget.value]

    //     target.classList.toggle("saved");
    // };

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
            setAverageRating(avgRatingData);

            const postsSavedData = await getUserSavedPosts();
            setSavedPosts(postsSavedData);
            console.log(userData);
            console.log(postsData);
            console.log(bestStreak);
            console.log(avgRatingData);

            const achievements = await getUserAchievements();
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
            <div className={styles.streaksBox}><FaFire /> {bestStreak} days <div>Average Rating: {averageRating.toFixed(1)}</div></div>

            <div className='post-nav-contain'>
                <div className={styles.postNav}>
                    <button value={0}><h2>Posts</h2></button>
                    <button value={1}><h2>Saved Posts</h2></button>
                    <button value={2}><h2>Achievements</h2></button>
                </div>
                <hr/>
                <div className='my-posts' ref={myPostsRef}>
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
                                        <h2>{Number((post.rating)).toFixed(1)}</h2>
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
                <div className='my-saved-posts' ref={mySavedPostsRef}>
                    <div className={styles.postsContainer}>
                    {savedPosts.map((post: any) => (
                        <Link href={`/post/${post.id}`}>
                            <div key={post.id} className={styles.postCard}>
                                <div>
                                    <img src={backend_url(`/posts/image/${post.imageFilename}`)} alt="Post" className={styles.postImage} />
                                </div>
                                <div className={styles.postContent}>
                                    <div className={styles.postContentTop}>
                                        <p>{new Date(post.date).toLocaleDateString()}</p>
                                        <h2>{Number((post.rating)).toFixed(1)}</h2>
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
                <div className='my-achievements' ref={myAchieveRef}>
                    {achievements.map((achieve: any) => {
                        <div></div>
                    })
                    }
                </div>
            </div>
        </div>
    );
};
