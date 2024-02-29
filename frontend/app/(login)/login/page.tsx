import { GoogleOAuthProvider } from "@react-oauth/google";
import { OAUTH_CLIENT_ID, backend_url } from "@/app/settings";
import LoginButton from "./login-button";

export default function Login() {
  return (
    <main id="homepage">
      <h1 id="title">OOTD</h1>

      <GoogleOAuthProvider clientId={OAUTH_CLIENT_ID}>
        <LoginButton postUrl={backend_url("/login")} />
      </GoogleOAuthProvider>

      <p>Some random text</p>
    </main>
  );
}
