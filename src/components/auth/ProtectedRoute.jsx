// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "/src/store/authStore";

const ProtectedRoute = () => {
  const { accessToken } = useAuthStore();

  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
