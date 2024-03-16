"use client";

import React, { useEffect, useState } from 'react';
import PostItemCard, { Post } from './post-item-card';
import '@/app/card.css';
import { useHostContext } from './host-context';

export default function PostItemCardList() {
  const backend_url = useHostContext();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch(backend_url(`/posts/trending`), { credentials: "include" })
      .then(res => res.json())
      .then(setPosts);
  }, []);

  return (
    <div className="post-list">
      {posts.map((post, i) => (
        // Assuming PostItemCard accepts props for id and caption
        <PostItemCard key={i} {...post} />
      ))}
    </div>
  );
}
