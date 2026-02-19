'use client';

/**
 * Empresa Notificaciones — Lista de notificaciones para empresa.
 * Módulo 5: Notificaciones
 */

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import Button from '@/components/Button';
import { FiUsers, FiCheckCircle, FiTarget, FiAlertCircle, FiCheck, FiTrash2 } from 'react-icons/fi';

const mockNotificaciones = [
  { id: 1, tipo: 'postulante', titulo: 'Nuevo postulante', mensaje: 'Bryan Galarza se postuló a "Practicante Desarrollo Frontend"', fecha: '2026-02-19T10:30:00', leida: false },
  { id: 2, tipo: 'matching', titulo: 'Afinidad alta detectada', mensaje: 'Sofía Ramírez tiene un 92% de afinidad con "Practicante Análisis de Datos"', fecha: '2026-02-18T15:45:00', leida: false },
  { id: 3, tipo: 'postulante', titulo: 'Nuevo postulante', mensaje: 'Laura Torres se postuló a "Practicante Diseño UX/UI"', fecha: '2026-02-18T09:20:00', leida: true },
  { id: 4, tipo: 'alerta', titulo: 'Vacante por vencer', mensaje: 'La vacante "Practicante Contabilidad" vence en 3 días', fecha: '2026-02-17T08:00:00', leida: true },
  { id: 5, tipo: 'seleccion', titulo: 'Practicante seleccionado', mensaje: 'María López fue seleccionada para "Practicante Marketing Digital"', fecha: '2026-02-16T14:10:00', leida: true },
  { id: 6, tipo: 'postulante', titulo: 'Nuevo postulante', mensaje: 'Diego Vargas se postuló a "Practicante Desarrollo Frontend"', fecha: '2026-02-16T11:05:00', leida: true },
  { id: 7, tipo: 'matching', titulo: 'Afinidad alta detectada', mensaje: 'Naldo Anchundia tiene un 88% de afinidad con "Practicante Desarrollo Frontend"', fecha: '2026-02-15T16:30:00', leida: true },
];

const iconMap = {
  postulante: { icon: FiUsers, bg: 'bg-primary-50', color: 'text-primary-600' },
  matching: { icon: FiTarget, bg: 'bg-success-light', color: 'text-green-600' },
  alerta: { icon: FiAlertCircle, bg: 'bg-warning-light', color: 'text-amber-600' },
  seleccion: { icon: FiCheckCircle, bg: 'bg-info-light', color: 'text-blue-600' },
};

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
  return `Hace ${Math.floor(diff / 86400)} días`;
}

export default function EmpresaNotificaciones() {
  const [notificaciones, setNotificaciones] = useState(mockNotificaciones);

  const sinLeer = notificaciones.filter((n) => !n.leida).length;

  const marcarLeida = (id) => {
    setNotificaciones((prev) => prev.map((n) => (n.id === id ? { ...n, leida: true } : n)));
  };

  const marcarTodasLeidas = () => {
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
  };

  const eliminar = (id) => {
    setNotificaciones((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Notificaciones"
        subtitle={sinLeer > 0 ? `${sinLeer} notificaciones sin leer` : 'Todas las notificaciones leídas'}
        action={
          sinLeer > 0 && (
            <Button variant="secondary" size="sm" icon={<FiCheck />} onClick={marcarTodasLeidas}>
              Marcar todas como leídas
            </Button>
          )
        }
      />

      <div className="flex flex-col gap-2 max-w-3xl">
        {notificaciones.length === 0 ? (
          <div className="p-12 bg-white border border-slate-200 rounded-xl text-center text-slate-400">
            <FiCheckCircle size={32} className="mx-auto mb-3" />
            <p className="text-sm">No tienes notificaciones</p>
          </div>
        ) : (
          notificaciones.map((notif) => {
            const config = iconMap[notif.tipo] || iconMap.postulante;
            const Icon = config.icon;

            return (
              <div
                key={notif.id}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-colors cursor-pointer group
                  ${notif.leida 
                    ? 'bg-white border-slate-200 hover:bg-slate-50' 
                    : 'bg-primary-50/40 border-primary-200 hover:bg-primary-50/70'
                  }`}
                onClick={() => marcarLeida(notif.id)}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0 ${config.bg} ${config.color}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-slate-800 m-0">{notif.titulo}</p>
                    {!notif.leida && (
                      <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-slate-600 m-0 leading-relaxed">{notif.mensaje}</p>
                  <p className="text-xs text-slate-400 mt-1.5 m-0">{timeAgo(notif.fecha)}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); eliminar(notif.id); }}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border-none bg-transparent text-slate-300 cursor-pointer transition-colors opacity-0 group-hover:opacity-100 hover:bg-danger-light hover:text-danger"
                  title="Eliminar"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
