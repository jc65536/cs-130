import { useRef } from "react";

export default ({ frac, setFrac }: { frac: number, setFrac: (_: number) => void }) => {
    const sliderRef = useRef<HTMLDivElement>(null);

    const startDrag = (e0: React.MouseEvent<HTMLDivElement>) => {
        if (sliderRef.current === null)
            return;

        const bbox = sliderRef.current.getBoundingClientRect();

        const calcFrac = (x: number) => Math.min(1, Math.max(0, (x - bbox.x) / bbox.width));

        setFrac(calcFrac(e0.clientX));

        const handleDrag = (e: MouseEvent) => setFrac(calcFrac(e.x));

        const endDrag = (e: MouseEvent) => {
            setFrac(calcFrac(e.x));
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
