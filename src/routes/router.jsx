import React from "react";
import {
  createBrowserRouter,
} from "react-router-dom";

import MainLayout from "../layouts/mainLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";

import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import RecuperarPassword from "../pages/RecuperarPassword.jsx";

import DashboardHome from "../pages/dashboard/home.jsx";
import CuentasPage from "../pages/dashboard/usuarios/cuentas.jsx";
import BitacoraPage from "../pages/dashboard/usuarios/bitacora.jsx";
import ClientesPage from "../pages/dashboard/usuarios/clientes.jsx"; 

import CategoriasPage from "../pages/dashboard/catalogo/categorias.jsx";
import ProductosPage from "../pages/dashboard/catalogo/productos.jsx";
import InventariosPage from "../pages/dashboard/catalogo/inventarios.jsx";
import IngresosPage from "../pages/dashboard/catalogo/ingresos.jsx";

import RegistroVentaPage from "../pages/dashboard/ventas/RegistroVenta.jsx";
import HistorialVentasPage from "../pages/dashboard/ventas/HistorialVentas.jsx";

import DashboardIAPage from "../pages/dashboard/analisis/DashboardIA.jsx";
import ReportesDinamicosPage from "../pages/dashboard/analisis/ReportesDinamicos.jsx";

// Módulo de Avisos
import AvisosIndex from "../pages/dashboard/avisos/AvisosIndex.jsx";

import ErrorBoundaryPage from "../pages/ErrorBoundaryPage.jsx";
import ProtectedRoute from "../components/routing/ProtectedRoute.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorBoundaryPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ]
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute roles={['ADMIN']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundaryPage />,
    children: [
      { index: true, element: <DashboardHome /> },
      
      // Módulo: Acceso y Seguridad
      { path: "usuarios", element: <CuentasPage /> },
      { path: "usuarios/bitacora", element: <BitacoraPage /> },
      
      // Módulo: Avisos y Notificaciones
      { path: "avisos", element: <AvisosIndex /> },
      
      // Módulo: Catálogo
      { path: "clientes", element: <ClientesPage /> }, // Ya existía
      { path: "catalogo/categorias", element: <CategoriasPage /> },
      { path: "catalogo/productos", element: <ProductosPage /> },
      { path: "catalogo/inventarios", element: <InventariosPage /> },
      { path: "catalogo/ingresos", element: <IngresosPage /> },

      // Módulo: Venta Transaccion
      { path: "ventas/registrar", element: <RegistroVentaPage /> },
      { path: "ventas/historial", element: <HistorialVentasPage /> },
      // Módulo: Análisis e Inteligencia Artificial
      { path: "analisis/dashboard-ia", element: <DashboardIAPage /> },
      { path: "analisis/reportes", element: <ReportesDinamicosPage /> },

    ]
  },
  {
    path: "/recuperar-password",
    element: <RecuperarPassword />
  },
  { path: "*", element: <ErrorBoundaryPage /> }
]);

export { router };
