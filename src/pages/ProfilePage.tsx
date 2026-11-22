import "./ProfilePage.scss";
import { useCallback } from "react";
import { Navigate, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useRequest } from "../hooks/useRequest";
import { authRepository } from "../repositories/authRepository";

export default function ProfilePage() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const load = useCallback(
    (signal: AbortSignal) => authRepository.getCurrentUser(signal),
    [],
  );
  const { state, retry } = useRequest(load);

  if (!isAuthenticated) return <Navigate to="/login?next=%2Fprofile" replace />;

  return (
    <section className="profile">
      <h1>Профіль</h1>
      {state.status === "loading" && <p role="status">Завантаження профілю…</p>}
      {state.status === "error" && (
        <div>
          <p role="alert">{state.message}</p>
          <button
            className="button button--secondary"
            type="button"
            onClick={retry}
          >
            Спробувати ще
          </button>
        </div>
      )}
      {state.status === "success" && (
        <dl>
          <dt>Ім’я користувача</dt>
          <dd>{state.data.username}</dd>
          <dt>Email</dt>
          <dd>{state.data.email}</dd>
          <dt>Статус</dt>
          <dd>Авторизований</dd>
        </dl>
      )}
      <button
        className="button button--secondary"
        type="button"
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        Вийти
      </button>
    </section>
  );
}
