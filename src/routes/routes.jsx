import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Register from "../components/auth/register";
import MainLayout from "./../layout/MainLayout";
import Login from "../components/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      // login
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);
