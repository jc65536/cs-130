import { useEffect } from "react";
import { Tag, IncompleteTag } from "./tag";

export type TagEditorProps_ = {
    complete: boolean,
    tooltip: string,
    setTooltip: (s: string) => void;
    addTag: (tag: Tag) => (tags: Tag[]) => Tag[],
    rmTag: () => (tags: Tag[]) => Tag[],
    rmDot: () => void,
}

export type TagEditorProps = TagEditorProps_ & {
    closeEditor: (f: (tags: Tag[]) => Tag[]) => void,
};

export default function TagEditor(props: TagEditorProps) {
    const selectSuggestion = (tag: Tag) => () =>
        props.closeEditor(tags => props.addTag(tag)(
            props.complete ? tags : props.rmTag()(tags)
        ));

    const getSuggestions = () => [1, 2, 3, 4]
        .map(id => {
            const name = `Tag ${id}`;
            const tag: Tag = { id, name };

            return <p className="suggestion"
                onClick={selectSuggestion(tag)}
                key={id}>{name}</p>
        });

    const suggestions = getSuggestions();

    return (
        <div>
            <input className="tag-edit"
                defaultValue={props.tooltip}
                onChange={e => props.setTooltip(e.target.value)}></input>
            <div className="suggestions-container">
                {...suggestions}
            </div>
            <button className="tag-rm" onClick={() => {
                props.rmDot();
                props.closeEditor(props.rmTag());
            }}>
                Remove tag
            </button>
        </div>
    );
}
