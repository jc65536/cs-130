import { MdOutlineBookmarkAdd, MdOutlineBookmarkAdded } from "react-icons/md";
import "./components.css";

export default () => {
    const toggleSaved = (e: React.MouseEvent) => {
        if (!(e.currentTarget instanceof HTMLElement))
            return;

        e.currentTarget.classList.toggle("saved");
    };

    return (
        <button className="save-button" onClick={toggleSaved}>
            <MdOutlineBookmarkAdd className="save icon" />
            <MdOutlineBookmarkAdded className="unsave icon" />
        </button>
    );
}
