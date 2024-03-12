"use client";

import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";

export default function LoginButton(props: { postUrl: string }) {
    const router = useRouter();

    const handleLogin = (res: CredentialResponse) => {
        const credential = res.credential;
        console.log(credential);
        fetch(props.postUrl, {
            method: "POST",
            headers: { "Authorization": `Bearer ${credential}` },
            credentials: "include",
        }).then(_ => router.push("/"));
    };

    return (
        <GoogleLogin onSuccess={handleLogin}></GoogleLogin>
    );
}
