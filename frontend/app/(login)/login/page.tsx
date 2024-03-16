import { GoogleOAuthProvider } from "@react-oauth/google";
import { BACKEND_HOST, OAUTH_CLIENT_ID } from "@/app/settings";
import LoginButton from "./login-button";
import { HostProvider } from "@/app/components/host-context";

export default async function Login() {
  return (
    <HostProvider host={await BACKEND_HOST()}>
      <main>
        <h1 id="title">
          <span className="o1">O</span>
          <span className="o2">O</span>
          <span className="t">T</span>
          <span className="d">D</span>
        </h1>

        <GoogleOAuthProvider clientId={OAUTH_CLIENT_ID}>
          <LoginButton />
        </GoogleOAuthProvider>
      </main>
    </HostProvider>
  );
}
