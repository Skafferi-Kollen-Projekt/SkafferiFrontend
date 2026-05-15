import { useEffect, useState } from "react";
import "./AuthGate.css";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

type AuthGateProps = {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: () => void; // ✅ rätt namn
};

export function AuthGate({ open, onClose, onLoginSuccess }: AuthGateProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    if (!open) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="authgate-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="authgate-card">
        <button className="authgate-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        {mode === "signin" ? (
          <SignInForm
            onSuccess={() => {
              onLoginSuccess();
              onClose();
            }}
          />
        ) : (
          <SignUpForm onSuccess={() => setMode("signin")} />
        )}

        <div className="authgate-switch">
          {mode === "signin" ? (
            <>
              <span>Don’t have an account?</span>
              <button onClick={() => setMode("signup")}>Sign up</button>
            </>
          ) : (
            <>
              <span>Already have an account?</span>
              <button onClick={() => setMode("signin")}>Sign in</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
