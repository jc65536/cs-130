"use client";

import { useState } from "react";
import Slider from "./slider";
import "./post-details.css";
import Comments from "./comments";

export default ({ params: { id } }: { params: { id: string } }) => {
    const [frac, setFrac] = useState(0.5);

    const savePost = () => {
        // Save post logic here
    };

    return (
        <>
            <img src="/tango.jpg" />
            <p>
                Caption goes here
            </p>
            <Slider id={id} />
            <button type="button" onClick={savePost}>Save post</button>
            <Comments id={id} />
        </>
    );
};
