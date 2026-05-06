-- ============================================
-- DATOS SEMILLA
-- Ejecutar despues de schema.sql
-- ============================================

-- ROLES
INSERT INTO public.roles (nombre, descripcion) VALUES 
    ('estudiante', 'Estudiante de la Carrera de Software'),
    ('empresa', 'Empresa o Institucion con convenio'),
    ('gestor', 'Gestor de practicas preprofesionales'),
    ('admin', 'Administrador tecnico del sistema');

-- FACULTADES
INSERT INTO public.facultades (nombre) VALUES
    ('CIENCIAS MATEMATICAS Y FISICAS');

-- CARRERAS
INSERT INTO public.carreras (facultad_id, nombre, codigo) VALUES
    (1, 'SOFTWARE', 'SW');

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

-- USUARIOS (password para todos: Test2026!)
INSERT INTO public.usuarios (cedula, login, contrasena, nombre, apellido, correo, telefono, rol_id) VALUES 
    ('0900000001', 'admin', '$2b$12$X3US6SxWUmtyHyDoYKQPO.xoNHkpgJYqhoOySCOgDbUEFPILInMFa', 'Admin', 'Sistema', 'admin@ug.edu.ec', '0999000000', 4),
    ('0955236773', 'bryan.galarza', '$2b$12$X3US6SxWUmtyHyDoYKQPO.xoNHkpgJYqhoOySCOgDbUEFPILInMFa', 'Bryan Guillermo', 'Galarza Indacochea', 'bryan.galarzaind@ug.edu.ec', '0998094515', 1),
    ('0942646266', 'naldo.anchundia', '$2b$12$X3US6SxWUmtyHyDoYKQPO.xoNHkpgJYqhoOySCOgDbUEFPILInMFa', 'Naldo Jonnel', 'Anchundia Caicedo', 'naldo.anchundiac@ug.edu.ec', '0990020956', 1),
    ('1312657255', 'jorge.intriago', '$2b$12$X3US6SxWUmtyHyDoYKQPO.xoNHkpgJYqhoOySCOgDbUEFPILInMFa', 'Jorge David', 'Intriago Loor', 'jorge.intriagoloo@ug.edu.ec', '0991111111', 1),
    ('0990123456', 'techsolutions', '$2b$12$X3US6SxWUmtyHyDoYKQPO.xoNHkpgJYqhoOySCOgDbUEFPILInMFa', 'Ana', 'Garcia', 'rrhh@techsolutionsgye.com', '0994567890', 2),
    ('0991234567', 'datamind', '$2b$12$X3US6SxWUmtyHyDoYKQPO.xoNHkpgJYqhoOySCOgDbUEFPILInMFa', 'Pedro', 'Sanchez', 'contacto@datamindgye.com', '0995678901', 2),
    ('0900000002', 'cesar.mero', '$2b$12$X3US6SxWUmtyHyDoYKQPO.xoNHkpgJYqhoOySCOgDbUEFPILInMFa', 'Cesar Andres', 'Mero Baquerizo', 'cesar.merob@ug.edu.ec', '0997777777', 3);

-- PERFILES DE ESTUDIANTE
INSERT INTO public.perfiles_estudiante (usuario_id, carrera_id, semestre, universidad, resumen_experiencia, intereses) VALUES 
    (2, 1, '8', 'Universidad de Guayaquil', 'Experiencia en desarrollo web con React y Flask. Proyectos academicos en analisis de datos y machine learning.', 'Desarrollo Web, Ciencia de Datos, IA'),
    (3, 1, '8', 'Universidad de Guayaquil', 'Conocimiento en desarrollo backend con Python y Django. Interes en arquitectura de software y DevOps.', 'Backend, Cloud Computing, Arquitectura'),
    (4, 1, '6', 'Universidad de Guayaquil', 'Estudiante de Ciencia de Datos e IA. Proyectos en machine learning y analisis estadistico.', 'Data Science, Machine Learning');

-- INSTITUCIONES
INSERT INTO public.instituciones (usuario_id, nombre, ruc, industria, descripcion, direccion, ciudad, correo_contacto, telefono, estado) VALUES 
    (5, 'TechSolutions GYE', '0990123456001', 'Tecnologia', 'Empresa de desarrollo de software y soluciones tecnologicas en Guayaquil. Especializada en desarrollo web, aplicaciones moviles y consultoria de sistemas.', 'Av. Francisco de Orellana, Edificio World Trade Center, Piso 8', 'Guayaquil', 'rrhh@techsolutionsgye.com', '042567890', 'aprobado'),
    (6, 'DataMind Ecuador', '0991234567001', 'Data Science', 'Consultoria en ciencia de datos e inteligencia artificial. Desarrollan modelos predictivos y dashboards de BI para empresas del sector financiero y retail.', 'Kennedy Norte, Av. Miguel H. Alcivar', 'Guayaquil', 'contacto@datamindgye.com', '042890123', 'aprobado');

-- SUPERVISORES
INSERT INTO public.supervisores (institucion_id, tipo_identificacion, numero_identificacion, nombre, correo, departamento, cargo, telefono, observacion) VALUES
    (1, 'Cedula', '0993456789', 'Maria Fernanda Lopez', 'maria.lopez@techsolutions.com', 'Desarrollo de Software', 'Lider Tecnico', '0994561234', 'Encargada del equipo de desarrollo web'),
    (1, 'Cedula', '0994567890', 'Roberto Carlos Mendoza', 'roberto.mendoza@techsolutions.com', 'Infraestructura', 'Jefe de DevOps', '0995672345', 'Responsable de CI/CD y cloud'),
    (2, 'Cedula', '0995678901', 'Andrea Paulina Vera', 'andrea.vera@datamind.com', 'Ciencia de Datos', 'Data Science Lead', '0996783456', 'Lidera proyectos de ML y analitica avanzada');

-- HABILIDADES DE ESTUDIANTES
INSERT INTO public.habilidades_estudiante (estudiante_id, habilidad_id, nivel) VALUES 
    (1, 3, 4), (1, 1, 4), (1, 2, 3), (1, 8, 3), (1, 21, 3), (1, 5, 3),
    (2, 2, 4), (2, 22, 3), (2, 16, 3), (2, 5, 3), (2, 8, 4),
    (3, 2, 4), (3, 13, 3), (3, 14, 4), (3, 5, 3), (3, 10, 4);

-- VACANTES
INSERT INTO public.vacantes (institucion_id, supervisor_id, titulo, area, descripcion, requisitos, modalidad, ubicacion, total_horas, horas_diarias, horario, cupos, activo, fecha_expiracion) VALUES 
    (1, 1, 'Practicante Desarrollo Frontend', 'Desarrollo Web', 
     'Buscamos estudiante para practicas en desarrollo frontend con React y TypeScript. Participara en el desarrollo de interfaces de usuario para aplicaciones web empresariales, trabajando con metodologias agiles y revisiones de codigo.',
     'Estudiante de Ing. en Software (7mo semestre o superior). Conocimiento en React y Git. Deseable experiencia con TypeScript.',
     'Hibrido', 'Guayaquil', 240, 6, 'Lunes a Viernes 08:00-14:00', 2, true, '2026-08-01'),
    (1, 2, 'Practicante Backend Python', 'Desarrollo Backend', 
     'Practicas en desarrollo backend con Python/Flask y PostgreSQL. El practicante colaborara en el diseno e implementacion de APIs REST, integracion con servicios externos y optimizacion de consultas SQL.',
     'Conocimiento en Python, Flask y SQL. Deseable experiencia con APIs REST y Docker.',
     'Remoto', 'Remoto', 240, 5, 'Lunes a Viernes, horario flexible', 1, true, '2026-09-15'),
    (2, 3, 'Practicante Analisis de Datos', 'Data Science', 
     'Practicas en analisis de datos con Python y herramientas de BI. El practicante participara en la exploracion de datos, creacion de dashboards y desarrollo de modelos predictivos basicos.',
     'Conocimiento en Python, SQL, Excel/Power BI. Interes en machine learning. Nivel basico de estadistica.',
     'Presencial', 'Guayaquil', 144, 4, 'Lunes a Viernes 09:00-13:00', 3, true, '2026-07-28');

-- HABILIDADES DE VACANTES
INSERT INTO public.habilidades_vacante (vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES 
    (1, 3, 3, false), (1, 1, 3, false), (1, 7, 2, true), (1, 8, 2, false),
    (2, 2, 3, false), (2, 21, 3, false), (2, 5, 3, false), (2, 16, 2, true),
    (3, 2, 3, false), (3, 14, 3, false), (3, 13, 2, true), (3, 5, 3, false), (3, 10, 2, true);

-- POSTULACIONES
INSERT INTO public.postulaciones (estudiante_id, vacante_id, estado, porcentaje_afinidad) VALUES 
    (1, 1, 'pendiente', 92.5),
    (1, 2, 'aceptada_empresa', 85.0),
    (3, 3, 'pendiente', 88.3);

