import { HostContext, useHostContext } from "@/app/components/host-context";
import { useRef, useState, useEffect, useContext } from "react";

export type SliderProps = {
    id: string
    rating: number
};

export default (props: SliderProps) => {
    const backend_url = useHostContext();
    const sliderRef = useRef<HTMLDivElement>(null);
    const [frac, setFrac] = useState(props.rating / 5);

    useEffect(() => {
        setFrac(props.rating / 5);
    }, [props.rating]);

    const commitFrac = async (x: number) => {
        try {
            const response = await fetch(
                backend_url(`/posts/${props.id}/rating`),
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        rating: x * 5,
                    }),
                }
            );
        } catch (err) {
            console.error("The error is: " + err);
        }
    };

    const startDrag = (e0: React.MouseEvent | React.Touch) => {
        if (sliderRef.current === null)
            return;

        const bbox = sliderRef.current.getBoundingClientRect();

        const calcFrac = (x: number) => Math.min(1, Math.max(0, (x - bbox.x) / bbox.width));

        setFrac(calcFrac(e0.clientX));

        const handleDrag = (e: MouseEvent | Touch) => setFrac(calcFrac(e.clientX));

        const handleTouchDrag = (e: TouchEvent) => handleDrag(e.touches[0]);

        const endDrag = (e: MouseEvent | Touch) => {
            commitFrac(calcFrac(e.clientX));
            document.removeEventListener("mousemove", handleDrag);
            document.removeEventListener("touchmove", handleTouchDrag);
        };

        const endTouchDrag = (e: TouchEvent) => endDrag(e.touches[0]);

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
