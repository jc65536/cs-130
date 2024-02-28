import React from 'react';
import PostItemCard, { Post } from './post-item-card';
import styles from '../card.module.css';

// Dummy data for demonstration
var posts: Post[] = [];
for (let id = 1; id <= 20; id++) {
  posts.push({ id, caption: `Caption ${id}` });
}


export default function PostItemCardList() {
  return (
    <div className={styles.postListContainer}>
      {posts.map((post, index) => (
        // Assuming PostItemCard accepts props for id and caption
        <PostItemCard id={post.id} caption={post.caption} />
      ))}
    </div>
  );
}
