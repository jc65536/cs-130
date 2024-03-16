"use client";

import { useHostContext } from "@/app/components/host-context";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";

export default function LoginButton() {
    const backend_url = useHostContext();
    const router = useRouter();

    const handleLogin = (res: CredentialResponse) => {
        const credential = res.credential;
        console.log(credential);
        fetch(backend_url("/login"), {
            method: "POST",
            headers: { "Authorization": `Bearer ${credential}` },
            credentials: "include",
        }).then(_ => router.push("/"));
    };

    return (
        <GoogleLogin onSuccess={handleLogin}></GoogleLogin>
    );
}
