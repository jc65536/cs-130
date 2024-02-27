import Link from "next/link";

export default function NavBar() {
    return (
        <nav>
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
        </nav>
    );
}
