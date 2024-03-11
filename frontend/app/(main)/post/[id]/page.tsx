"use client";

import { useState } from "react";
import Slider from "./slider";
import "./post-details.css";
import Comments from "./comments";

export default ({ params: { id } }: { params: { id: string } }) => {
    const savePost = () => {
        // Save post logic here
    };

    return (
        <div className="post-container">
            <img src="/tango.jpg" />
            <div className="text-save-row">
                <div className="post-text-content">
                    <p>Username</p>
                    <p>Caption goes here</p>
                </div>
                <button type="button" onClick={savePost}>Save post</button>
            </div>
            <Slider id={id} />
            <Comments id={id} />
        </div>
    );
};
