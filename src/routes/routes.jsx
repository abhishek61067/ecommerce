import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Register from "../components/auth/register";
import MainLayout from "./../layout/MainLayout";
import Login from "../components/Login";
import AddProduct from "../dashboard/AddProduct";
import ProductCatalog from "../pages/ProductCatalog";
import ProductCatalogDetail from "../pages/ProductCatalogDetail";
import CartPage from "../pages/Cart";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import RoleProtectedRoute from "../components/auth/RoleProtectedRoute";
import Unauthorized from "../pages/Unauthorized";

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
      {
        path: "/dashboard",
        element: (
          <RoleProtectedRoute allowedRoles={["ADMIN"]}>
            <AddProduct />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/catalog",
        element: (
          <ProtectedRoute>
            <ProductCatalog />
          </ProtectedRoute>
        ), // Assuming this is the product catalog page
      },
      {
        path: "product/:id",
        element: <ProductCatalogDetail />, // Assuming this is the product detail page
      },
      {
        path: "/cart",
        element: (
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/unauthorized",
        element: <Unauthorized />,
      },
    ],
  },
]);
