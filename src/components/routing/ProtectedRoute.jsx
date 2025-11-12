import React from "react";
import { Navigate } from "react-router-dom";
import { getToken, getUser } from "../../services/auth.js";

export default function ProtectedRoute({ children, roles = [] }) {
  const token = getToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const user = getUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles || roles.length === 0) {
    return children;
  }

  const rawSuper = user.is_superuser;
  const isSuperuser = (rawSuper === true) || (rawSuper === 1) || (String(rawSuper).toLowerCase() === 'true');
  
  if (isSuperuser) {
    return children;
  }

  const rolesPermitidos = roles.map(r => String(r || '').toUpperCase());
  
  const rolUsuario = String(user.rol || '').toUpperCase();

  if (rolesPermitidos.includes(rolUsuario)) {
    return children;
  }

  return <Navigate to="/" replace />;
}