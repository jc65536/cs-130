"use client";

import React, { useEffect, useState } from 'react';
import styles from '../UserProfile.module.css';
import { FaFire } from "react-icons/fa6";
import { MdOutlineSettings } from "react-icons/md";
import Link from "next/link";

import "@/app/(main)/post/new/new-post.css";
import { useHostContext } from '@/app/components/host-context';

const testUser = {
    name: "Joe Bruin",
    avatar: "https://via.placeholder.com/150", // Placeholder image URL
    followers: 237,
    streaks: 10,
    posts: [
        { id: 1, caption: "Post 1", likes: 100 },
        { id: 2, caption: "Post 2", likes: 68 },
    ],
};

export default ({ params: { id } }: { params: { id: string } }) => {
    const backend_url = useHostContext();
    const [user, setUser] = useState(testUser);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch(backend_url(`/user/${id}`), { credentials: "include" })
            .then(async res => {
                const res_json = await res.json();
                console.log(res_json);
                setUser(res_json);
            });
        fetch(backend_url(`/user/posts/${id}`), { credentials: "include" })
            .then(async res => {
                const res_json = await res.json();
                console.log(res_json);
                setPosts(res_json);
            });
    }, []);


    return (
        <div style={{ textAlign: 'center' }}>
            <Link href="/setting" style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000, color: 'black' }}>
                <MdOutlineSettings />
            </Link>
            <img src={user.avatar} alt="User Avatar" className={styles.avatar} />
            <h1 className={styles.userName}>{user.name}</h1>
            <div className={styles.followersContainer}>
                <div className={styles.followers}>{user.followers} followers</div>
                <button className={styles.followButton}>Follow</button>
            </div>
            <div className={styles.streaksBox}><FaFire /> {user.streaks} days</div>

            <h2>Posts</h2>
            <div className={styles.postsContainer}>
                {posts.map((post: any, i) => (
                    <Link key={i} href={`/post/${post.id}`}>
                        <div key={post.id} className={styles.postCard}>
                            <div>
                                <img src={backend_url(`/posts/image/${post.imageFilename}`)} alt="Post" className={styles.postImage} />
                            </div>
                            <div className={styles.postContent}>
                                <h3>{post.caption}</h3>
                                <p>{new Date(post.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};
