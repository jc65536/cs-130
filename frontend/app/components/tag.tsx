import { useEffect, useState } from "react";
import { TagEditorProps_ } from "./tag-editor";

export type IncompleteTag = {
    id: number | null,
    name: string,
};

export type Tag = {
    id: number,
    name: string,
};

export type TagDotProps_ = {
    openEditor: (props: TagEditorProps_) => void,
    addTag: (tag: Tag) => (tags: Tag[]) => Tag[],
    rmTag: (tag: Tag) => (tags: Tag[]) => Tag[],
}

export type TagDotProps = TagDotProps_ & {
    x: number,
    y: number,
    rmDot: () => void,
};

export default function TagDot(props: TagDotProps) {
    const [tag, setTag] = useState<Tag | null>(null);

    const [tooltip, setTooltip] = useState("");

    const addTag = (tag: Tag) => {
        setTag(tag);
        setTooltip(tag.name);
        return props.addTag(tag);
    };

    const editorProps = {
        complete: tag !== null,
        tooltip,
        setTooltip,
        addTag,
        rmDot: props.rmDot,
    };

    useEffect(() =>
        props.openEditor({
            rmTag: () => _ => [],
            ...editorProps,
        }), []);

    const tooltipElem = <div className="tooltip">{tooltip}</div>;

    const style = { left: props.x, top: props.y };

    if (tag === null)
        return <div className="tag" style={style}>{tooltipElem}</div>

    return (
        <div className="tag" style={style} onClick={() =>
            props.openEditor({
                rmTag: () => props.rmTag(tag),
                ...editorProps,
            })}>
            {tooltipElem}
        </div>
    );
}
