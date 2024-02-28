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

const autocompleteCache: { [key: string]: Tag[] } = {};



// This will fetch from backend
const fetchAutocomplete = (frag: string): Tag[] => {
    console.log("fetch called!");
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
    console.log(autocompleteCache);
    console.log(Object.keys(autocompleteCache));

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
    const closeEditor = (f: (tags: Tag[]) => Tag[]) => {
        document.removeEventListener("click", detectOutsideClick);
        return props.closeEditor(f);
    };

    const detectOutsideClick = (e: MouseEvent) => {
        if (!(e.target instanceof HTMLElement))
            return;

        if (e.target.closest(".tag-editor") !== null)
            return;

        closeEditor(x => x);
    };

    useEffect(() => document.addEventListener("click", detectOutsideClick), []);

    const selectSuggestion = (tag: Tag) =>
        closeEditor(fn(props.rmTag).pipe(props.addTag(tag)));

    const getSuggestions = () => autocomplete(props.tooltip)
        .map(tag => {
            return (
                <p className="suggestion" key={tag.id}>
                    <label>
                        <input name="tag" type="radio"
                            onChange={e => e.target.checked && selectSuggestion(tag)} />
                        {tag.name}
                    </label>
                </p>
            );
        });

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
                {...getSuggestions()}
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
