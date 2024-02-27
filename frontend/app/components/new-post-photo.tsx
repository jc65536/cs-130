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
    const [dots, setTags] = useState<ReactElement[]>([]);

    const handleClick: MouseEventHandler = e => {
        const { x: xo, y: yo } = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - xo;
        const y = e.clientY - yo;
        const dot = <TagDot {...props.dotProps}
            key={genKey()} x={x} y={y}
            rmDot={() => setTags(dots.filter(t => t !== dot))} />;
        setTags([dot, ...dots]);
    };

    return (
        <div className="new-post-photo">
            <img src={props.imgSrc} onClick={handleClick} />
            {...dots}
        </div>
    );
}
