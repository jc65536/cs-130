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

    const complete = tag !== null;

    const rmTag = complete
        ? props.rmTag(tag)
        : (tags: Tag[]) => tags;

    const editorProps: TagEditorProps_ = {
        tooltip,
        setTooltip,
        addTag: tag => tags => addTag(tag)(rmTag(tags)),
        rmTag,
        rmDot: props.rmDot,
    };

    useEffect(() => props.openEditor(editorProps), []);

    useEffect(() => props.openEditor(editorProps), [tooltip])

    const tooltipElem = <div className="tooltip">{tooltip}</div>;

    const style = { left: props.x, top: props.y };

    return (
        <div className="tag" style={style}
            onClick={() => props.openEditor(editorProps)}>
            {tooltipElem}
        </div>
    );
}
