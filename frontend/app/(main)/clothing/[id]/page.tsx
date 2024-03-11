"use client";

import { useState } from "react";
import "./clothing-item-details.css"

export default ({ params: { id } }: { params: { id: string } }) => {

    return (
        <>
            <img src="/tango.jpg" />
            <div className="detail-text-content">
                <div className="clothing-name">
                    Name goes here.
                </div>
                <div className="clothing-rating">
                    <div className="clothing-rating-label">Overall Rating</div>
                    5.0
                </div>
                <div className="clothing-reusedCount">
                    <div className="clothing-reusedCount-label">Reused Count</div>
                    0
                </div>
                <div className="clothing-sale-contain">
                    <div className="clothing-cost">
                        <div className="clothing-rating-label">Overall Rating</div>
                        $5.00
                    </div>
                    <div className="clothing-onsale">
                        <label htmlFor="onsale-switch" className="onsale-label">Set On Sale</label>
                        <input type="checkbox" id="onsale-switch" className="onsale" />
                    </div>
                </div>
            </div>
        </>
    );
};
