import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Finishing sign in…");

  useEffect(() => {
    let active = true;
    const finish = async () => {
      const hashError = new URLSearchParams(window.location.hash.replace(/^#/, "")).get("error_description");
      if (hashError) {
        if (active) setMessage("Sign in could not be completed. Please try again.");
        return;
      }

      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          if (active) setMessage("Sign in could not be completed. Please try again.");
          return;
        }
      }

      const { data } = await supabase.auth.getSession();
      if (data.session) navigate({ to: "/chat", replace: true });
      else if (active) setMessage("No active session was found. Please sign in again.");
    };
    void finish();
    return () => { active = false; };
  }, [navigate]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6 text-foreground">
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
        <p>{message}</p>
      </div>
    </main>
  );
}
