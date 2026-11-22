import "./LoginPage.scss";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useNavigate, useSearchParams } from "react-router";
import { authSchema } from "../schemas/authSchema";
import type { LoginInput } from "../schemas/authSchema";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const [error, setError] = useState("");
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const target = params.get("next") ?? "/tasks";
  const next =
    target.startsWith("/") &&
    !target.startsWith("//") &&
    !target.includes("\\") &&
    !target.startsWith("/login")
      ? target
      : "/tasks";
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(authSchema),
    defaultValues: { username: "", password: "" },
  });

  if (isAuthenticated) return <Navigate to={next} replace />;

  async function submit(data: LoginInput) {
    setError("");
    try {
      await login(data.username, data.password);
      navigate(next, { replace: true });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не вдалося увійти.");
    }
  }

  return (
    <section className="login">
      <h1>Вхід</h1>
      <form
        className="task-form__fields"
        noValidate
        onSubmit={handleSubmit(submit)}
      >
        <label className="task-form__field">
          Ім’я користувача
          <input
            className="task-form__input"
            autoComplete="username"
            disabled={isSubmitting}
            {...register("username")}
          />
          {errors.username && (
            <span role="alert" className="task-form__error">
              {errors.username.message}
            </span>
          )}
        </label>
        <label className="task-form__field">
          Пароль
          <input
            className="task-form__input"
            type="password"
            autoComplete="current-password"
            disabled={isSubmitting}
            {...register("password")}
          />
          {errors.password && (
            <span role="alert" className="task-form__error">
              {errors.password.message}
            </span>
          )}
        </label>
        {error && (
          <p role="alert" className="task-form__error">
            {error}
          </p>
        )}
        <button
          className="button button--primary"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Вхід…" : "Увійти"}
        </button>
      </form>
    </section>
  );
}
