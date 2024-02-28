import { ChangeEvent, useEffect } from "react";
import { Tag } from "./tag";
import { fn } from "@/app/util";

export type TagEditorProps = {
    dotKey: number,
    tooltip: string,
    setTooltip: (s: string) => void;
    addTag: (tag: Tag) => (tags: Tag[]) => Tag[],
    rmTag: (tags: Tag[]) => Tag[],
    rmDot: () => void,
    closeEditor: (f: (tags: Tag[]) => Tag[]) => void,
    invalidateTag: () => void,
};

export default function TagEditor(props: TagEditorProps) {
    const closeEditor = (f: (tags: Tag[]) => Tag[]) => {
        document.removeEventListener("click", detectOutsideClick);
        return props.closeEditor(f);
    };

    // Close editor when you click anywhere else
    const detectOutsideClick = (e: MouseEvent) => {
        if (!(e.target instanceof HTMLElement))
            return;

        const editor = e.target.closest(".tag-editor");

        if (editor !== null)
            return;

        closeEditor(x => x);
    };

    useEffect(() => document.addEventListener("click", detectOutsideClick), []);

    const selectSuggestion = (tag: Tag) =>
        closeEditor(fn(props.rmTag).pipe(props.addTag(tag)));

    const getSuggestions = () => [1, 2, 3, 4]
        .map(id => {
            const name = `Tag ${id}`;
            const tag: Tag = { id, name };

            return (
                <p className="suggestion" key={id}>
                    <label>
                        <input name="tag" type="radio"
                            onChange={e => e.target.checked && selectSuggestion(tag)} />
                        {name}
                    </label>
                </p>
            );
        });

    const suggestions = getSuggestions();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        props.invalidateTag();
        props.setTooltip(e.target.value);
    };

    return (
        <form className="tag-editor">
            <input className="tag-edit"
                value={props.tooltip}
                onChange={handleChange}></input>
            <div className="suggestions-container">
                {...suggestions}
            </div>
            <button className="tag-rm" onClick={() => {
                props.rmDot();
                closeEditor(props.rmTag);
            }}>
                Remove tag
            </button>
        </form>
    );
}
