-- ============================================
-- DATOS SEMILLA
-- Ejecutar después de schema.sql
-- ============================================

-- ROLES
INSERT INTO public.roles (name) VALUES 
    ('student'),
    ('company'),
    ('admin')
ON CONFLICT (name) DO NOTHING;

-- HABILIDADES
INSERT INTO public.skills (name, category) VALUES 
    ('JavaScript', 'Programación'),
    ('Python', 'Programación'),
    ('React', 'Frontend'),
    ('Node.js', 'Backend'),
    ('SQL', 'Base de Datos'),
    ('Java', 'Programación'),
    ('TypeScript', 'Programación'),
    ('Git', 'Herramientas'),
    ('Excel', 'Herramientas'),
    ('Power BI', 'Análisis'),
    ('Figma', 'Diseño'),
    ('Adobe XD', 'Diseño'),
    ('Machine Learning', 'IA'),
    ('Data Analysis', 'Análisis'),
    ('AWS', 'Cloud'),
    ('Docker', 'DevOps'),
    ('Inglés', 'Idiomas'),
    ('Liderazgo', 'Soft Skills'),
    ('Trabajo en equipo', 'Soft Skills'),
    ('Comunicación', 'Soft Skills'),
    ('Flask', 'Backend'),
    ('Django', 'Backend'),
    ('C#', 'Programación'),
    ('.NET', 'Backend'),
    ('PHP', 'Programación'),
    ('Laravel', 'Backend'),
    ('Angular', 'Frontend'),
    ('Vue.js', 'Frontend'),
    ('PostgreSQL', 'Base de Datos'),
    ('MongoDB', 'Base de Datos')
ON CONFLICT (name) DO NOTHING;

-- USUARIOS DE PRUEBA (password para todos: Test2026!)
-- Hash bcrypt válido para Test2026!
INSERT INTO public.users (login, password, name, lastname, email, phone, role_id) VALUES 
    ('admin', '$2b$12$mJ6sG/hxsat0pSQ4g4nWne5hCDCmA6BzlaWiUEje03iUxNvH4qore', 'Admin', 'Sistema', 'admin@ug.edu.ec', '0999000000', 3),
    ('carlos.mendoza', '$2b$12$mJ6sG/hxsat0pSQ4g4nWne5hCDCmA6BzlaWiUEje03iUxNvH4qore', 'Carlos', 'Mendoza', 'carlos.mendoza@ug.edu.ec', '0998094515', 1),
    ('maria.lopez', '$2b$12$mJ6sG/hxsat0pSQ4g4nWne5hCDCmA6BzlaWiUEje03iUxNvH4qore', 'María', 'López', 'maria.lopezr@ug.edu.ec', '0991234567', 1),
    ('techsolutions', '$2b$12$mJ6sG/hxsat0pSQ4g4nWne5hCDCmA6BzlaWiUEje03iUxNvH4qore', 'Ana', 'García', 'rrhh@techsolutionsgye.com', '0994567890', 2),
    ('datamind', '$2b$12$mJ6sG/hxsat0pSQ4g4nWne5hCDCmA6BzlaWiUEje03iUxNvH4qore', 'Pedro', 'Sánchez', 'contacto@datamindgye.com', '0995678901', 2)
ON CONFLICT (login) DO NOTHING;

-- PERFILES DE ESTUDIANTE
INSERT INTO public.student_profiles (user_id, career, semester, university, experience_summary, interests) VALUES 
    (2, 'Ingeniería en Software', '8vo semestre', 'Universidad de Guayaquil', 'Experiencia en desarrollo web con React y Flask. Proyectos académicos en análisis de datos y machine learning.', 'Desarrollo Web, Ciencia de Datos'),
    (3, 'Ingeniería en Sistemas Computacionales', '7mo semestre', 'Universidad de Guayaquil', 'Conocimiento en redes y telecomunicaciones. Certificación CCNA en progreso.', 'Redes, Cloud Computing')
ON CONFLICT (user_id) DO NOTHING;

-- PERFILES DE EMPRESA
INSERT INTO public.company_profiles (user_id, company_name, ruc, industry, description, location, contact_email, status) VALUES 
    (4, 'TechSolutions GYE', '0990123456001', 'Tecnología', 'Empresa de desarrollo de software y soluciones tecnológicas en Guayaquil.', 'Guayaquil, Ecuador', 'rrhh@techsolutionsgye.com', 'approved'),
    (5, 'DataMind Ecuador', '0991234567001', 'Data Science', 'Consultoría en ciencia de datos e inteligencia artificial.', 'Guayaquil, Ecuador', 'contacto@datamindgye.com', 'approved')
ON CONFLICT (user_id) DO NOTHING;

-- HABILIDADES DE ESTUDIANTES
INSERT INTO public.student_skills (student_id, skill_id, level) VALUES 
    (1, 3, 4), (1, 1, 4), (1, 2, 3), (1, 8, 3), (1, 21, 3), (1, 5, 3),
    (2, 2, 4), (2, 14, 4), (2, 13, 3), (2, 5, 3), (2, 9, 4)
ON CONFLICT (student_id, skill_id) DO NOTHING;

-- VACANTES
INSERT INTO public.vacancies (company_id, title, area, description, requirements, modality, location, slots, is_active, expires_at) VALUES 
    (1, 'Practicante Desarrollo Frontend', 'Desarrollo Web', 'Buscamos estudiante para prácticas en desarrollo frontend con React y TypeScript.', 'Estudiante de Ing. en Software (7mo semestre o superior). Conocimiento en React y Git.', 'Híbrido', 'Guayaquil', 2, true, '2026-04-01'),
    (1, 'Practicante Backend Python', 'Desarrollo Backend', 'Prácticas en desarrollo backend con Python/Flask y PostgreSQL.', 'Conocimiento en Python, Flask y SQL. Deseable experiencia con APIs REST.', 'Remoto', 'Remoto', 1, true, '2026-04-15'),
    (2, 'Practicante Análisis de Datos', 'Data Science', 'Prácticas en análisis de datos con Python y herramientas de BI.', 'Conocimiento en Python, SQL, Excel/Power BI. Interés en machine learning.', 'Presencial', 'Guayaquil', 3, true, '2026-03-28');

-- HABILIDADES DE VACANTES
INSERT INTO public.vacancy_skills (vacancy_id, skill_id, required_level, is_optional) VALUES 
    (1, 3, 3, false), (1, 1, 3, false), (1, 7, 2, true), (1, 8, 2, false),
    (2, 2, 3, false), (2, 21, 3, false), (2, 5, 3, false), (2, 16, 2, true),
    (3, 2, 3, false), (3, 14, 3, false), (3, 13, 2, true), (3, 5, 3, false), (3, 9, 2, true)
ON CONFLICT (vacancy_id, skill_id) DO NOTHING;

-- POSTULACIONES DE EJEMPLO
INSERT INTO public.applications (student_id, vacancy_id, status, match_percentage) VALUES 
    (1, 1, 'pending', 92.5),
    (1, 2, 'approved', 85.0),
    (2, 3, 'pending', 88.3)
ON CONFLICT (student_id, vacancy_id) DO NOTHING;

-- NOTIFICACIONES DE EJEMPLO
INSERT INTO public.notifications (user_id, type, title, message, is_read) VALUES 
    (2, 'vacancy', 'Nueva vacante compatible', '"Practicante Desarrollo Frontend" en TechSolutions GYE tiene 92% de afinidad con tu perfil', false),
    (2, 'application', 'Postulación aprobada', 'Tu postulación a "Practicante Backend Python" en TechSolutions GYE ha sido aceptada', false),
    (4, 'applicant', 'Nuevo postulante', 'Carlos Mendoza se postuló a "Practicante Desarrollo Frontend"', false),
    (4, 'matching', 'Afinidad alta detectada', 'Carlos Mendoza tiene un 92% de afinidad con "Practicante Desarrollo Frontend"', true);
