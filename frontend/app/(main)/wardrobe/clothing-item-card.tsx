"use client";

import React, { MouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export type Clothing = {
    id: number,
    name: string,
    rating: number
}

export default function ClothingItemCard({ id, name, rating }: Clothing) {
    // Assume the detail page route is '/clothing/[id]', where [id] is a dynamic segment
    const detailPagePath = `/clothing/${id}`;

    const toggleDetails = (e: MouseEvent) => {
        if (! (e.currentTarget instanceof HTMLElement))
            return;
        if (e.currentTarget.children) {
            
        }
    };
            

    return (
        <div className="clothing-card" onClick={toggleDetails}>
            <div className='clothing-image'>
                <Link href={detailPagePath}>
                    <Image
                        // src={`https://picsum.photos/seed/${id}/120/160`}
                        src={`https://picsum.photos/id/${id}/120/160`}
                        alt={name}
                        width={140}
                        height={200}
                    />
                </Link>
            </div>
        </div>
    );
}
