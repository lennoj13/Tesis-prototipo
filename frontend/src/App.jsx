import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from 'context/AuthContext';

import LoginPage from 'pages/login/page';
import RegisterPage from 'pages/register/page';
import DashboardLayout from 'pages/dashboard/layout';

import AdminDashboard from 'pages/dashboard/admin/page';
import EmpresasAdmin from 'pages/dashboard/admin/empresas/page';
import UsuariosAdmin from 'pages/dashboard/admin/usuarios/page';
import VacantesAdmin from 'pages/dashboard/admin/vacantes/page';
import ReportesAdmin from 'pages/dashboard/admin/reportes/page';

import EmpresaDashboard from 'pages/dashboard/empresa/page';
import VacantesEmpresa from 'pages/dashboard/empresa/vacantes/page';
import NuevaVacante from 'pages/dashboard/empresa/vacantes/nueva/page';
import PostulantesEmpresa from 'pages/dashboard/empresa/postulantes/page';

import EstudianteDashboard from 'pages/dashboard/estudiante/page';
import PerfilEstudiante from 'pages/dashboard/estudiante/perfil/page';
import PostulacionesEstudiante from 'pages/dashboard/estudiante/postulaciones/page';

import GestorDashboard from 'pages/dashboard/gestor/page';
import GestorPostulaciones from 'pages/dashboard/gestor/postulaciones/page';
import GestorHistorial from 'pages/dashboard/gestor/historial/page';
import GestorEmpresas from 'pages/dashboard/gestor/empresas/page';
import GestorEstudiantes from 'pages/dashboard/gestor/estudiantes/page';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/dashboard" element={<DashboardLayout />}>
            {/* Admin Routes */}
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/empresas" element={<EmpresasAdmin />} />
            <Route path="admin/usuarios" element={<UsuariosAdmin />} />
            <Route path="admin/vacantes" element={<VacantesAdmin />} />
            <Route path="admin/reportes" element={<ReportesAdmin />} />

            {/* Empresa Routes */}
            <Route path="empresa" element={<EmpresaDashboard />} />
            <Route path="empresa/vacantes" element={<VacantesEmpresa />} />
            <Route path="empresa/vacantes/nueva" element={<NuevaVacante />} />
            <Route path="empresa/postulantes" element={<PostulantesEmpresa />} />

            {/* Estudiante Routes */}
            <Route path="estudiante" element={<EstudianteDashboard />} />
            <Route path="estudiante/perfil" element={<PerfilEstudiante />} />
            <Route path="estudiante/postulaciones" element={<PostulacionesEstudiante />} />

            {/* Gestor PPP Routes */}
            <Route path="gestor" element={<GestorDashboard />} />
            <Route path="gestor/postulaciones" element={<GestorPostulaciones />} />
            <Route path="gestor/historial" element={<GestorHistorial />} />
            <Route path="gestor/empresas" element={<GestorEmpresas />} />
            <Route path="gestor/estudiantes" element={<GestorEstudiantes />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
