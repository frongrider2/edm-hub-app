import { FormEvent, useState } from "react";
import { motion } from "framer-motion";

export type AuthMode = "login" | "register";

export interface AuthFormValues {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

interface AuthFormProps {
  mode: AuthMode;
  onSubmit: (values: AuthFormValues) => void;
  footer: React.ReactNode;
  onGoogleSignIn?: () => void;
  isLoading?: boolean;
}

function AuthForm({
  mode,
  onSubmit,
  footer,
  onGoogleSignIn,
  isLoading = false,
}: AuthFormProps): JSX.Element {
  const [values, setValues] = useState<AuthFormValues>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(values);
  };

  const isRegister = mode === "register";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">
          {isRegister ? "Create account" : "Welcome back"}
        </h2>
        <p className="text-xs text-muted-foreground">
          {isRegister
            ? "Join Muso Pulse and start building neon playlists."
            : "Sign in to continue your listening session."}
        </p>
      </div>

      {isRegister && (
        <div className="space-y-1">
          <label
            className="text-xs font-medium text-muted-foreground"
            htmlFor="name"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="neon-input"
            placeholder="Your display name"
            value={values.name}
            onChange={handleChange}
            autoComplete="name"
          />
        </div>
      )}

      <div className="space-y-1">
        <label
          className="text-xs font-medium text-muted-foreground"
          htmlFor="email"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="neon-input"
          placeholder="you@example.com"
          value={values.email}
          onChange={handleChange}
          autoComplete="email"
        />
      </div>

      <div className="space-y-1">
        <label
          className="text-xs font-medium text-muted-foreground"
          htmlFor="password"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="neon-input"
          placeholder="••••••••"
          value={values.password}
          onChange={handleChange}
          autoComplete={isRegister ? "new-password" : "current-password"}
        />
      </div>

      {isRegister && (
        <div className="space-y-1">
          <label
            className="text-xs font-medium text-muted-foreground"
            htmlFor="confirmPassword"
          >
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className="neon-input"
            placeholder="••••••••"
            value={values.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
          />
        </div>
      )}

      <motion.button
        type="submit"
        whileTap={{ scale: 0.96 }}
        disabled={isLoading}
        className="neon-button-primary flex w-full items-center justify-center gap-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>{isRegister ? "Creating account..." : "Signing in..."}</span>
          </>
        ) : (
          <span>{isRegister ? "Create account" : "Login"}</span>
        )}
      </motion.button>

      <div className="flex items-center gap-3 text-[11px] text-muted-foreground/80">
        <span className="h-px flex-1 bg-white/10" />
        <span>or</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={onGoogleSignIn}
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-white/12 bg-black/40 px-4 py-2 text-xs font-medium text-foreground shadow-[0_12px_30px_rgba(0,0,0,0.7)] transition hover:bg-black/60 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black">
          G
        </span>
        <span>
          {isRegister ? "Sign up with Google" : "Sign in with Google"}
        </span>
      </motion.button>

      <div className="pt-1 text-xs text-muted-foreground">{footer}</div>
    </form>
  );
}

export default AuthForm;
