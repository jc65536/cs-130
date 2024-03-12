import { ForwardedRef, MouseEventHandler, ReactElement, forwardRef, useEffect, useState } from "react";
import TagDot, { TagDotProps_ } from "./tag";

export type NewPostPhotoProps = TagDotProps_ & {
    imgSrc: string,
};

const genKey = (() => {
    let x = 0;
    return () => x++;
})();

export default forwardRef(function NewPostPhoto(props: NewPostPhotoProps, ref: ForwardedRef<HTMLImageElement>) {
    const [dots, setDots] = useState<ReactElement[]>([]);

    useEffect(() => {
        setDots([]);
    }, [props.imgSrc]);

    const handleClick: MouseEventHandler = e => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.x;
        const y = e.clientY - rect.y;
        const key = genKey();
        const dot = (
            <TagDot {...props}
                key={key} dotKey={key} x={x} y={y}
                rmDot={() => setDots(dots => dots.filter(d => d !== dot))} />
        );
        setDots([...dots, dot]);
    };

    return (
        <div className="new-post-photo" ref={ref}>
            <img src={props.imgSrc} onClick={handleClick} draggable={false} />
            {...dots}
        </div>
    );
});
