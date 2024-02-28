import { useEffect, useState } from "react";
import { TagEditorProps } from "./tag-editor";

export type IncompleteTag = {
    id: number | null,
    name: string,
};

export type Tag = {
    id: number,
    name: string,
};

export type TagDotProps_ = {
    openEditor: (props: TagEditorProps) => void,
    addTag: (tag: Tag) => (tags: Tag[]) => Tag[],
    rmTag: (tag: Tag) => (tags: Tag[]) => Tag[],
    closeEditor: (f: (tags: Tag[]) => Tag[]) => void,
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

    const editorProps: TagEditorProps = {
        ...props,
        tooltip,
        setTooltip: (tooltip) => {
            setTooltip(tooltip);
            props.openEditor({ ...editorProps, tooltip });
        },
        addTag,
        rmTag,
    };

    useEffect(() => props.openEditor(editorProps), []);

    const tooltipElem = <div className="tooltip">{tooltip}</div>;

    const style = { left: props.x, top: props.y };

    return (
        <div className="tag" style={style}
            onClick={() => props.openEditor(editorProps)}>
            {tooltipElem}
        </div>
    );
}
