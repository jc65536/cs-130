"use client";

import { PropsWithChildren, createContext, useContext } from "react";

export const HostContext = createContext("this-must-not-appear");

export const useHostContext = () => {
    const host = useContext(HostContext);
    return (s: string) => host + s;
}

export function HostProvider(props: { host: string } & PropsWithChildren) {
    return <HostContext.Provider value={props.host}>
        {props.children}
    </HostContext.Provider>
}
