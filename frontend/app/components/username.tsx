
import "./components.css";
import Link from 'next/link';
import { useEffect, useState } from "react";
import { useHostContext } from "./host-context";

export type UsernameProps = {
    id: string,
    userObjectId: string,
};

export default (props: UsernameProps) => {
    const backend_url = useHostContext();

    const [username, setUsername] = useState('');

    useEffect(() => {
        fetch(backend_url(`/user/${props.userObjectId}`), { credentials: "include" })
            .then(async res => {
                const res_json = await res.json();
                console.log(res_json);
                setUsername(res_json.name);
            });
    }, []);

    return (
        <div className='username-contain'>
            <Link href={`/profile/${props.userObjectId}`}><img src='/tango.jpg' alt='user' className='default-user-profile'></img></Link>
            <Link href={`/profile/${props.userObjectId}`}><h4 className='card-username'>{username}</h4></Link>
        </div>
    );
}
