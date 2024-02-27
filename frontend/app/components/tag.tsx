"use client"

import { useEffect, useState } from "react";
import { TagEditorProps_ } from "./tag-editor";

export type IncompleteTag = {
    id: number | null,
    name: string,
}

export type Tag = {
    id: number,
    name: string,
}

export type TagDotProps = {
    x: number,
    y: number,
    openEditor: (props: TagEditorProps_) => void,
    addTag: (tag: Tag) => (tags: Tag[]) => Tag[],
    rmTag: (tag: Tag) => (tags: Tag[]) => Tag[],
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
    };

    useEffect(() =>
        props.openEditor({
            rmTag: () => _ => [],
            ...editorProps,
        }), []);

    const tooltipElem = <div className="tooltip">{tooltip}</div>;

    if (tag === null)
        return <div className="tag">{tooltipElem}</div>

    return (
        <div className="tag" onClick={() =>
            props.openEditor({
                rmTag: () => props.rmTag(tag),
                ...editorProps,
            })}>
            {tooltipElem}
        </div>
    );
}
