import React, { useRef, useState } from "react";
import { loginAccount, normalizeFieldPath } from "../../api/auth.api";
import type { ApiError } from "../../api/auth.api";

type Props = { onSuccess: () => void };

type FieldErrors = Partial<Record<"email" | "password", string>>;

function mapFieldErrors(error: ApiError): FieldErrors {
  const out: FieldErrors = {};
  if (!error?.details) return out;

  for (const d of error.details) {
    const field = normalizeFieldPath(d.path);
    if (field === "email" || field === "password") {
      out[field] = d.message;
    }
  }
  return out;
}

export function SignInForm({ onSuccess }: Props) {
  const emailRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setFormError(null);
    setLoading(true);

    try {
      await loginAccount({ email, password });
      onSuccess;
    } catch (err) {
      const apiError = err as ApiError;
      setFieldErrors(mapFieldErrors(apiError));

      setFormError(apiError.message ?? "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={submit} noValidate>
      <h2 className="auth-title">Sign in</h2>

      <label className="auth-label">
        Email
        <input
          ref={emailRef}
          className={'auth-input ${fieldErrors.email ? "is-error" : ""}'}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {fieldErrors.email && <p className="auth-error">{fieldErrors.email}</p>}
      </label>

      <label className="auth-label">
        Password
        <input
          className={'auth-input ${fieldErrors.password ? "is-error" : ""}'}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {fieldErrors.password && (
          <p className="auth-error">{fieldErrors.password}</p>
        )}
      </label>

      {formError && <p className="auth-error auth-error--form">{formError}</p>}

      <button type="button" className="auth-primary" disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
