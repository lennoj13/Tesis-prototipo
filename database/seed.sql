-- ============================================
-- DATOS SEMILLA
TRUNCATE TABLE
    public.postulaciones,
    public.habilidades_vacante,
    public.vacantes,
    public.habilidades_estudiante,
    public.supervisores,
    public.instituciones,
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
    ('estudiante', 'Estudiante de la Carrera de Software'),
    ('empresa', 'Empresa o Institución con convenio'),
    ('gestor', 'Gestor de practicas preprofesionales'),
    ('admin', 'Administrador tecnico del sistema');

-- FACULTADES
INSERT INTO public.facultades (nombre) VALUES
    ('CIENCIAS MATEMATICAS Y FISICAS');

-- CARRERAS
INSERT INTO public.carreras (facultad_id, nombre, codigo) VALUES
    (1, 'SOFTWARE', 'SOF');

-- HABILIDADES
INSERT INTO public.habilidades (nombre, categoria) VALUES 
    ('JavaScript', 'Programacion'),
    ('Python', 'Programacion'),
    ('React', 'Frontend'),
    ('Node.js', 'Backend'),
    ('SQL', 'Base de Datos'),
    ('Java', 'Programacion'),
    ('TypeScript', 'Programacion'),
    ('Git', 'Herramientas'),
    ('Excel', 'Herramientas'),
    ('Power BI', 'Analisis'),
    ('Figma', 'Diseno'),
    ('Adobe XD', 'Diseno'),
    ('Machine Learning', 'IA'),
    ('Data Analysis', 'Analisis'),
    ('AWS', 'Cloud'),
    ('Docker', 'DevOps'),
    ('Ingles', 'Idiomas'),
    ('Liderazgo', 'Soft Skills'),
    ('Trabajo en equipo', 'Soft Skills'),
    ('Comunicacion', 'Soft Skills'),
    ('Flask', 'Backend'),
    ('Django', 'Backend'),
    ('C#', 'Programacion'),
    ('.NET', 'Backend'),
    ('PHP', 'Programacion'),
    ('Laravel', 'Backend'),
    ('Angular', 'Frontend'),
    ('Vue.js', 'Frontend'),
    ('PostgreSQL', 'Base de Datos'),
    ('MongoDB', 'Base de Datos');

-- USUARIOS (password para todos: Prueba123.)
INSERT INTO public.usuarios (cedula, login, contrasena, nombre, apellido, correo, telefono, rol_id) VALUES 
    -- 1 Admin (usuario_id = 1)
    ('0900000001', 'admin', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Admin', 'Sistema', 'admin@ug.edu.ec', '0999000000', 4),
    -- 2 Gestores (usuario_id = 2, 3) 
    ('0900000002', 'marta.diaz', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Marta', 'Diaz', 'marta.diaz@ug.edu.ec', '0997777771', 3),
    ('0900000003', 'carlos.ruiz', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Carlos Eduardo', 'Ruiz', 'carlos.ruiz@ug.edu.ec', '0997777772', 3),
    -- 10 Estudiantes (usuario_id = 4 to 13)
    -- Los estudiantes originales:
    ('0955236773', 'bryan.galarza', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Bryan Guillermo', 'Galarza Indacochea', 'bryan.galarzaind@ug.edu.ec', '0998094515', 1),
    ('0942646266', 'naldo.anchundia', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Naldo Jonnel', 'Anchundia Caicedo', 'naldo.anchundiac@ug.edu.ec', '0990020956', 1),
    ('1312657255', 'jorge.intriago', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Jorge David', 'Intriago Loor', 'jorge.intriagoloo@ug.edu.ec', '0991111111', 1),
    -- Los 7 estudiantes nuevos con login igual a cedula y nombres reales:
    ('0911223344', '0911223344', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Maria Fernanda', 'Gomez Silva', 'maria.gomez@ug.edu.ec', '0991122334', 1),
    ('0922334455', '0922334455', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Luis Antonio', 'Perez Castro', 'luis.perez@ug.edu.ec', '0992233445', 1),
    ('0933445566', '0933445566', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Ana Sofia', 'Martinez Vera', 'ana.martinez@ug.edu.ec', '0993344556', 1),
    ('0944556677', '0944556677', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Pedro Jose', 'Castro Mendoza', 'pedro.castro@ug.edu.ec', '0994455667', 1),
    ('0955667788', '0955667788', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Gabriela Elena', 'Vera Loor', 'gabriela.vera@ug.edu.ec', '0995566778', 1),
    ('0966778899', '0966778899', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Carlos Alberto', 'Mora Sanchez', 'carlos.mora@ug.edu.ec', '0996677889', 1),
    ('0977889900', '0977889900', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Diana Carolina', 'Silva Torres', 'diana.silva@ug.edu.ec', '0997788990', 1),
    -- 10 Empresas (usuario_id = 14 to 23)
    ('0990123456', 'techsolutions', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Ana', 'Garcia', 'rrhh@techsolutionsgye.com', '0994567890', 2),
    ('0991234567', 'datamind', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Pedro', 'Sanchez', 'contacto@datamindgye.com', '0995678901', 2),
    ('0992345678', 'innovasoft', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Luis', 'Fernandez', 'rrhh@innovasoft.com', '0996789012', 2),
    ('0993456789', 'nexustech', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Carla', 'Ruiz', 'rrhh@nexustech.com', '0997890123', 2),
    ('0994567890', 'globalsystems', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Jorge', 'Moreno', 'rrhh@globalsystems.com', '0998901234', 2),
    ('0995678901', 'smartcode', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Elena', 'Vargas', 'rrhh@smartcode.com', '0999012345', 2),
    ('0996789012', 'clouddevs', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Andres', 'Rojas', 'rrhh@clouddevs.com', '0990123456', 2),
    ('0997890123', 'fintechsol', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Sofia', 'Mendoza', 'rrhh@fintechsolutions.com', '0991234567', 2),
    ('0998901234', 'appworks', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Mario', 'Castro', 'rrhh@appworks.com', '0992345678', 2),
    ('0999012345', 'cybersecurity', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Laura', 'Guzman', 'rrhh@cybersecurityec.com', '0993456789', 2);

-- PERFILES DE ESTUDIANTE (carrera_id = 1 -> SOFTWARE)
INSERT INTO public.perfiles_estudiante (usuario_id, carrera_id, semestre, universidad, resumen_experiencia, intereses) VALUES 
    (4, 1, '8', 'Universidad de Guayaquil', 'Experiencia en desarrollo web con React y Flask.', 'Desarrollo Web, Ciencia de Datos, IA'),
    (5, 1, '8', 'Universidad de Guayaquil', 'Conocimiento en desarrollo backend con Python y Django.', 'Backend, Cloud Computing, Arquitectura'),
    (6, 1, '6', 'Universidad de Guayaquil', 'Estudiante de Ciencia de Datos e IA.', 'Data Science, Machine Learning'),
    (7, 1, '7', 'Universidad de Guayaquil', 'Apasionada por frontend y diseño de interfaces.', 'Frontend, UX/UI'),
    (8, 1, '8', 'Universidad de Guayaquil', 'Experiencia en bases de datos relacionales y NoSQL.', 'Bases de Datos, SQL'),
    (9, 1, '9', 'Universidad de Guayaquil', 'Desarrolladora fullstack junior con Node.js.', 'Fullstack, DevOps'),
    (10, 1, '7', 'Universidad de Guayaquil', 'Conocimientos de cloud computing y arquitecturas serverless.', 'AWS, Cloud'),
    (11, 1, '8', 'Universidad de Guayaquil', 'Interés en ciberseguridad y pentesting.', 'Seguridad, Redes'),
    (12, 1, '9', 'Universidad de Guayaquil', 'Experiencia en aplicaciones móviles con React Native.', 'Mobile, Frontend'),
    (13, 1, '6', 'Universidad de Guayaquil', 'Aprendiendo inteligencia artificial y análisis de datos.', 'Machine Learning, Analítica');

-- INSTITUCIONES (IDs: 1 to 10 for usuarios 14 to 23)
INSERT INTO public.instituciones (usuario_id, nombre, ruc, industria, descripcion, direccion, ciudad, correo_contacto, telefono, estado) VALUES 
    (14, 'TechSolutions GYE', '0990123456001', 'Tecnologia', 'Empresa de desarrollo de software y soluciones tecnologicas.', 'Av. Francisco de Orellana', 'Guayaquil', 'rrhh@techsolutionsgye.com', '042567890', 'aprobado'),
    (15, 'DataMind Ecuador', '0991234567001', 'Data Science', 'Consultoria en ciencia de datos e inteligencia artificial.', 'Kennedy Norte', 'Guayaquil', 'contacto@datamindgye.com', '042890123', 'aprobado'),
    (16, 'InnovaSoft SA', '0992345678001', 'Desarrollo Web', 'Agencia digital especializada en e-commerce.', 'Urdesa Central', 'Guayaquil', 'contacto@innovasoft.com', '042345678', 'aprobado'),
    (17, 'NexusTech', '0993456789001', 'Telecomunicaciones', 'Servicios de infraestructura IT y redes.', 'Centro de Guayaquil', 'Guayaquil', 'info@nexustech.com', '042456789', 'aprobado'),
    (18, 'Global Systems', '0994567890001', 'Sistemas Empresariales', 'Implementación de ERPs y CRMs.', 'Samanes', 'Guayaquil', 'rrhh@globalsystems.com', '042567891', 'aprobado'),
    (19, 'SmartCode', '0995678901001', 'Software a Medida', 'Desarrollo de software a medida para pymes.', 'Los Ceibos', 'Guayaquil', 'hola@smartcode.com', '042678902', 'aprobado'),
    (20, 'CloudDevs', '0996789012001', 'Cloud Computing', 'Consultoría y migraciones a AWS y Azure.', 'Alborada', 'Guayaquil', 'talento@clouddevs.com', '042789013', 'aprobado'),
    (21, 'FinTech Solutions', '0997890123001', 'Finanzas', 'Desarrollo de plataformas financieras y pasarelas de pago.', 'Samborondón', 'Guayaquil', 'empleos@fintechsolutions.com', '042890124', 'aprobado'),
    (22, 'AppWorks', '0998901234001', 'Mobile', 'Fábrica de aplicaciones móviles iOS y Android.', 'Urdesa Norte', 'Guayaquil', 'jobs@appworks.com', '042901235', 'aprobado'),
    (23, 'CyberSecurity Ec', '0999012345001', 'Ciberseguridad', 'Auditorías de seguridad e implementación de ISO 27001.', 'Vía a la Costa', 'Guayaquil', 'contacto@cybersecurityec.com', '042012346', 'aprobado');

-- SUPERVISORES (institucion_id 1 to 10)
INSERT INTO public.supervisores (institucion_id, tipo_identificacion, numero_identificacion, nombre, correo, departamento, cargo, telefono, observacion) VALUES
    (1, 'Cedula', '0993456789', 'Maria Fernanda Lopez', 'maria.lopez@techsolutions.com', 'Desarrollo', 'Lider Tecnico', '0994561234', 'Encargada del equipo web'),
    (2, 'Cedula', '0994567890', 'Roberto Carlos Mendoza', 'roberto.mendoza@datamind.com', 'Ciencia de Datos', 'Data Science Lead', '0995672345', 'Lidera proyectos de ML'),
    (3, 'Cedula', '0995678901', 'Andrea Paulina Vera', 'andrea.vera@innovasoft.com', 'Proyectos', 'Project Manager', '0996783456', 'Supervisa desarrollos'),
    (4, 'Cedula', '0996789012', 'Juan Perez', 'juan.perez@nexustech.com', 'Sistemas', 'Jefe de Infraestructura', '0997894567', 'Asigna tareas a pasantes'),
    (5, 'Cedula', '0997890123', 'Diana Morales', 'diana.morales@globalsystems.com', 'Consultoría', 'Senior Consultant', '0998905678', 'Encargada de ERPs'),
    (6, 'Cedula', '0998901234', 'Luis Torres', 'luis.torres@smartcode.com', 'Desarrollo', 'Tech Lead', '0999016789', 'Revisa PRs y código'),
    (7, 'Cedula', '0999012345', 'Camila Ortiz', 'camila.ortiz@clouddevs.com', 'Cloud', 'Cloud Architect', '0990127890', 'Guía en AWS'),
    (8, 'Cedula', '0990123456', 'Victor Hugo Ruiz', 'victor.ruiz@fintechsolutions.com', 'Ingeniería', 'Engineering Manager', '0991238901', 'Supervisa área técnica'),
    (9, 'Cedula', '0991234567', 'Patricia Silva', 'patricia.silva@appworks.com', 'Mobile', 'Lead Android Dev', '0992349012', 'Supervisa apps móviles'),
    (10, 'Cedula', '0992345678', 'Esteban Alvarado', 'esteban.alvarado@cybersecurityec.com', 'Seguridad', 'CISO', '0993450123', 'Dirige área de seguridad');

-- HABILIDADES DE ESTUDIANTES (estudiante_id = perfiles_estudiante.id = 1 to 10)
INSERT INTO public.habilidades_estudiante (estudiante_id, habilidad_id, nivel) VALUES 
    (1, 3, 4), (1, 1, 4),
    (2, 2, 4), (2, 4, 3),
    (3, 2, 4), (3, 13, 3),
    (4, 25, 4), (4, 1, 3),
    (5, 5, 4), (5, 29, 3),
    (6, 26, 4), (6, 4, 3),
    (7, 15, 3), (7, 3, 4),
    (8, 17, 3), (8, 20, 4),
    (9, 6, 3), (9, 23, 3),
    (10, 13, 4), (10, 14, 4);

-- VACANTES (10 vacantes, 1 por empresa)
INSERT INTO public.vacantes (institucion_id, supervisor_id, titulo, area, descripcion, requisitos, modalidad, ubicacion, total_horas, horas_diarias, horario, cupos, activo, fecha_expiracion) VALUES 
    (1, 1, 'Practicante Desarrollo Frontend', 'Desarrollo Web', 'Buscamos estudiante para practicas en desarrollo frontend con React y TypeScript.', 'Estudiante de Ing. en Software (7mo semestre o superior). Conocimiento en React.', 'Hibrido', 'Guayaquil', 240, 6, 'Lunes a Viernes', 2, true, '2026-08-01'),
    (2, 2, 'Practicante Analisis de Datos', 'Data Science', 'Practicas en analisis de datos con Python y herramientas de BI.', 'Conocimiento en Python, SQL. Interes en machine learning.', 'Presencial', 'Guayaquil', 144, 4, 'Lunes a Viernes 09:00-13:00', 3, true, '2026-07-28'),
    (3, 3, 'Practicante Fullstack', 'Desarrollo Web', 'Apoyo en desarrollo de módulos de e-commerce.', 'React, Node.js y bases de datos.', 'Remoto', 'Remoto', 240, 6, 'Lunes a Viernes', 1, true, '2026-08-15'),
    (4, 4, 'Practicante de Redes', 'Infraestructura', 'Configuración de equipos de red y soporte N1.', 'Conocimientos de redes y sistemas operativos.', 'Presencial', 'Guayaquil', 240, 8, 'Lunes a Viernes', 2, true, '2026-09-01'),
    (5, 5, 'Pasante Consultoría ERP', 'Sistemas', 'Apoyo en levantamiento de requerimientos e implementación.', 'Habilidades analíticas y SQL básico.', 'Hibrido', 'Guayaquil', 240, 6, 'Lunes a Viernes', 1, true, '2026-08-30'),
    (6, 6, 'Practicante Backend .NET', 'Desarrollo Backend', 'Desarrollo de microservicios con C# y .NET.', 'Conocimientos de C# y SQL Server.', 'Remoto', 'Remoto', 240, 6, 'Lunes a Viernes', 2, true, '2026-08-10'),
    (7, 7, 'Practicante DevOps Jr.', 'Cloud', 'Apoyo en automatización y despliegues en AWS.', 'Conocimientos básicos de AWS, Linux y scripting.', 'Hibrido', 'Guayaquil', 240, 6, 'Lunes a Viernes', 1, true, '2026-09-15'),
    (8, 8, 'Desarrollador Junior FinTech', 'Ingeniería', 'Mantenimiento de pasarelas de pago.', 'Python o Java, conocimiento de APIs REST.', 'Remoto', 'Remoto', 240, 6, 'Lunes a Viernes', 2, true, '2026-08-20'),
    (9, 9, 'Practicante Android', 'Mobile', 'Desarrollo de nuevas features en app nativa.', 'Kotlin o Java para Android.', 'Presencial', 'Guayaquil', 240, 6, 'Lunes a Viernes', 1, true, '2026-08-25'),
    (10, 10, 'Analista de Seguridad Jr.', 'Ciberseguridad', 'Apoyo en pruebas de vulnerabilidad y reportes.', 'Conocimientos en redes, Linux y herramientas de pentesting.', 'Hibrido', 'Guayaquil', 240, 6, 'Lunes a Viernes', 1, true, '2026-09-05');

-- HABILIDADES DE VACANTES
INSERT INTO public.habilidades_vacante (vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES 
    (1, 3, 3, false),
    (2, 4, 3, false),
    (3, 25, 3, false),
    (4, 14, 3, false),
    (5, 13, 3, false),
    (6, 16, 3, false),
    (7, 1, 3, false),
    (8, 2, 3, false),
    (9, 29, 3, false),
    (10, 26, 3, false);

-- POSTULACIONES
INSERT INTO public.postulaciones (estudiante_id, vacante_id, estado, porcentaje_afinidad) VALUES 
    (1, 1, 'pendiente', 90.0),
    (2, 2, 'pendiente', 90.0),
    (3, 3, 'pendiente', 90.0),
    (4, 4, 'pendiente', 90.0),
    (5, 5, 'pendiente', 90.0),
    (6, 6, 'pendiente', 90.0),
    (7, 7, 'pendiente', 90.0),
    (8, 8, 'pendiente', 90.0),
    (9, 9, 'pendiente', 90.0),
    (10, 10, 'pendiente', 90.0);
