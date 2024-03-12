
import "./components.css";
import { backend_url } from "../settings";
import Link from 'next/link';
import { PropsWithChildren, useContext, useEffect, useState } from "react";

export type UsernameProps = {
    id: string,
    userObjectId: string,
};

export default (props: UsernameProps) => {
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
