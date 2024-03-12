
import "./components.css";
import { backend_url } from "../settings";

export type UsernameProps = {
    id: string,
    userObjectId: string,
};

export default (props: UsernameProps) => {
    console.log(props)
    const toggleRedirect = async (e: React.MouseEvent) => {
        if (!(e.currentTarget instanceof HTMLElement))
            return;

        // const target = e.currentTarget;

        await fetch(backend_url(`/posts/${props.id}/toggleSave`), {
            method: "POST",
            credentials: "include"
        });
    };

    return (
        <div className='username-contain'>
            <img src='/tango.jpg' alt='user' onClick={toggleRedirect}></img>
            <h4 className='card-username' onClick={toggleRedirect}>Username</h4>
        </div>
    );
}
