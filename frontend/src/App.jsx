import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from 'context/AuthContext';

import LoginPage from 'pages/login';

import DashboardLayout from 'pages/dashboard/layout';

import AdminDashboard from 'pages/dashboard/admin/panel-admin';
import EmpresasAdmin from 'pages/dashboard/admin/empresas';
import UsuariosAdmin from 'pages/dashboard/admin/usuarios';
import VacantesAdmin from 'pages/dashboard/admin/vacantes';
import ReportesAdmin from 'pages/dashboard/admin/reportes';

import EmpresaDashboard from 'pages/dashboard/empresa/panel-empresa';
import VacantesEmpresa from 'pages/dashboard/empresa/vacantes';
import NuevaVacante from 'pages/dashboard/empresa/nueva-vacante';
import PostulantesEmpresa from 'pages/dashboard/empresa/postulantes';

import EstudianteDashboard from 'pages/dashboard/estudiante/panel-estudiante';
import PerfilEstudiante from 'pages/dashboard/estudiante/perfil';
import PostulacionesEstudiante from 'pages/dashboard/estudiante/postulaciones';
import EstudianteEmpresas from 'pages/dashboard/estudiante/empresas';

import GestorDashboard from 'pages/dashboard/gestor/panel-gestor';
import GestorPostulaciones from 'pages/dashboard/gestor/postulaciones';
import GestorHistorial from 'pages/dashboard/gestor/historial';
import GestorEmpresas from 'pages/dashboard/gestor/empresas';
import GestorEstudiantes from 'pages/dashboard/gestor/estudiantes';
import GestorReportes from 'pages/dashboard/gestor/reportes';
import GestorVacantes from 'pages/dashboard/gestor/vacantes';
import CambiarClave from 'pages/dashboard/CambiarClave';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />

          
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="cambiar-clave" element={<CambiarClave />} />
            
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
            <Route path="estudiante/empresas" element={<EstudianteEmpresas />} />

            {/* Gestor PPP Routes */}
            <Route path="gestor" element={<GestorDashboard />} />
            <Route path="gestor/postulaciones" element={<GestorPostulaciones />} />
            <Route path="gestor/historial" element={<GestorHistorial />} />
            <Route path="gestor/empresas" element={<GestorEmpresas />} />
            <Route path="gestor/vacantes" element={<GestorVacantes />} />
            <Route path="gestor/estudiantes" element={<GestorEstudiantes />} />
            <Route path="gestor/reportes" element={<GestorReportes />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
