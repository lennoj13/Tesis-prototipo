# MatchPP Frontend

**Next.js 16 + React 19 + Tailwind CSS 4**

Interfaz web para la plataforma de matching bidireccional entre estudiantes y empresas.

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Stack

- **Next.js 16** — App Router, Turbopack
- **React 19** — Context API, Hooks
- **Tailwind CSS 4** — Utility-first CSS con `@theme` para design tokens
- **React Icons** — Feather Icons (`react-icons/fi`)
- **Montserrat** — Google Fonts via `next/font`

## Estructura

```
src/
├── app/                    # Páginas (App Router)
│   ├── globals.css         # Tailwind + tema + estilos base
│   ├── layout.jsx          # Root layout (AuthProvider)
│   ├── login/              # Login split-screen
│   ├── register/           # Registro (pendiente)
│   └── dashboard/          # Dashboards por rol
│       ├── layout.jsx      # Navbar + Sidebar + overlay
│       ├── estudiante/
│       ├── empresa/
│       └── admin/
├── components/             # Logo, Button, Input, Navbar, Sidebar
├── context/                # AuthContext (JWT simulado)
├── hooks/                  # useAuth
├── services/               # API client (Axios)
└── utils/                  # Constantes
```

## Despliegue

Configurar en Vercel con **Root Directory** = `frontend`.
