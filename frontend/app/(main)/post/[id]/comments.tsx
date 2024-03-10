import { FormEvent, useReducer, useRef } from "react";

export type CommentProps = {
    id: string,
};

export default (props: CommentProps) => {
    const commentRef = useRef<HTMLInputElement>(null);
    const [comments, addComment] = useReducer(
        (a: string[], c: string) => [...a, c],
        [],
        _ => {
            // Get comments from server here
            return ["ootd", "this is my fashion", "shut up"];
        });

    const commentItems = comments.map((str, i) => <li key={i}>{str}</li>);

    const submitComment = (e: FormEvent) => {
        const c = commentRef.current?.value;

        if (c === undefined)
            return;

        const trimmed = c.trim();

        if (trimmed.length === 0)
            return;

        addComment(trimmed);
        // post to server here

        e.preventDefault();
    };

    return (
        <div>
            <ul className="comment-container">{commentItems}</ul>
            <form onSubmit={submitComment}>
                <input className="comment-box" ref={commentRef} />
                <button>Comment</button>
            </form>
        </div>
    );
};
