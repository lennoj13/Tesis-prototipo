import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from 'services/authService';
import PageHeader from 'components/PageHeader';
import Card from 'components/Card';
import Input from 'components/Input';
import Button from 'components/Button';
import Toast from 'components/Toast';

export default function CambiarClave() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    // de 8 caracters, mayuscula, numero, y signo
    if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
    if (!/[A-Z]/.test(password)) return "La contraseña debe contener al menos una mayúscula.";
    if (!/[0-9]/.test(password)) return "La contraseña debe contener al menos un número.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "La contraseña debe contener al menos un signo/carácter especial.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast(null);

    if (newPassword !== confirmPassword) {
      setToast({ type: 'error', message: 'Las contraseñas nuevas no coinciden.' });
      return;
    }

    const validationError = validatePassword(newPassword);
    if (validationError) {
      setToast({ type: 'error', message: validationError });
      return;
    }

    setLoading(true);
    try {
      const response = await authService.changePassword(oldPassword, newPassword);
      if (response.result || response.indexOf('exitosamente') !== -1) {
        setToast({ type: 'success', message: 'Contraseña actualizada exitosamente.' });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => navigate(-1), 2000);
      } else {
        setToast({ type: 'error', message: response.message || 'Error al actualizar la contraseña.' });
      }
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Error de conexión.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-xl mx-auto">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      
      <PageHeader 
        title="Cambiar Contraseña" 
        subtitle="Actualiza tu contraseña de acceso al sistema"
      />

      <Card>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <Input
            label="Contraseña Anterior"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            placeholder="Ingresa tu contraseña actual"
          />

          <div className="h-px bg-slate-100 my-2"></div>

          <Input
            label="Nueva Contraseña"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="Ingresa la nueva contraseña"
          />
          <ul className="text-xs text-slate-500 m-0 pl-4 mt-[-10px] mb-2 list-disc">
            <li>Al menos 8 caracteres</li>
            <li>Al menos una mayúscula</li>
            <li>Al menos un número</li>
            <li>Al menos un carácter especial (!@#$%^&*)</li>
          </ul>

          <Input
            label="Confirmar Nueva Contraseña"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Repite la nueva contraseña"
          />

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="secondary" onClick={() => navigate(-1)} disabled={loading}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
