// Only import this in server side components

const BACKEND_HOST = process.env["BACKEND_HOST"] || process.exit(1);

export const backend_url = (path: string) => BACKEND_HOST + path;

export const OAUTH_CLIENT_ID = "121044225700-6gotpenj58iao2fo2qkm573h11c7hbof.apps.googleusercontent.com";
