"use client";

import { useState } from "react";
import Slider from "./components/slider";
import "./post-details.css";

export default ({ params: { id } }: { params: { id: string } }) => {
    const [frac, setFrac] = useState(0.5);

    return (
        <main>
            <img src="/tango.jpg" />
            <p>
                Caption goes here
            </p>
            <Slider frac={frac} setFrac={setFrac} />
        </main>
    );
};
