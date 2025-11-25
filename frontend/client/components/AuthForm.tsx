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
}

function AuthForm({
  mode,
  onSubmit,
  footer,
  onGoogleSignIn,
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
        className="neon-button-primary flex w-full items-center justify-center text-sm"
      >
        {isRegister ? "Create account" : "Login"}
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
        className="flex w-full items-center justify-center gap-2 rounded-full border border-white/12 bg-black/40 px-4 py-2 text-xs font-medium text-foreground shadow-[0_12px_30px_rgba(0,0,0,0.7)] transition hover:bg-black/60"
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
