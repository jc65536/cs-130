import { useEffect, useRef, useState } from "react";
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
    closeEditor: (dotKey: number) => (f: (tags: Tag[]) => Tag[]) => void,
}

export type TagDotProps = TagDotProps_ & {
    dotKey: number,
    x: number,
    y: number,
    rmDot: () => void,
};

export default function TagDot(props: TagDotProps) {
    const complete = useRef(false);

    const [tag, setTag] = useState<Tag | null>(null);

    const [tooltip, setTooltip] = useState("");

    const addTag = (tag: Tag) => {
        complete.current = true;
        setTag(tag);
        setTooltip(tag.name);
        return props.addTag(tag);
    };

    const rmTag = tag === null
        ? (tags: Tag[]) => tags
        : props.rmTag(tag);

    const closeEditor = (f: (tags: Tag[]) => Tag[]) => props.closeEditor(props.dotKey)(tags => {
        const ret = f(tags);
        if (!complete.current)
            props.rmDot();
        return ret;
    });

    const editorProps: TagEditorProps = {
        ...props,
        tooltip,
        setTooltip: (tooltip) => {
            setTooltip(tooltip);
            props.openEditor({ ...editorProps, tooltip });
        },
        addTag,
        rmTag,
        closeEditor,
        invalidate: () => complete.current = false,
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
