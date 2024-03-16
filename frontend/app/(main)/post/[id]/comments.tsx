import { HostContext, useHostContext } from "@/app/components/host-context";
import { FormEvent, useContext, useReducer, useRef } from "react";
import { FiSend } from "react-icons/fi";

export type CommentProps = {
    id: string,
    comments: string[];
};

export default (props: CommentProps) => {
    const backend_url = useHostContext();
    const commentRef = useRef<HTMLTextAreaElement>(null);
    const [comments, addComment] = useReducer(
        (a: string[], c: string) => [...a, c],
        props.comments);

    const commentItems = comments.map((str, i) =>
        <div key={i} className={`comment ${i % 2 == 0 ? "shaded" : ""}`}>{str}</div>);

    const submitComment = (e: FormEvent) => {
        const c = commentRef.current?.value;

        if (c === undefined)
            return;

        const trimmed = c.trim();

        if (trimmed.length === 0)
            return;

        addComment(trimmed);
        // post to server here

        console.log(JSON.stringify(trimmed));

        fetch(backend_url(`/posts/${props.id}/addComment`), {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ comment: trimmed }),
        });

        e.preventDefault();
    };

    return (
        <div className="comment-section-contain">
            <form onSubmit={submitComment} className="add-comment-form">
                <textarea className="comment-box" ref={commentRef} placeholder="Add a comment..." />
                <div className="submit-button-contain">
                    <button className="submit-comment"><FiSend className="icon" /></button>
                </div>
            </form>
            <div className="comment-container">
                <p>Comments</p>
                {commentItems}
            </div>
        </div>
    );
};
