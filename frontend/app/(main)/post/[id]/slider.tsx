import { useRef, useState } from "react";

export type SliderProps = {
    id: string
};

export default (props: SliderProps) => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [frac, setFrac] = useState(0.5);

    const commitFrac = () => {
        // Send to server
    };

    const startDrag = (e0: React.MouseEvent | React.Touch) => {
        if (sliderRef.current === null)
            return;

        const bbox = sliderRef.current.getBoundingClientRect();

        const calcFrac = (x: number) => Math.min(1, Math.max(0, (x - bbox.x) / bbox.width));

        setFrac(calcFrac(e0.clientX));

        const handleDrag = (e: MouseEvent | Touch) => setFrac(calcFrac(e.clientX));

        const handleTouchDrag = (e: TouchEvent) => handleDrag(e.touches[0]);

        const endDrag = () => {
            commitFrac();
            document.removeEventListener("mousemove", handleDrag);
            document.removeEventListener("touchmove", handleTouchDrag);
        };

        const endTouchDrag = () => endDrag();

        document.addEventListener("mousemove", handleDrag);
        document.addEventListener("touchmove", handleTouchDrag);
        document.addEventListener("mouseup", endDrag, { once: true });
        document.addEventListener("touchend", endTouchDrag, { once: true });
    };

    return (
        <div className="slider"
            onMouseDown={startDrag}
            onTouchStart={e => startDrag(e.touches[0])}
            ref={sliderRef}>
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
