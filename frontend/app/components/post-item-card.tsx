import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaHeart } from "react-icons/fa";
import { MdOutlineBookmarkAdd, MdOutlineBookmarkAdded } from "react-icons/md";
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
        <div className={styles.cardImgContain}>
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
        </div>
        <div className={styles.cardbody}>
            <div className={styles.topContain}>
                <button className={`${styles.likeButton}`}>
                    <MdOutlineBookmarkAdd className={`${styles.saveIcon}`}/>
                    <MdOutlineBookmarkAdded className={`${styles.savedIcon}`}/>
                </button>
                <p className={styles.username}>Username</p>
            </div>
            <p className={styles.caption}>{caption}</p>
        </div>
        </div>
    );
}
