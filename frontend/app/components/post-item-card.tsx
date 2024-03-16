"use client";

import React from 'react';
import Link from 'next/link';
import { Tag } from '../(main)/post/new/tag';
import SaveButton from './save-button';
import Username from './username';
import Slider from "../(main)/post/[id]/slider";
import { useState, useEffect } from 'react';
import { useHostContext } from './host-context';

export type Post = {
    id: string,
    imageFilename: string,
    caption: string,
    rating: number,
    ratingCount: number,
    taggedClothes: Tag[],
    saved: boolean,
    comments: string[],
    userObjectId: string
};

// export default function PostItemCard = ({ id, caption }) => {
export default function PostItemCard(post: Post) {
    const backend_url = useHostContext();
    // Assume the detail page route is '/posts/[id]', where [id] is a dynamic segment
    // const detailPagePath = `/posts/${id}`;

    const [userRating, setUserRating] = useState<number>(0);

    useEffect(() => {
        const fetchUserRating = async () => {
            try {
                const response = await fetch(
                    backend_url(`/user/rating/${post.id}`),
                    { credentials: "include" }
                );
                if (response.ok) {
                    const rating = await response.json();
                    setUserRating(rating);
                } else {
                    console.error("Failed to fetch user rating");
                }
            } catch (err) {
                console.error("The error is: " + err);
            }
        };

        fetchUserRating();
    }, [post.id]);

    return (
        <div className="card">
            <Username id={post.id} userObjectId={post.userObjectId} />
            <Link href={`/post/${post.id}`}>
                <img
                    src={backend_url(`/posts/image/${post.imageFilename}`)}
                    alt={post.caption}
                    width={120}
                    height={160}
                    loading="lazy"
                />
            </Link>
            <div className="card-body">
                <p className="caption">{post.caption}</p>

                <SaveButton id={post.id} saved={post.saved} />
            </div>
            <Slider id={post.id} rating={userRating} />
        </div>
    );
}
