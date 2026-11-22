import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import AppLayout from "./layouts/AppLayout";
import TasksPage from "./pages/TasksPage";
import TaskDetailsPage from "./pages/TaskDetailsPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import AuthProvider from "./context/AuthProvider";
import TasksProvider from "./context/TasksProvider";
import { requireAuth } from "./routes/requireAuth";

const router = createBrowserRouter(
  [
    {
      Component: AppLayout,
      children: [
        { index: true, element: <Navigate to="/tasks" replace /> },
        { path: "tasks", Component: TasksPage },
        { path: "tasks/:taskId", Component: TaskDetailsPage },
        { path: "login", Component: LoginPage },
        { path: "profile", Component: ProfilePage, loader: requireAuth },
        { path: "*", element: <p>Сторінку не знайдено.</p> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
);

export default function App() {
  return (
    <AuthProvider>
      <TasksProvider>
        <RouterProvider router={router} />
      </TasksProvider>
    </AuthProvider>
  );
}
