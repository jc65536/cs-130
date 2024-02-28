import { MouseEventHandler, ReactElement, useState } from "react";
import TagDot, { TagDotProps_ } from "./tag";

export type NewPostPhotoProps = {
    imgSrc: string,
    dotProps: TagDotProps_,
};

const genKey = (() => {
    let x = 0;
    return () => x++;
})();

export default function NewPostPhoto(props: NewPostPhotoProps) {
    const [dots, setDots] = useState<ReactElement[]>([]);

    const handleClick: MouseEventHandler = e => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.x;
        const y = e.clientY - rect.y;
        const key = genKey();
        const dot = (
            <TagDot {...props.dotProps}
                key={key} dotKey={key} x={x} y={y}
                rmDot={() => setDots(dots => dots.filter(d => d !== dot))} />
        );
        setDots([dot, ...dots]);
    };

    return (
        <div className="new-post-photo">
            <img src={props.imgSrc} onClick={handleClick} />
            {...dots}
        </div>
    );
}
