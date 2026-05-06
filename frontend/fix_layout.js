const fs=require('fs');
let c=fs.readFileSync('src/pages/dashboard/layout.jsx','utf8');
c=c.replace("import { useNavigate, useLocation } from 'react-router-dom';", "import { useNavigate, useLocation, Outlet } from 'react-router-dom';");
c=c.replace("export default function DashboardLayout({ children }) {", "export default function DashboardLayout() {");
c=c.replace("{children}", "<Outlet />");
c=c.replace("pathname, router", "pathname, navigate");
fs.writeFileSync('src/pages/dashboard/layout.jsx', c);
