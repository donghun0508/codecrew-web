import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import Spinner from "../../components/common/Spinner";
import useOAuthLogin from "../../hooks/useOAuthLogin";

export default function GoogleOAuthCallback() {
  const [params] = useSearchParams();
  const code = params.get("code");

  const { login } = useOAuthLogin({ provider: "GOOGLE", code });

  useEffect(() => {
    if (!code) {
      window.history.replaceState({}, "", "/");
      return;
    }

    window.history.replaceState({}, "", "/oauth2/code/google");
    login();
  }, [code, login]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <Spinner />
    </div>
  );
}
