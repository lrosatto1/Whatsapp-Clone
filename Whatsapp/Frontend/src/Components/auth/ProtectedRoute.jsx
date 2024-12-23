import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ children, user, redirect = "/login" }) => {
  // Si no hay usuario, redirige a la ruta definida
  if (!user) {
    return <Navigate to={redirect} />;
  }

  // Renderiza los hijos o el componente Outlet si está en un contexto de rutas anidadas
  return children || <Outlet />;
};

export default ProtectedRoute;
