import { ChangeEvent, useEffect, useRef } from "react";
import { Tag } from "./tag";

export type TagEditorProps = {
    dotKey: number,
    tooltip: string,
    setTooltip: (s: string) => void;
    addTag: (tag: Tag) => (tags: Tag[]) => Tag[],
    rmTag: (tags: Tag[]) => Tag[],
    rmDot: () => void,
    closeEditor: (f: (tags: Tag[]) => Tag[]) => void,
    invalidate: () => void,
};

export default function TagEditor(props: TagEditorProps) {
    // Close editor when you click anywhere else
    useEffect(() => {
        const detectOutsideClick = (e: MouseEvent) => {
            if (!(e.target instanceof HTMLElement))
                return;

            const editor = e.target.closest(".tag-editor");

            if (editor !== null) {
                console.log("inside click");
                return;
            }

            console.log("outside click");

            props.closeEditor(x => x);

            document.removeEventListener("click", detectOutsideClick);
        };

        document.addEventListener("click", detectOutsideClick);
    }, []);

    const selectSuggestion = (tag: Tag) =>
        props.closeEditor(tags => props.addTag(tag)(props.rmTag(tags)));

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
        props.invalidate();
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
                props.closeEditor(props.rmTag);
            }}>
                Remove tag
            </button>
        </form>
    );
}
