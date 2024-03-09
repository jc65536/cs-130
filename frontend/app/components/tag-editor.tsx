import { ChangeEvent, useEffect, useRef } from "react";
import { Tag } from "./tag";
import { fn } from "../util";

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

const autocompleteCache: { [key: string]: Tag[] } = {};



// This will fetch from backend
const fetchAutocomplete = (frag: string): Tag[] => {
    return [
        "apple",
        "apricot",
        "apex predator",
        "appeals court",
        "application",
        "approve",
        "appreciate",
        "group",
        "great",
        "green",
        "grant",
        "grand",
        "grade",
        "grass",
    ]
        .map((s, i) => ({ name: s, id: i }))
        .filter(({ name }) => name.startsWith(frag));
};

const autocomplete = (frag: string): Tag[] => {
    if (frag in autocompleteCache)
        return autocompleteCache[frag];

    const key = Object.keys(autocompleteCache).find(k => frag.startsWith(k));

    if (key !== undefined) {
        const refined = autocompleteCache[key].filter(({ name }) => name.startsWith(frag));
        autocompleteCache[frag] = refined;
        return refined;
    } else if (frag.length >= 2) {
        const fetched = fetchAutocomplete(frag);
        autocompleteCache[frag] = fetched;
        return fetched;
    } else {
        return [];
    }
};
// autocompleteCache[frag] ?? (autocompleteCache[frag] =

export default function TagEditor(props: TagEditorProps) {
    const clickListener = useRef<(e: MouseEvent) => void>(e => {
        if (!(e.target instanceof HTMLElement))
            return;

        if (e.target.closest(".tag-editor") !== null)
            return;

        closeEditor(x => x);
    });

    const closeEditor = fn(props.closeEditor).before(_ =>
        document.removeEventListener("click", clickListener.current));

    useEffect(() => document.addEventListener("click", clickListener.current), []);

    const selectSuggestion = fn(props.addTag).pipe(closeEditor);

    const addNewTag = () =>
        closeEditor(props.addTag({ name: props.tooltip, id: -1 }));

    const completions = autocomplete(props.tooltip);

    const suggestions = completions
        .map(tag => (
            <p className="suggestion" key={tag.id}>
                <label>
                    <input name="tag" type="radio"
                        onChange={_ => selectSuggestion(tag)} />
                    {tag.name}
                </label>
            </p>
        ));

    const addNewOption = props.tooltip.length > 0 &&
        completions.every(({ name }) => props.tooltip !== name)
        ? (
            <p className="suggestion">
                <label>
                    <input name="tag" type="radio"
                        onChange={addNewTag} />
                    Add a new tag
                </label>
            </p>
        )
        : null;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        props.invalidateTag();
        props.setTooltip(e.target.value);
    };

    return (
        <div className="tag-editor">
            <input className="tag-edit"
                value={props.tooltip}
                onChange={handleChange}></input>
            <div className="suggestions-container">
                {...suggestions}
                {addNewOption}
            </div>
            <button className="tag-rm"
                onClick={() => {
                    props.rmDot();
                    closeEditor(props.rmTag);
                }}>
                Remove tag
            </button>
        </div>
    );
}
