import { ForwardedRef, MouseEventHandler, MutableRefObject, ReactElement, RefObject, forwardRef, useCallback, useEffect, useRef, useState } from "react";
import TagDot, { TagDotProps_ } from "./tag";
import { detectFace } from "@/app/img-lib";

export type NewPostPhotoProps = TagDotProps_ & {
    image: Blob,
    blur: boolean,
    imgProcessing: boolean,
    setImage: (_: Blob) => void,
    cachedImage: MutableRefObject<[Blob, boolean] | null>,
};

const genKey = (() => {
    let x = 0;
    return () => x++;
})();

export default forwardRef(function NewPostPhoto(props: NewPostPhotoProps, ref: ForwardedRef<HTMLDivElement>) {
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [dots, setDots] = useState<ReactElement[]>([]);
    const imgRef = useRef<HTMLImageElement>(null);
    const blurRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setDots([]);
        if (imgSrc !== null)
            URL.revokeObjectURL(imgSrc);

        const url = URL.createObjectURL(props.image);
        setImgSrc(url);

        return () => URL.revokeObjectURL(url);
    }, [props.image]);

    useEffect(() => {
        if (imgRef.current === null || imgSrc == null)
            return;

        const cache = props.cachedImage;

        if (props.blur) {
            if (cache.current === null || !cache.current[1]) {
                detectFace(imgRef.current, props.setImage);
            } else {
                props.setImage(cache.current[0]);
            }

            cache.current = [props.image, false];

        } else if (cache.current !== null) {

            if (!cache.current[1]) {
                props.setImage(cache.current[0]);
            }

            cache.current = [props.image, true];
        }
    }, [props.blur])

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

    if (imgSrc === null)
        return null;

    return (
        <div className="new-post-photo" ref={ref}>
            {props.imgProcessing && <img className="loading-gif" src="/loading.gif" />}
            <img src={imgSrc} onClick={handleClick} draggable={false} ref={imgRef} />
            <div className="blur" ref={blurRef}></div>
            {...dots}
        </div>
    );
});
