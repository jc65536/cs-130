import { useEffect, useRef, useState } from "react";
import { TagEditorProps } from "./tag-editor";
import { fn } from "@/app/util";

export type IncompleteTag = {
    id: string | -1 | null,
    name: string,
    x: number,
    y: number,
};

export type Tag = {
    id: string | -1,
    name: string,
    x: number,
    y: number,
};

export type TagLabel = {
    id: string | -1,
    name: string,
};

const isComplete = (tag: IncompleteTag): tag is Tag => tag.id !== null;

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

    const [tag, setTag] = useState<IncompleteTag>({ name: "", id: null, x: props.x, y: props.y });

    const rmTag = isComplete(tag)
        ? props.rmTag(tag)
        : (x: Tag[]) => x;

    const editorProps: TagEditorProps = {
        ...props,
        tooltip: tag.name,
        setTooltip: (tooltip) => {
            setTag({ ...tag, name: tooltip });
            props.openEditor({ ...editorProps, tooltip });
        },
        rmTag,
        addTag: fn((label: TagLabel): Tag => ({ ...label, x: props.x, y: props.y }))
            .pipe(fn(props.addTag).effectBefore(setTag))
            .pipe(fn(rmTag).pipe)
            .effectAfter(_ => complete.current = true),
        closeEditor: fn(props.closeEditor(props.dotKey))
            .effectAfter(_ => complete.current || props.rmDot()),
        invalidateTag: () => complete.current = false,
    };

    useEffect(() => props.openEditor(editorProps), []);

    const tooltip = tag.name.length > 0
        ? <div className="tooltip">{tag.name}</div>
        : null;

    return (
        <div className="tag" style={{ left: props.x, top: props.y }}
            onClick={() => props.openEditor(editorProps)}>
            {tooltip}
        </div>
    );
}
