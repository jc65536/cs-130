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

    const [tag, setTag] = useState<IncompleteTag>({ name: "", id: null });

    const editorProps: TagEditorProps = {
        ...props,
        tooltip: tag.name,
        setTooltip: (tooltip) => {
            setTag({ ...tag, name: tooltip });
            props.openEditor({ ...editorProps, tooltip });
        },
        addTag: tag => fn(props.addTag(tag)).before(_ => {
            complete.current = true;
            setTag(tag);
        }),
        rmTag: isComplete(tag)
            ? fn(props.rmTag(tag)).before(_ => {
                complete.current = false;
                setTag({ name: "", id: null });
            })
            : x => x,
        closeEditor: fn(props.closeEditor(props.dotKey))
            .after(() => complete.current || props.rmDot()),
        invalidateTag: () => complete.current = false,
    };

    useEffect(() => props.openEditor(editorProps), []);

    return (
        <div className="tag" style={{ left: props.x, top: props.y }}
            onClick={() => props.openEditor(editorProps)}>
            <div className="tooltip">{tag.name}</div>
        </div>
    );
}
