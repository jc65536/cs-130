import { useEffect, useRef, useState } from "react";
import { fn } from "@/app/util";

export type TagDisplayProps = {
    name: string,
    x: number,
    y: number,
};

export default function TagDisplay(props: TagDisplayProps) {
    return (
        <div className="tag" style={{ left: props.x, top: props.y }}>
            <div className="tooltip">{props.name}</div>
        </div>
    );
}
