type Props = { onSuccess: () => void };

export function SignUpForm({ onSuccess }: Props) {
  return (
    <form className="auth-form">
      <h2 className="auth-title">Sign up</h2>

      <label>
        First name
        <input />
      </label>

      <label>
        Last name
        <input />
      </label>

      <label>
        Email
        <input type="email" />
      </label>

      <label>
        Password
        <input type="password" />
      </label>

      <button type="button" className="auth-primary" onClick={onSuccess}>
        Create account
      </button>
    </form>
  );
}
