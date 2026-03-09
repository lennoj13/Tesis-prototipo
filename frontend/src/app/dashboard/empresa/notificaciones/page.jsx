'use client';

/**
 * Empresa Notificaciones — Real con API.
 * Módulo 5: Notificaciones
 */

import { useState, useEffect } from 'react';
import notificationService from '@/services/notificationService';
import PageHeader from '@/components/PageHeader';
import Button from '@/components/Button';
import { FiUsers, FiCheckCircle, FiTarget, FiAlertCircle, FiCheck, FiTrash2, FiBell } from 'react-icons/fi';

const iconMap = {
  application: { icon: FiUsers, bg: 'bg-primary-50', color: 'text-primary-600' },
  matching: { icon: FiTarget, bg: 'bg-success-light', color: 'text-green-600' },
  vacancy: { icon: FiAlertCircle, bg: 'bg-warning-light', color: 'text-amber-600' },
  system: { icon: FiBell, bg: 'bg-slate-100', color: 'text-slate-600' },
};

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 3600) return `Hace ${Math.max(1, Math.floor(diff / 60))} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
  return `Hace ${Math.floor(diff / 86400)} días`;
}

export default function EmpresaNotificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await notificationService.getAll();
        if (res.result) setNotificaciones(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const sinLeer = notificaciones.filter((n) => !n.is_read).length;

  const marcarLeida = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotificaciones((prev) => prev.map((n) => (n.notification_id === id ? { ...n, is_read: true } : n)));
    } catch (err) { console.error(err); }
  };

  const marcarTodasLeidas = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotificaciones((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) { console.error(err); }
  };

  const eliminar = async (id) => {
    try {
      await notificationService.delete(id);
      setNotificaciones((prev) => prev.filter((n) => n.notification_id !== id));
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="animate-fade-in p-12 text-center text-slate-400">Cargando...</div>;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Notificaciones"
        subtitle={sinLeer > 0 ? `${sinLeer} sin leer` : 'Todas leídas'}
        action={sinLeer > 0 && <Button variant="secondary" size="sm" icon={<FiCheck />} onClick={marcarTodasLeidas}>Marcar todas</Button>}
      />

      <div className="flex flex-col gap-2 max-w-3xl">
        {notificaciones.length === 0 ? (
          <div className="p-12 bg-white border border-slate-200 rounded-xl text-center text-slate-400">
            <FiCheckCircle size={32} className="mx-auto mb-3" />
            <p className="text-sm">No tienes notificaciones</p>
          </div>
        ) : (
          notificaciones.map((notif) => {
            const config = iconMap[notif.type] || iconMap.system;
            const Icon = config.icon;
            return (
              <div
                key={notif.notification_id}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-colors cursor-pointer group
                  ${notif.is_read ? 'bg-white border-slate-200 hover:bg-slate-50' : 'bg-primary-50/40 border-primary-200 hover:bg-primary-50/70'}`}
                onClick={() => marcarLeida(notif.notification_id)}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0 ${config.bg} ${config.color}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-slate-800 m-0">{notif.title}</p>
                    {!notif.is_read && <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />}
                  </div>
                  <p className="text-sm text-slate-600 m-0">{notif.message}</p>
                  <p className="text-xs text-slate-400 mt-1.5 m-0">{timeAgo(notif.created_at)}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); eliminar(notif.notification_id); }}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border-none bg-transparent text-slate-300 cursor-pointer transition-colors opacity-0 group-hover:opacity-100 hover:bg-danger-light hover:text-danger"
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
