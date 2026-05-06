/**
 * Root Layout — Next.js App Router.
 * Demuestra: Layout raíz de Next.js, Google Fonts (Inter), AuthProvider como wrapper global.
 * 
 * Esto envuelve TODA la aplicación. El AuthProvider aquí hace que
 * el estado de autenticación sea accesible desde cualquier página → Context API.
 */

import { Montserrat } from 'next/font/google';
import { AuthProvider } from 'context/AuthContext';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata = {
  title: 'MatchPP — Matching Bidireccional para Prácticas Preprofesionales',
  description:
    'Plataforma web que conecta estudiantes universitarios con oportunidades de prácticas preprofesionales usando NLP y similitud semántica.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${montserrat.className} ${montserrat.variable}`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
