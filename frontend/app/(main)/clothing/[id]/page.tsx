"use client";

import { useState } from "react";
import { IoSaveOutline } from "react-icons/io5";
import "./clothing-item-details.css"

export default ({ params: { id } }: { params: { id: string } }) => {
    const [toggle, setToggle] = useState(false);

    const toggleSale = () => {
        setToggle(!toggle);
        console.log("jskabhfdkjansd");
        document.getElementsByClassName("clothing-cost")[0].classList.toggle("onSale");
    };

    return (
        <>
            <img src="/tango.jpg" />
            <div className="detail-text-content">
                <div className="clothing-name">
                    <h4>My T-Shirt.</h4>
                </div>
                <div className="clothing-rating">
                    <h4 className="clothing-rating-label">Overall Rating</h4>
                    <p>5.0</p>
                </div>
                <div className="clothing-reusedCount">
                    <h4 className="clothing-reusedCount-label">Reused Count</h4>
                    <p>0</p>
                </div>
                <div className="clothing-sale-contain">
                    <div className="clothing-onsale">
                        <label htmlFor="onsale-switch" className="onsale-label" onChange={toggleSale}>Set On Sale</label>
                        <input type="checkbox" id="onsale-switch" className="toggle" />
                    </div>
                    <div className="clothing-cost onSale">
                        <h4 className="clothing-rating-label">Cost</h4>
                        <div className="change-cost-contain">
                            <p>$<input placeholder="5000" type="number"/></p>
                            <button className="save-cost"><IoSaveOutline /></button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
