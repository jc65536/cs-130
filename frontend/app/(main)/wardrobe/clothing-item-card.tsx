"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { backend_url } from '@/app/settings';
import { Post } from '@/app/components/post-item-card';

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
            <div className='clothing-image-grid'>
                <Link href={detailPagePath}>
                    {
                        postState.map(post => 
                            <img 
                                src={backend_url(`/posts/image/${post.imageFilename}`)}
                                alt={post.caption}
                            />    
                        )
                    }
                    {/* <Image
                        // src={`https://picsum.photos/seed/${id}/120/160`}
                        src={`https://picsum.photos/id/${id}/120/160`}
                        alt={name}
                        width={140}
                        height={200}
                    /> */}
                </Link>
            </div>
            <div className='clothing-text-content'>
                <span>{name}</span>
                <span>{"Number of outfits used in: " + reusedCount}</span>
            </div>
        </div>
    );
}
