import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Tag, TagLabel } from "./tag";
import { fn } from "@/app/util";
import { backend_url } from "@/app/settings";

export type TagEditorProps = {
    dotKey: number,
    tooltip: string,
    setTooltip: (s: string) => void;
    addTag: (tag: TagLabel) => (tags: Tag[]) => Tag[],
    rmTag: (tags: Tag[]) => Tag[],
    rmDot: () => void,
    closeEditor: (f: (tags: Tag[]) => Tag[]) => void,
    invalidateTag: () => void,
};

const autocompleteCache: { [key: string]: TagLabel[] } = {};

// This will fetch from backend
const fetchAutocomplete = async (frag: string) => {
    const res = (await fetch(backend_url(`/clothing/tags/${frag}`), {
        credentials: "include"
    }));

    const json: { tagName: string, tagId: string }[] = await res.json();

    return json
        .map((s, i) => ({ name: s.tagName, id: s.tagId }))
        .filter(({ name }) => name.startsWith(frag));
};

const autocomplete = async (frag: string) => {
    if (frag in autocompleteCache)
        return autocompleteCache[frag];

    const key = Object.keys(autocompleteCache).find(k => frag.startsWith(k));

    if (key !== undefined) {
        const refined = autocompleteCache[key].filter(({ name }) => name.startsWith(frag));
        autocompleteCache[frag] = refined;
        return refined;
    } else if (frag.length >= 1) {
        const fetched = await fetchAutocomplete(frag);
        autocompleteCache[frag] = fetched;
        return fetched;
    } else {
        return [];
    }
};
// autocompleteCache[frag] ?? (autocompleteCache[frag] =

export default function TagEditor(props: TagEditorProps) {
    const [completions, setCompletions] = useState<TagLabel[]>([]);

    const clickListener = useRef<(e: MouseEvent) => void>(e => {
        if (!(e.target instanceof HTMLElement))
            return;

        if (e.target.closest(".tag-editor") !== null)
            return;

        closeEditor(x => x);
    });

    const closeEditor = fn(props.closeEditor).effectBefore(_ =>
        document.removeEventListener("click", clickListener.current));

    useEffect(() => document.addEventListener("click", clickListener.current), []);

    const selectSuggestion = fn(props.addTag).pipe(closeEditor);

    const addNewTag = () =>
        closeEditor(props.addTag({ name: props.tooltip, id: -1 }));
    
    useEffect(() => {
        autocomplete(props.tooltip).then(setCompletions);
    }, [props.tooltip]);

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
