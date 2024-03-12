"use client";

import React, { MouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MdOutlineBookmarkAdd, MdOutlineBookmarkAdded } from "react-icons/md";

export type Post = {
    id: number,
    caption: string,
}

// export default function PostItemCard = ({ id, caption }) => {
export default function PostItemCard({ id, caption }: Post) {
    // Assume the detail page route is '/posts/[id]', where [id] is a dynamic segment
    // const detailPagePath = `/posts/${id}`;
    const detailPagePath = `/post/${id}`;

    const toggleSaved = (e: MouseEvent) => {
        if (!(e.currentTarget instanceof HTMLElement))
            return;

        e.currentTarget.classList.toggle("saved");
    };

    return (
        <div className="card">
            <Link href={detailPagePath}>
                <Image
                    // src={`https://picsum.photos/seed/${id}/120/160`}
                    src={`https://picsum.photos/id/${id}/480/640`}
                    alt={caption}
                    width={120}
                    height={160}
                />
            </Link>
            <div className="card-body">
                <div className="text-content">
                    <p className="username">Username</p>
                    <p className="caption">{caption}</p>
                </div>
                <button className="like-button" onClick={toggleSaved}>
                    <MdOutlineBookmarkAdd className="save icon" />
                    <MdOutlineBookmarkAdded className="saved icon" />
                </button>
            </div>
        </div>
    );
}
