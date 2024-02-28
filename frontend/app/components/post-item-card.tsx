import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../card.module.css';

export type Post = {
    id: number,
    caption: string,
}

// export default function PostItemCard = ({ id, caption }) => {
export default function PostItemCard({ id, caption }: Post) {
    // const [isLiked, setIsLiked] = useState(false);

    // const toggleLike = () => {
    //     setIsLiked(!isLiked);
    // };

    // Assume the detail page route is '/posts/[id]', where [id] is a dynamic segment
    // const detailPagePath = `/posts/${id}`;
    const detailPagePath = `/posts/1`;

    return (
        <div className={styles.card}>
        <figure>
            <Link href="/posts">
                <Image
                // src={`https://picsum.photos/seed/${id}/120/160`}
                src={`https://picsum.photos/id/${id}/120/160`}
                alt={caption}
                width={120}
                height={160}
                />
            </Link>
        </figure>
        <div className={styles.cardbody}>
            <p className={styles.caption}>{caption}</p>
            <button className={`${styles.likeButton}`}>
                Like
            </button>
        </div>
        </div>
    );
}
