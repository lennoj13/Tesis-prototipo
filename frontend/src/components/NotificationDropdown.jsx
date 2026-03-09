'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import notificationService from '@/services/notificationService';
import { FiBell, FiCheck, FiInfo, FiTrash2, FiClock } from 'react-icons/fi';

export default function NotificationDropdown() {
  const { user } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await notificationService.getAll();
      if (res.result) {
        setNotifications(res.data || []);
        setUnreadCount((res.data || []).filter((n) => !n.is_read).length);
      }
    } catch (err) {
      console.error('Error al cargar notificaciones en navbar:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Opcional: Polling cada 60 segundos
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation(); // Evitar cerrar el dropdown si solo se marca
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.notification_id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error al marcar notif:', err);
    }
  };

  const handleMarkAllAsRead = async (e) => {
    e.stopPropagation();
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleNotificationClick = async (notif) => {
    // Si no está leída, marcarla
    if (!notif.is_read) {
      await handleMarkAsRead(notif.notification_id, { stopPropagation: () => {} });
    }
    setIsOpen(false);

    // Redirección contextual según el tipo de notificación y rol
    if (user?.rol === 'estudiante') {
       if (notif.type === 'application') router.push('/dashboard/estudiante/postulaciones');
       else if (notif.type === 'vacancy') router.push('/dashboard/estudiante');
       else router.push('/dashboard/estudiante/notificaciones');
    } else if (user?.rol === 'empresa') {
       if (notif.type === 'applicant') router.push('/dashboard/empresa');
       else router.push('/dashboard/empresa/notificaciones');
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins} min`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs} h`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays} d`;
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'application': return <FiCheck className="text-green-500" />;
      case 'applicant': return <FiInfo className="text-blue-500" />;
      case 'vacancy': return <FiClock className="text-orange-500" />;
      default: return <FiInfo className="text-slate-500" />;
    }
  };

  const allPageUrl = user?.rol === 'estudiante' 
    ? '/dashboard/estudiante/notificaciones' 
    : '/dashboard/empresa/notificaciones';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative flex items-center justify-center w-10 h-10 border-none bg-transparent text-slate-500 rounded-lg cursor-pointer transition-all duration-150 hover:bg-slate-100 hover:text-slate-700"
        title="Notificaciones"
        aria-label="Notificaciones"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-danger text-white text-[0.6875rem] font-bold rounded-full flex items-center justify-center px-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] right-0 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-lg flex flex-col animate-fade-in z-[200] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
            <h3 className="text-sm font-semibold text-slate-800 m-0">Notificaciones</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs font-medium text-primary-600 bg-transparent border-none cursor-pointer hover:underline p-0"
              >
                Marcar leídas
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto w-full">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500 flex flex-col items-center gap-2">
                <FiBell size={24} className="text-slate-300" />
                <p className="m-0">No tienes notificaciones nuevas</p>
              </div>
            ) : (
              <ul className="list-none m-0 p-0 flex flex-col">
                {notifications.slice(0, 5).map((notif) => (
                  <li
                    key={notif.notification_id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`flex items-start gap-3 p-4 border-b border-slate-100 cursor-pointer transition-colors hover:bg-slate-50 ${
                      !notif.is_read ? 'bg-primary-50/30' : ''
                    }`}
                  >
                    <div className="mt-0.5 bg-white p-2 rounded-full shadow-sm border border-slate-100">
                      {getIconForType(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm m-0 mb-1 ${!notif.is_read ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-slate-500 m-0 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                      <span className="text-[0.6875rem] text-slate-400 font-medium mt-1.5 block">
                        {formatTimeAgo(notif.created_at)}
                      </span>
                    </div>
                    {!notif.is_read && (
                      <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-1.5" />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 p-2 bg-slate-50 text-center">
            <Link
              href={allPageUrl}
              onClick={() => setIsOpen(false)}
              className="inline-block w-full py-1.5 text-xs font-medium text-slate-600 hover:text-primary-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Ver todas las notificaciones
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
