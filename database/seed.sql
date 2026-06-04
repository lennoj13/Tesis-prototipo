-- ============================================
-- DATOS SEMILLA
TRUNCATE TABLE
    public.postulaciones,
    public.habilidades_vacante,
    public.vacantes,
    public.habilidades_estudiante,
    public.supervisores,
    public.instituciones,
    public.perfiles_gestor,
    public.perfiles_estudiante,
    public.usuarios,
    public.habilidades,
    public.carreras,
    public.facultades,
    public.roles
RESTART IDENTITY CASCADE;
-- ============================================
-- ROLES
INSERT INTO public.roles (nombre, descripcion) VALUES 
    ('estudiante', 'Estudiante de la Carrera'),
    ('empresa', 'Empresa o Institución con convenio'),
    ('gestor', 'Gestor de practicas preprofesionales'),
    ('admin', 'Administrador tecnico del sistema');
-- FACULTADES
INSERT INTO public.facultades (nombre) VALUES
    ('Ciencias Matemáticas y Físicas'),
    ('Ingeniería Química');
-- CARRERAS
INSERT INTO public.carreras (facultad_id, nombre, codigo) VALUES
    (1, 'SOFTWARE', 'SOF'),
    (1, 'Ciencias de Datos e Inteligencia Artificial', 'CDIA'),
    (2, 'Ingeniería de la Producción', 'INP');
-- HABILIDADES
INSERT INTO public.habilidades (nombre, categoria) VALUES 
    ('JavaScript', 'Programacion'), ('Python', 'Programacion'), ('React', 'Frontend'), ('Node.js', 'Backend'),
    ('SQL', 'Base de Datos'), ('Java', 'Programacion'), ('TypeScript', 'Programacion'), ('Git', 'Herramientas'),
    ('Excel', 'Herramientas'), ('Power BI', 'Analisis'), ('Figma', 'Diseno'), ('Adobe XD', 'Diseno'),
    ('Machine Learning', 'IA'), ('Data Analysis', 'Analisis'), ('AWS', 'Cloud'), ('Docker', 'DevOps'),
    ('Ingles', 'Idiomas'), ('Liderazgo', 'Soft Skills'), ('Trabajo en equipo', 'Soft Skills'), ('Comunicacion', 'Soft Skills'),
    ('Flask', 'Backend'), ('Django', 'Backend'), ('C#', 'Programacion'), ('.NET', 'Backend'),
    ('PHP', 'Programacion'), ('Laravel', 'Backend'), ('Angular', 'Frontend'), ('Vue.js', 'Frontend'),
    ('PostgreSQL', 'Base de Datos'), ('MongoDB', 'Base de Datos'), ('TensorFlow', 'IA'), ('PyTorch', 'IA'),
    ('Lean Manufacturing', 'Ingenieria'), ('Six Sigma', 'Ingenieria'), ('Logistica', 'Ingenieria');
-- USUARIOS (password para todos: Prueba123.)
INSERT INTO public.usuarios (cedula, contrasena, nombre, apellido, correo, telefono, rol_id) VALUES
('0900000001', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Admin', 'Sistema', 'admin@ug.edu.ec', '0999000000', 4),
('0900000002', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Marta', 'Díaz', 'marta.diaz@ug.edu.ec', '0997777771', 3),
('0900000003', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Carlos Eduardo', 'Ruiz', 'carlos.ruiz@ug.edu.ec', '0997777772', 3),
('0900000004', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Luisa', 'Méndez', 'luisa.mendez@ug.edu.ec', '0997777773', 3),
('0955236773', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Bryan Guillermo', 'Galarza Indacochea', 'bryan.galarzaind@ug.edu.ec', '09900005', 1),
('0942646266', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Naldo Jonnel', 'Anchundia Caicedo', 'naldo.anchundiac@ug.edu.ec', '09900006', 1),
('1312657255', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Jorge David', 'Intriago Loor', 'jorge.intriagoloo@ug.edu.ec', '09900007', 1),
('0911223344', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Maria Fernanda', 'Gómez Silva', 'maria.gomez@ug.edu.ec', '09900008', 1),
('0922334455', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Luis Antonio', 'Pérez Castro', 'luis.perez@ug.edu.ec', '09900009', 1),
('0933445566', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Ana Sofía', 'Martínez Vera', 'ana.martinez@ug.edu.ec', '099000010', 1),
('0944556677', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Pedro José', 'Castro Mendoza', 'pedro.castro@ug.edu.ec', '099000011', 1),
('0955667788', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Gabriela Elena', 'Vera Loor', 'gabriela.vera@ug.edu.ec', '099000012', 1),
('0966778899', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Carlos Alberto', 'Mora Sánchez', 'carlos.mora@ug.edu.ec', '099000013', 1),
('0977889900', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Diana Carolina', 'Silva Torres', 'diana.silva@ug.edu.ec', '099000014', 1),
('0990151100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Ana', 'Garcia', 'rrhh@techsolutionsgye.com', '099000015', 2),
('0990161100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Pedro', 'Sanchez', 'contacto@innovasoft.com', '099000016', 2),
('0990171100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Luis', 'Fernandez', 'rrhh@globalsystems.com', '099000017', 2),
('0990181100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Carla', 'Ruiz', 'rrhh@clouddevs.com', '099000018', 2),
('0990191100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Jorge', 'Moreno', 'rrhh@appworks.com', '099000019', 2),
('0990201100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Elena', 'Vargas', 'rrhh@fintechsolutions.com', '099000020', 2),
('0990211100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Andres', 'Rojas', 'rrhh@cybersecurityec.com', '099000021', 2),
('0990221100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Sofia', 'Mendoza', 'rrhh@smartcode.com', '099000022', 2),
('0990231100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Mario', 'Castro', 'rrhh@nexustech.com', '099000023', 2),
('0990241100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Laura', 'Guzman', 'rrhh@devmasters.com', '099000024', 2),
('0990251100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Roberto', 'Luna', 'rrhh@datamindgye.com', '099000025', 2),
('0990261100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Valeria', 'Pinto', 'contacto@aivision.com', '099000026', 2),
('0990271100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Jose', 'Mieles', 'rrhh@metricasec.com', '099000027', 2),
('0990281100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Carmen', 'Salas', 'rrhh@induproduccion.com', '099000028', 2),
('0990291100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Victor', 'Lino', 'contacto@logisticaavanzada.com', '099000029', 2);
-- PERFILES DE GESTOR
INSERT INTO public.perfiles_gestor (usuario_id, facultad_id, carrera_id) VALUES
(2, 1, 1), (3, 1, 2), (4, 2, 3);
-- PERFILES DE ESTUDIANTE
INSERT INTO public.perfiles_estudiante (usuario_id, carrera_id, facultad_id, semestre, resumen_experiencia, intereses) VALUES
(5, 1, 1, '8', 'Desarrollador web con experiencia en proyectos académicos usando MERN stack. Creador de sistema de inventario para pyme local.', 'Me interesa el desarrollo Backend y la arquitectura de software.'),
(6, 1, 1, '8', 'Desarrollador web con experiencia en proyectos académicos usando MERN stack. Creador de sistema de inventario para pyme local.', 'Me interesa el desarrollo Backend y la arquitectura de software.'),
(7, 1, 1, '8', 'Desarrollador web con experiencia en proyectos académicos usando MERN stack. Creador de sistema de inventario para pyme local.', 'Me interesa el desarrollo Backend y la arquitectura de software.'),
(8, 1, 1, '8', 'Desarrollador web con experiencia en proyectos académicos usando MERN stack. Creador de sistema de inventario para pyme local.', 'Me interesa el desarrollo Backend y la arquitectura de software.'),
(9, 1, 1, '8', 'Desarrollador web con experiencia en proyectos académicos usando MERN stack. Creador de sistema de inventario para pyme local.', 'Me interesa el desarrollo Backend y la arquitectura de software.'),
(10, 2, 1, '7', 'Entusiasta de los datos. He participado en hackathons de análisis predictivo. Manejo de Python, Pandas y Scikit-Learn.', 'Inteligencia Artificial, Machine Learning, Análisis predictivo.'),
(11, 2, 1, '7', 'Entusiasta de los datos. He participado en hackathons de análisis predictivo. Manejo de Python, Pandas y Scikit-Learn.', 'Inteligencia Artificial, Machine Learning, Análisis predictivo.'),
(12, 3, 2, '8', 'Experiencia teórica y práctica en optimización de procesos mediante simuladores. Conocimiento en Lean Manufacturing.', 'Gestión de calidad, Mejora continua, Logística.'),
(13, 3, 2, '8', 'Experiencia teórica y práctica en optimización de procesos mediante simuladores. Conocimiento en Lean Manufacturing.', 'Gestión de calidad, Mejora continua, Logística.'),
(14, 3, 2, '8', 'Experiencia teórica y práctica en optimización de procesos mediante simuladores. Conocimiento en Lean Manufacturing.', 'Gestión de calidad, Mejora continua, Logística.');
-- HABILIDADES ESTUDIANTE
INSERT INTO public.habilidades_estudiante (estudiante_id, habilidad_id, nivel) VALUES
(1, 1, 4), (1, 3, 4), (1, 4, 3),
(2, 1, 4), (2, 3, 4), (2, 4, 3),
(3, 1, 4), (3, 3, 4), (3, 4, 3),
(4, 1, 4), (4, 3, 4), (4, 4, 3),
(5, 1, 4), (5, 3, 4), (5, 4, 3),
(6, 2, 5), (6, 13, 4), (6, 14, 4),
(7, 2, 5), (7, 13, 4), (7, 14, 4),
(8, 33, 4), (8, 34, 3), (8, 35, 4),
(9, 33, 4), (9, 34, 3), (9, 35, 4),
(10, 33, 4), (10, 34, 3), (10, 35, 4);
-- INSTITUCIONES
INSERT INTO public.instituciones (usuario_id, facultad_id, nombre, nombre_abreviado, ruc, industria, descripcion, estado, codigo_convenio, fecha_inicio_convenio, fecha_limite_convenio, telefono, correo_contacto) VALUES
(15, 1, 'Tech Solutions GYE', 'Empresa de Desarrollo Web', '1234567890001', 'Desarrollo Web', 'Desarrollamos soluciones integrales para el sector tecnológico.', 'aprobado', 'UG-DFAP-0001-PPP', '2023-01-01', '2028-12-31', '0990000001', 'contacto@techsolutionsgye.com'),
(16, 1, 'InnovaSoft Ecuador', 'Empresa de Software Factory', '1234567890002', 'Software Factory', 'Desarrollamos soluciones integrales para el sector tecnológico.', 'aprobado', 'UG-DFAP-0002-PPP', '2023-01-01', '2028-12-31', '0990000002', 'contacto@innovasoftecuador.com'),
(17, 1, 'Global Systems', 'Empresa de Consultoría IT', '1234567890003', 'Consultoría IT', 'Desarrollamos soluciones integrales para el sector tecnológico.', 'aprobado', 'UG-DFAP-0003-PPP', '2023-01-01', '2028-12-31', '0990000003', 'contacto@globalsystems.com'),
(18, 1, 'Cloud Devs', 'Empresa de Cloud Computing', '1234567890004', 'Cloud Computing', 'Desarrollamos soluciones integrales para el sector tecnológico.', 'aprobado', 'UG-DFAP-0004-PPP', '2023-01-01', '2028-12-31', '0990000004', 'contacto@clouddevs.com'),
(19, 1, 'App Works', 'Empresa de Desarrollo Móvil', '1234567890005', 'Desarrollo Móvil', 'Desarrollamos soluciones integrales para el sector tecnológico.', 'aprobado', 'UG-DFAP-0005-PPP', '2023-01-01', '2028-12-31', '0990000005', 'contacto@appworks.com'),
(20, 1, 'Fintech Solutions', 'Empresa de Fintech', '1234567890006', 'Fintech', 'Desarrollamos soluciones integrales para el sector tecnológico.', 'aprobado', 'UG-DFAP-0006-PPP', '2023-01-01', '2028-12-31', '0990000006', 'contacto@fintechsolutions.com'),
(21, 1, 'CyberSec EC', 'Empresa de Ciberseguridad', '1234567890007', 'Ciberseguridad', 'Desarrollamos soluciones integrales para el sector tecnológico.', 'aprobado', 'UG-DFAP-0007-PPP', '2023-01-01', '2028-12-31', '0990000007', 'contacto@cybersecec.com'),
(22, 1, 'Smart Code', 'Empresa de Desarrollo Web', '1234567890008', 'Desarrollo Web', 'Desarrollamos soluciones integrales para el sector tecnológico.', 'aprobado', 'UG-DFAP-0008-PPP', '2023-01-01', '2028-12-31', '0990000008', 'contacto@smartcode.com'),
(23, 1, 'Nexus Tech', 'Empresa de Sistemas Empresariales', '1234567890009', 'Sistemas Empresariales', 'Desarrollamos soluciones integrales para el sector tecnológico.', 'aprobado', 'UG-DFAP-0009-PPP', '2023-01-01', '2028-12-31', '0990000009', 'contacto@nexustech.com'),
(24, 1, 'Dev Masters', 'Empresa de Desarrollo Backend', '12345678900010', 'Desarrollo Backend', 'Desarrollamos soluciones integrales para el sector tecnológico.', 'aprobado', 'UG-DFAP-0010-PPP', '2023-01-01', '2028-12-31', '0990000010', 'contacto@devmasters.com'),
(25, 1, 'DataMind GYE', 'Empresa de Data Science', '12345678900011', 'Data Science', 'Especialistas en análisis de grandes volúmenes de datos.', 'aprobado', 'UG-DFAP-0011-PPP', '2023-05-15', '2028-05-15', '0990000011', 'contacto@datamindgye.com'),
(26, 1, 'AI Vision', 'Empresa de Inteligencia Artificial', '12345678900012', 'Inteligencia Artificial', 'Especialistas en análisis de grandes volúmenes de datos.', 'aprobado', 'UG-DFAP-0012-PPP', '2023-05-15', '2028-05-15', '0990000012', 'contacto@aivision.com'),
(27, 1, 'Metricas EC', 'Empresa de Big Data', '12345678900013', 'Big Data', 'Especialistas en análisis de grandes volúmenes de datos.', 'aprobado', 'UG-DFAP-0013-PPP', '2023-05-15', '2028-05-15', '0990000013', 'contacto@metricasec.com'),
(28, 2, 'InduProducción S.A.', 'Empresa de Manufactura', '12345678900014', 'Manufactura', 'Líderes en procesos industriales y logística a nivel nacional.', 'aprobado', 'UG-DFAP-0014-PPP', '2024-02-10', '2029-02-10', '0990000014', 'contacto@induproduccións.a..com'),
(29, 2, 'Logística Avanzada', 'Empresa de Logística Industrial', '12345678900015', 'Logística Industrial', 'Líderes en procesos industriales y logística a nivel nacional.', 'aprobado', 'UG-DFAP-0015-PPP', '2024-02-10', '2029-02-10', '0990000015', 'contacto@logísticaavanzada.com');
-- SUPERVISORES
INSERT INTO public.supervisores (institucion_id, numero_identificacion, nombre, apellido, correo, departamento, cargo, telefono) VALUES
(1, '0999999901', 'Supervisor 1', 'Apellido 1', 'sup1@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001101'),
(2, '0999999902', 'Supervisor 2', 'Apellido 2', 'sup2@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001102'),
(3, '0999999903', 'Supervisor 3', 'Apellido 3', 'sup3@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001103'),
(4, '0999999904', 'Supervisor 4', 'Apellido 4', 'sup4@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001104'),
(5, '0999999905', 'Supervisor 5', 'Apellido 5', 'sup5@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001105'),
(6, '0999999906', 'Supervisor 6', 'Apellido 6', 'sup6@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001106'),
(7, '0999999907', 'Supervisor 7', 'Apellido 7', 'sup7@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001107'),
(8, '0999999908', 'Supervisor 8', 'Apellido 8', 'sup8@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001108'),
(9, '0999999909', 'Supervisor 9', 'Apellido 9', 'sup9@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001109'),
(10, '0999999910', 'Supervisor 10', 'Apellido 10', 'sup10@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001110'),
(11, '0999999911', 'Supervisor 11', 'Apellido 11', 'sup11@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001111'),
(12, '0999999912', 'Supervisor 12', 'Apellido 12', 'sup12@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001112'),
(13, '0999999913', 'Supervisor 13', 'Apellido 13', 'sup13@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001113'),
(14, '0999999914', 'Supervisor 14', 'Apellido 14', 'sup14@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001114'),
(15, '0999999915', 'Supervisor 15', 'Apellido 15', 'sup15@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001115');
-- VACANTES
INSERT INTO public.vacantes (institucion_id, supervisor_id, titulo, area, descripcion, requisitos, modalidad, ubicacion, total_horas, horas_diarias, horario, cupos, fecha_expiracion) VALUES
(1, 1, 'Desarrollador Backend Junior', 'Tecnología', 'Buscamos un estudiante apasionado por el desarrollo backend para unirse a nuestro equipo. Trabajarás en proyectos reales aplicando metodologías ágiles.', '- Estudiante de 7mo semestre en adelante.
- Sólidos conocimientos en algoritmos y POO.
- Experiencia básica con bases de datos relacionales.
- Capacidad analítica y resolución de problemas.', 'Híbrido', 'Guayaquil', 240, 6, '08:00 a 14:00', 2, '2027-12-31'),
(2, 2, 'Desarrollador Backend Junior', 'Tecnología', 'Buscamos un estudiante apasionado por el desarrollo backend para unirse a nuestro equipo. Trabajarás en proyectos reales aplicando metodologías ágiles.', '- Estudiante de 7mo semestre en adelante.
- Sólidos conocimientos en algoritmos y POO.
- Experiencia básica con bases de datos relacionales.
- Capacidad analítica y resolución de problemas.', 'Híbrido', 'Guayaquil', 240, 6, '08:00 a 14:00', 2, '2027-12-31'),
(3, 3, 'Desarrollador Backend Junior', 'Tecnología', 'Buscamos un estudiante apasionado por el desarrollo backend para unirse a nuestro equipo. Trabajarás en proyectos reales aplicando metodologías ágiles.', '- Estudiante de 7mo semestre en adelante.
- Sólidos conocimientos en algoritmos y POO.
- Experiencia básica con bases de datos relacionales.
- Capacidad analítica y resolución de problemas.', 'Híbrido', 'Guayaquil', 240, 6, '08:00 a 14:00', 2, '2027-12-31'),
(4, 4, 'Desarrollador Backend Junior', 'Tecnología', 'Buscamos un estudiante apasionado por el desarrollo backend para unirse a nuestro equipo. Trabajarás en proyectos reales aplicando metodologías ágiles.', '- Estudiante de 7mo semestre en adelante.
- Sólidos conocimientos en algoritmos y POO.
- Experiencia básica con bases de datos relacionales.
- Capacidad analítica y resolución de problemas.', 'Híbrido', 'Guayaquil', 240, 6, '08:00 a 14:00', 2, '2027-12-31'),
(5, 5, 'Desarrollador Backend Junior', 'Tecnología', 'Buscamos un estudiante apasionado por el desarrollo backend para unirse a nuestro equipo. Trabajarás en proyectos reales aplicando metodologías ágiles.', '- Estudiante de 7mo semestre en adelante.
- Sólidos conocimientos en algoritmos y POO.
- Experiencia básica con bases de datos relacionales.
- Capacidad analítica y resolución de problemas.', 'Híbrido', 'Guayaquil', 240, 6, '08:00 a 14:00', 2, '2027-12-31'),
(6, 6, 'Desarrollador Backend Junior', 'Tecnología', 'Buscamos un estudiante apasionado por el desarrollo backend para unirse a nuestro equipo. Trabajarás en proyectos reales aplicando metodologías ágiles.', '- Estudiante de 7mo semestre en adelante.
- Sólidos conocimientos en algoritmos y POO.
- Experiencia básica con bases de datos relacionales.
- Capacidad analítica y resolución de problemas.', 'Híbrido', 'Guayaquil', 240, 6, '08:00 a 14:00', 2, '2027-12-31'),
(7, 7, 'Desarrollador Backend Junior', 'Tecnología', 'Buscamos un estudiante apasionado por el desarrollo backend para unirse a nuestro equipo. Trabajarás en proyectos reales aplicando metodologías ágiles.', '- Estudiante de 7mo semestre en adelante.
- Sólidos conocimientos en algoritmos y POO.
- Experiencia básica con bases de datos relacionales.
- Capacidad analítica y resolución de problemas.', 'Híbrido', 'Guayaquil', 240, 6, '08:00 a 14:00', 2, '2027-12-31'),
(8, 8, 'Desarrollador Backend Junior', 'Tecnología', 'Buscamos un estudiante apasionado por el desarrollo backend para unirse a nuestro equipo. Trabajarás en proyectos reales aplicando metodologías ágiles.', '- Estudiante de 7mo semestre en adelante.
- Sólidos conocimientos en algoritmos y POO.
- Experiencia básica con bases de datos relacionales.
- Capacidad analítica y resolución de problemas.', 'Híbrido', 'Guayaquil', 240, 6, '08:00 a 14:00', 2, '2027-12-31'),
(9, 9, 'Desarrollador Backend Junior', 'Tecnología', 'Buscamos un estudiante apasionado por el desarrollo backend para unirse a nuestro equipo. Trabajarás en proyectos reales aplicando metodologías ágiles.', '- Estudiante de 7mo semestre en adelante.
- Sólidos conocimientos en algoritmos y POO.
- Experiencia básica con bases de datos relacionales.
- Capacidad analítica y resolución de problemas.', 'Híbrido', 'Guayaquil', 240, 6, '08:00 a 14:00', 2, '2027-12-31'),
(10, 10, 'Desarrollador Backend Junior', 'Tecnología', 'Buscamos un estudiante apasionado por el desarrollo backend para unirse a nuestro equipo. Trabajarás en proyectos reales aplicando metodologías ágiles.', '- Estudiante de 7mo semestre en adelante.
- Sólidos conocimientos en algoritmos y POO.
- Experiencia básica con bases de datos relacionales.
- Capacidad analítica y resolución de problemas.', 'Híbrido', 'Guayaquil', 240, 6, '08:00 a 14:00', 2, '2027-12-31'),
(11, 11, 'Analista de Datos Junior', 'Data', 'Únete a nuestro equipo de análisis. Participarás en la limpieza, transformación y visualización de datos para la toma de decisiones estratégicas.', '- Conocimientos en Python (Pandas, Numpy).
- Entendimiento de estadística descriptiva.
- Manejo básico de herramientas de BI.', 'Remoto', 'Guayaquil', 240, 6, '09:00 a 15:00', 1, '2027-12-31'),
(12, 12, 'Analista de Datos Junior', 'Data', 'Únete a nuestro equipo de análisis. Participarás en la limpieza, transformación y visualización de datos para la toma de decisiones estratégicas.', '- Conocimientos en Python (Pandas, Numpy).
- Entendimiento de estadística descriptiva.
- Manejo básico de herramientas de BI.', 'Remoto', 'Guayaquil', 240, 6, '09:00 a 15:00', 1, '2027-12-31'),
(13, 13, 'Analista de Datos Junior', 'Data', 'Únete a nuestro equipo de análisis. Participarás en la limpieza, transformación y visualización de datos para la toma de decisiones estratégicas.', '- Conocimientos en Python (Pandas, Numpy).
- Entendimiento de estadística descriptiva.
- Manejo básico de herramientas de BI.', 'Remoto', 'Guayaquil', 240, 6, '09:00 a 15:00', 1, '2027-12-31'),
(14, 14, 'Pasante de Optimización de Procesos', 'Producción', 'Buscamos talento para nuestra área de mejora continua. Colaborarás en la identificación de cuellos de botella y aplicación de metodologías Lean.', '- Estudiante de últimos semestres de Ing. en Producción.
- Conocimientos teóricos de Lean Manufacturing.
- Manejo de Excel avanzado.
- Proactividad.', 'Presencial', 'Durán', 240, 6, '07:00 a 13:00', 2, '2027-12-31'),
(15, 15, 'Pasante de Optimización de Procesos', 'Producción', 'Buscamos talento para nuestra área de mejora continua. Colaborarás en la identificación de cuellos de botella y aplicación de metodologías Lean.', '- Estudiante de últimos semestres de Ing. en Producción.
- Conocimientos teóricos de Lean Manufacturing.
- Manejo de Excel avanzado.
- Proactividad.', 'Presencial', 'Durán', 240, 6, '07:00 a 13:00', 2, '2027-12-31');
-- HABILIDADES VACANTES
INSERT INTO public.habilidades_vacante (vacante_id, habilidad_id) VALUES
(1, 4), (1, 5), (1, 8),
(2, 4), (2, 5), (2, 8),
(3, 4), (3, 5), (3, 8),
(4, 4), (4, 5), (4, 8),
(5, 4), (5, 5), (5, 8),
(6, 4), (6, 5), (6, 8),
(7, 4), (7, 5), (7, 8),
(8, 4), (8, 5), (8, 8),
(9, 4), (9, 5), (9, 8),
(10, 4), (10, 5), (10, 8),
(11, 2), (11, 14), (11, 10),
(12, 2), (12, 14), (12, 10),
(13, 2), (13, 14), (13, 10),
(14, 9), (14, 33), (14, 19),
(15, 9), (15, 33), (15, 19);