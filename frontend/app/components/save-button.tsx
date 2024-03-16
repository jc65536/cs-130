import { MdOutlineBookmarkAdd, MdOutlineBookmarkAdded } from "react-icons/md";
import "./components.css";
import { useHostContext } from "./host-context";

export type SaveButtonProps = {
    id: string,
    saved: boolean,
};

export default (props: SaveButtonProps) => {
    const backend_url = useHostContext();

    const toggleSaved = async (e: React.MouseEvent) => {
        if (!(e.currentTarget instanceof HTMLElement))
            return;

        const target = e.currentTarget;

        await fetch(backend_url(`/posts/${props.id}/toggleSave`), {
            method: "POST",
            credentials: "include"
        });

        target.classList.toggle("saved");
    };

    const initialSaved = props.saved ? "saved" : "";

    return (
        <button className={`save-button ${initialSaved}`} onClick={toggleSaved}>
            <MdOutlineBookmarkAdd className="save icon" />
            <MdOutlineBookmarkAdded className="unsave icon" />
        </button>
    );
}
