import React, { useRef, useState } from "react";
import { normalizeFieldPath, registerAccount } from "../../api/auth.api";
import type { ApiError } from "../../api/auth.api";

type Props = { onSuccess: () => void };

type FieldErrors = Partial<
  Record<"firstname" | "lastname" | "email" | "password", string>
>;

function mapFieldErrors(error: ApiError): FieldErrors {
  const out: FieldErrors = {};
  if (!error?.details) return out;

  for (const d of error.details) {
    const field = normalizeFieldPath(d.path);

    if (
      field === "firstname" ||
      field === "lastname" ||
      field === "email" ||
      field === "password"
    ) {
      out[field] = d.message;
    }
  }
  return out;
}

export function SignUpForm({ onSuccess }: Props) {
  const firstNameRef = useRef<HTMLInputElement>(null);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
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
      await registerAccount({ firstname, lastname, email, password });

      onSuccess();
    } catch (err) {
      const apiError = err as ApiError;

      setFieldErrors(mapFieldErrors(apiError));

      setFormError(apiError.message ?? "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={submit} noValidate>
      <h2 className="auth-title">Sign up</h2>

      <label className="auth-label">
        First name
        <input
          ref={firstNameRef}
          className={'auth-input ${fieldErrors.firstname ? "is-error" : ""}'}
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          required
          minLength={2}
        />
        {fieldErrors.firstname && (
          <p className="auth-error">{fieldErrors.firstname}</p>
        )}
      </label>

      <label className="auth-label">
        Last name
        <input
          className={'auth-input ${fieldErrors.lastname ? "is-error" : ""}'}
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          required
          minLength={2}
        />
        {fieldErrors.lastname && (
          <p className="auth-error">{fieldErrors.lastname}</p>
        )}
      </label>

      <label className="auth-label">
        Email
        <input
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
          minLength={8}
        />
        {fieldErrors.password && (
          <p className="auth-error">{fieldErrors.password}</p>
        )}
      </label>
      {formError && <p className="auth-error auth-error--form">{formError}</p>}

      <button type="button" className="auth-primary" disabled={loading}>
        {loading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
