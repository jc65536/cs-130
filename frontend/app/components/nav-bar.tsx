import Link from "next/link";
import styles from '../../style/nav.module.css';

export default function NavBar() {
    return (
        <div className={styles.nav}>
            <Link href="/">
                <button className="home">
                    <img src="home-nav-icon.svg" />
                </button>
            </Link>
            <Link href="/post">
                <button className="post">
                    <img src="post-nav-icon.svg" />
                </button>
            </Link>
            <Link href="/wardrobe">
                <button className="wardrobe">
                    <img src="wardrobe-nav-icon.svg" />
                </button>
            </Link>
            <Link href="profile">
                <button className="user">
                    <img src="user-nav-icon.svg" />
                </button>
            </Link>
        </div>
    );
}
