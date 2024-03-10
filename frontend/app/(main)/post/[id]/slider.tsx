import { useRef, useState } from "react";

export type SliderProps = {
    id: string
};

export default (props: SliderProps) => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [frac, setFrac] = useState(0.5);

    const commitFrac = (x: number) => {
        // Also send to server
        setFrac(x);
    };

    const startDrag = (e0: React.MouseEvent) => {
        if (sliderRef.current === null)
            return;

        const bbox = sliderRef.current.getBoundingClientRect();

        const calcFrac = (x: number) => Math.min(1, Math.max(0, (x - bbox.x) / bbox.width));

        setFrac(calcFrac(e0.clientX));

        const handleDrag = (e: MouseEvent) => setFrac(calcFrac(e.x));

        const endDrag = (e: MouseEvent) => {
            commitFrac(calcFrac(e.x));
            document.removeEventListener("mousemove", handleDrag);
        };

        document.addEventListener("mousemove", handleDrag);
        document.addEventListener("mouseup", endDrag, { once: true });
    };

    return (
        <div className="slider" onMouseDown={startDrag} ref={sliderRef}>
            <div className="fill" style={{ width: `${frac * 100}%` }}></div>
            <div className="heart-container">
                <div className="heart-border">
                    <div className="heart"></div>
                </div>
                <div className="heart-border">
                    <div className="heart"></div>
                </div>
                <div className="heart-border">
                    <div className="heart"></div>
                </div>
                <div className="heart-border">
                    <div className="heart"></div>
                </div>
                <div className="heart-border">
                    <div className="heart"></div>
                </div>
            </div>
        </div>
    )
};
