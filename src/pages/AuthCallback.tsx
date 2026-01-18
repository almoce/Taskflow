import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Parse URL for tokens from search and hash
      const url = new URL(window.location.href);
      let accessToken = url.searchParams.get("access_token");
      let refreshToken = url.searchParams.get("refresh_token");
      let type = url.searchParams.get("type");

      // If not in search, check hash for params
      if (!accessToken && url.hash) {
        const hashStr = url.hash.substring(1); // remove leading #
        const secondHashIndex = hashStr.indexOf("#");
        let paramsString = "";
        if (secondHashIndex > -1) {
          paramsString = hashStr.substring(secondHashIndex + 1);
        } else {
          paramsString = hashStr;
        }
        const hashParams = new URLSearchParams(paramsString);
        accessToken = hashParams.get("access_token");
        refreshToken = hashParams.get("refresh_token");
        type = hashParams.get("type") || type;
      }

      if (type === "recovery" && accessToken && refreshToken) {
        // Set session for password reset
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        // Redirect to reset password page
        window.location.hash = "#/reset-password";
      } else if (type === "signup") {
        // For signup, Supabase handles confirmation automatically
        // Redirect to app
        window.location.hash = "#/app";
      } else {
        // Unknown type or error, redirect to home
        window.location.hash = "#/";
      }
    };

    handleAuthCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p>Processing...</p>
      </div>
    </div>
  );
}
