"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Post } from '@/app/components/post-item-card';
import { useHostContext } from '@/app/components/host-context';

export type Clothing = {
    id: number,
    name: string,
    rating: number,
    reusedCount: number,
    cost: number,
    onSale: Boolean,
    posts: string[]
}

export default function ClothingItemCard({ id, name, rating, reusedCount, cost, onSale, posts }: Clothing) {
    const backend_url = useHostContext();
    const [postState, setPosts] = useState<Post[]>([]);
    // Assume the detail page route is '/clothing/[id]', where [id] is a dynamic segment
    const detailPagePath = `/clothing/${id}`;

    // const toggleDetails = (e: MouseEvent) => {
    //     if (!(e.currentTarget instanceof HTMLElement))
    //         return;
    //     if (e.currentTarget.children) {

    //     }
    // };
    useEffect(() => {
        fetchPostFilenames();
    }, []);

    const fetchPostFilenames = async () => {
        const postObjs = await Promise.all(posts.map(async postId => {
            const res = await fetch(backend_url(`/posts/${postId}`), { credentials: "include" });
            const json = await res.json();
            return json;
        }));
        setPosts(postObjs);
    }


    return (
        <div className="clothing-card card" >
            <div className='clothing-text-content'>
                <span className="clothing-name">{name}</span>
                <span>{`Used in ${reusedCount} outfit(s)`}</span>
            </div>
            <div className='clothing-image-grid' data-size={Math.ceil(Math.sqrt(postState.length))}>
                <Link href={detailPagePath}>
                    {
                        postState.map((post, i) =>
                            <img
                                src={backend_url(`/posts/image/${post.imageFilename}`)}
                                alt={post.caption}
                                key={i}
                            />
                        )
                    }
                </Link>
            </div>
        </div>
    );
}
