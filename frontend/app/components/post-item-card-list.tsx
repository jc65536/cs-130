import React from 'react';
import PostItemCard, { Post } from './post-item-card';
import '@/app/card.css';

// Dummy data for demonstration
var posts: Post[] = [];
for (let id = 1; id <= 20; id++) {
  posts.push({ id, caption: `Caption ${id}` });
}


export default function PostItemCardList() {
  return (
    <div className="post-list">
      {posts.map((post, i) => (
        // Assuming PostItemCard accepts props for id and caption
        <PostItemCard key={i} id={post.id} caption={post.caption} />
      ))}
    </div>
  );
}
