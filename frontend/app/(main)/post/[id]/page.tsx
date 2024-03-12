"use client";

import { MouseEvent, useState } from "react";
import Slider from "./slider";
import "./post-details.css";
import "../../../card.css"
import Comments from "./comments";
import { MdOutlineBookmarkAdd, MdOutlineBookmarkAdded } from "react-icons/md";

export default ({ params: { id } }: { params: { id: string } }) => {
    const [frac, setFrac] = useState(0.5);

    const toggleSaved = (e: MouseEvent) => {
        if (!(e.currentTarget instanceof HTMLElement))
            return;

        e.currentTarget.classList.toggle("saved");
    };

    return (
        <div className="post-container">
            <img src="/tango.jpg" />
            <div className="post-footer">
                <p className="post-caption">
                    Caption goes here
                </p>
                <button className="like-button" onClick={toggleSaved}>
                    <MdOutlineBookmarkAdd className="save icon" />
                    <MdOutlineBookmarkAdded className="saved icon" />
                </button>
            </div>
            <h4 className="rate-text">Rate this Post.</h4>
            <Slider id={id} />
            <h2 className="rate-text">5.0</h2>
            
            <Comments id={id} />
        </div>
    );
};
