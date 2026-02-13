// TODO: Layout principal - Navbar, estructura base
export const metadata = {
  title: 'Matching Prácticas Preprofesionales',
  description: 'Plataforma de matching bidireccional para prácticas preprofesionales - Universidad de Guayaquil',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
