import { useEffect, useRef, useState } from "react";
import { TagEditorProps } from "./tag-editor";
import { fn } from "@/app/util";

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

    const editorProps: TagEditorProps = {
        ...props,
        tooltip,
        setTooltip: (tooltip) => {
            setTooltip(tooltip);
            props.openEditor({ ...editorProps, tooltip });
        },
        addTag: tag => tags => {
            complete.current = true;
            setTag(tag);
            setTooltip(tag.name);
            return props.addTag(tag)(tags);
        },
        rmTag: tag === null ? x => x : tags => {
            complete.current = false;
            setTag(null);
            setTooltip("")
            return props.rmTag(tag)(tags);
        },
        closeEditor: fn(props.closeEditor(props.dotKey))
            .after(() => complete.current || props.rmDot()),
        invalidateTag: () => complete.current = false,
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
