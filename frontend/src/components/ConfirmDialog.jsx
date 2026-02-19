'use client';

/**
 * ConfirmDialog — Diálogo de confirmación para acciones destructivas.
 * Demuestra: Composición de componentes, patrón modal especializado.
 */

import Modal from './Modal';
import Button from './Button';
import { FiAlertTriangle } from 'react-icons/fi';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Estás seguro?',
  message = 'Esta acción no se puede deshacer.',
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  variant = 'danger',
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm" footer={
      <>
        <Button variant="secondary" onClick={onClose}>{cancelText}</Button>
        <Button variant={variant} onClick={() => { onConfirm(); onClose(); }}>{confirmText}</Button>
      </>
    }>
      <div className="flex flex-col items-center text-center py-2">
        <div className="w-14 h-14 rounded-full bg-danger-light flex items-center justify-center mb-4">
          <FiAlertTriangle size={28} className="text-danger" />
        </div>
        <p className="text-slate-600 text-[0.9375rem] leading-relaxed">{message}</p>
      </div>
    </Modal>
  );
}
