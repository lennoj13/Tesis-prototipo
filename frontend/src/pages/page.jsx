/**
 * Landing page — Redirige al login.
 * Demuestra: redirect() de Next.js para navegación server-side.
 */

import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/login');
}
