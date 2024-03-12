"use client";

import React, { MouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MdOutlineBookmarkAdd, MdOutlineBookmarkAdded } from "react-icons/md";
import { Tag } from '../(main)/post/new/tag';
import { backend_url } from '../settings';
import SaveButton from './save-button';
import Username from './username';

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
    // Assume the detail page route is '/posts/[id]', where [id] is a dynamic segment
    // const detailPagePath = `/posts/${id}`;

    const handleRatePost = async () => {
        try {
            const response = await fetch(
                backend_url(`/posts/${post.id}/rating`),
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        rating: 5,
                    }),
                }
            );
        } catch (err) {
            console.error("The error is: " + err);
        }
    }
    return (
        <div className="card">
            <Username id={post.id} userObjectId={post.userObjectId} />
            <Link href={`/post/${post.id}`}>
                <img src={backend_url(`/posts/image/${post.imageFilename}`)}
                    alt={post.caption}
                    width={120}
                    height={160}
                    loading="lazy" />
            </Link>
            <div className="card-body">
                <p className="caption">{post.caption}</p>
                <button className="rate-button" onClick={handleRatePost}>
                    Rate
                </button>
                <SaveButton id={post.id} saved={post.saved} />
            </div>
        </div>
    );
}
