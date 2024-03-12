import { GoogleOAuthProvider } from "@react-oauth/google";
import { OAUTH_CLIENT_ID, backend_url } from "@/app/settings";
import LoginButton from "./login-button";

export default function Login() {
  return (
    <main>
      <h1 id="title">
        <span className="o1">O</span>
        <span className="o2">O</span>
        <span className="t">T</span>
        <span className="d">D</span>
      </h1>

      <GoogleOAuthProvider clientId={OAUTH_CLIENT_ID}>
        <LoginButton postUrl={backend_url("/login")} />
      </GoogleOAuthProvider>
    </main>
  );
}
