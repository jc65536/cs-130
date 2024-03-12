import PostItemCardList from "../components/post-item-card-list";
import './theme.css';

export default function Home() {
    return (
        <>
            <div className="ootd-header">
                <h2>OOTD</h2>
            </div>
            <hr></hr>
            <div className="theme-of-day-contain">
                <div className="theme-text-contain">
                    <h4 className="theme-header">Theme of the Day:</h4>
                    <h5 className="theme-header">k-Pop Idol</h5>
                </div>
                <div className="themed-posts-contain">
                    <div className="themed-post">
                        <img src="/t1.png" alt="Post"></img>
                        <p>Tzuyu</p>
                    </div>
                    <div className="themed-post">
                        <img src="/k1.png" alt="Post"></img>
                        <p>Karina</p>
                    </div>
                    <div className="themed-post">
                        <img src="/b1.png" alt="Post"></img>
                        <p>Lisa</p>
                    </div>
                    <div className="themed-post">
                        <img src="/b2.png" alt="Post"></img>
                        <p>Jisoo</p>
                    </div>
                    <div className="themed-post">
                        <img src="/b3.png" alt="Post"></img>
                        <p>Jennie</p>
                    </div>
                    <div className="themed-post">
                        <img src="/b4.png" alt="Post"></img>
                        <p>Rose</p>
                    </div>
                </div>
            </div>
            <PostItemCardList></PostItemCardList>
        </>
    );
}
