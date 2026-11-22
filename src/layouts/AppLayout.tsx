import "./AppLayout.scss";
import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useTaskStore } from "../hooks/useTaskStore";
import Toast from "../components/Toast";

export default function AppLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const { message } = useTaskStore();
  const navigate = useNavigate();

  function signOut() {
    logout();
    navigate("/tasks");
  }

  return (
    <>
      <header className="header">
        <div className="header__content">
          <NavLink className="header__title" to="/tasks">
            Study Planner
          </NavLink>
          <nav className="header__nav" aria-label="Головна навігація">
            <NavLink to="/tasks">Завдання</NavLink>
            <NavLink to="/profile">Профіль</NavLink>
            {isAuthenticated ? (
              <>
                <span>{user?.username}</span>
                <button
                  className="button button--secondary"
                  type="button"
                  onClick={signOut}
                >
                  Вийти
                </button>
              </>
            ) : (
              <NavLink to="/login">Увійти</NavLink>
            )}
          </nav>
        </div>
      </header>
      <main className="page">
        <Outlet />
      </main>
      {message && <Toast {...message} />}
    </>
  );
}
