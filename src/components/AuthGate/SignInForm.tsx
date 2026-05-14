type Props = { onSuccess: () => void };

export function SignInForm({ onSuccess }: Props) {
  return (
    <form className="auth-form">
      <h2 className="auth-title">Sign in</h2>

      <label>
        Email
        <input type="email" required />
      </label>

      <label>
        Password
        <input type="password" required />
      </label>

      <button type="button" className="auth-primary" onClick={onSuccess}>
        Sign in
      </button>
    </form>
  );
}
