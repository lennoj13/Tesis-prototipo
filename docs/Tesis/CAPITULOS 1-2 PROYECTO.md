![ref1]

**UNIVERSIDAD DE GUAYAQUIL** 

FACULTAD DE CIENCIAS MATEMÁTICAS Y FÍSICAS CARRERA DE SOFTWARE

PLATAFORMA WEB DE MATCHING BIDIRECCIONAL PARA  PRÁCTICAS PREPROFESIONALES BASADO  

EN TÉCNICAS NLP Y MODELOS DE 

SIMILITUD SEMÁNTICA. 

**PROYECTO DE TITULACIÓN**  

Previa a la obtención del Título de:  

**INGENIERO EN SOFTWARE** 

**AUTORES:** 

ANCHUNDIA CAICEDO NALDO JONNEL \
GALARZA INDACOCHEA BRYAN GUILLERMO 

**TUTOR:**  

ING. JOSÉ ABEL ALARCÓN 

GUAYAQUIL – ECUADOR 2026 

6 
|![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.002.png)|||
| - | :- | :- |
|**REPOSITORIO NACIONAL EN CIENCIAS Y TECNOLOGÍAS** |||
|<a name="_page1_x73.00_y179.92"></a>**FICHA DE REGISTRO DE TRABAJO DE TITULACIÓN** |||
|**TÍTULO:** *“Plataforma web de matching bidireccional para prácticas preprofesionales basado en técnicas NLP y modelos de similitud semántica.”*** |||
|<p>**AUTOR(ES):**  </p><p>Bryan Guillermo Galarza Indacochea Naldo Jonnel Anchundia Caicedo** </p>|<p>**REVISOR(A):** </p><p>Nombres y apellidos del (la) docente revisor(a)** </p>||
|**INSTITUCIÓN:  Universidad de Guayaquil** |**FACULTAD:** **Ciencias Matemáticas y Físicas** ||
|**CARRERA:**  Software** |||
|**FECHA DE PUBLICACIÓN:**  |**N° DE PAGS:** 999** ||
|**AREA TEMÁTICA:** *Aplicación web, Desarrollo de Software.*** |||
|**PALABRAS CLAVES:** M*atching, Plataforma web, NLP, practicas preprofesionales, similitud semántica.*** |||
|**RESUMEN:** *(Colocar el mismo resumen y palabras clave colocados en la sección del trabajo de titulación que corresponde a “RESUMEN”)*  |||
|**N° DE REGISTRO:** |**N° DE CLASIFICACIÓN:**                                        ||
|**DIRECCIÓN URL: (PROYECTO DE TITULACION EN LA WEB)** |||
|**ADJUNTO PDF** |<p>**SI  ![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.003.png)**</p><p>x </p>|**NO ![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.004.png)**|
|**CONTACTO CON AUTOR(ES):** Bryan Guillermo Galarza Indacochea Naldo Jonnel Anchundia Caicedo** |**Teléfono:** 0998094515 0990020956** |**Email: [bryan.galarzaind@ug.edu.ec ](mailto:bryan.galarzaind@ug.edu.ec)[naldo.anchundiac@ug.edu.ec ](mailto:naldo.anchundiac@ug.edu.ec)** |
|**CONTACTO DE LA INSTITUCIÓN** |**Nombre:** Ab. Juan Chávez Atocha** ||
||**Teléfono:** 2307729** ||
||**Email:** juan.chaveza@ug.edu.ec** ||

<a name="_page2_x69.00_y72.92"></a>**APROBACIÓN DEL TUTOR** 

En mi calidad de Tutor(a) del Trabajo de Titulación, “PLATAFORMA DE MATCHING BIDIRECCIONAL PARA PRÁCTICAS PREPROFESIONALES BASADO EN TÉCNICAS NLP  Y  MODELOS  DE  SIMILITUD  SEMÁNTICA.,  elaborados  por  los  Sres.  BRYAN GUILLERMO GALARZA INDACOCHEA y NALDO JONNEL ANCHUNDIA CAICEDO, **estudiantes no titulados** de la Carrera de Software, Facultad de Ciencias Matemáticas y Físicas de la Universidad de Guayaquil, previo a la obtención del Título de Ingeniero en Software, me permito declarar que luego de haber orientado, estudiado y revisado, la **apruebo** en todas sus partes. 

**Atentamente,** 

Ing. José Abel Alarcón.     

**TUTOR** 

<a name="_page3_x69.00_y99.92"></a>**DEDICATORIA** 

Este trabajo se lo dedico a mis padres por ser  mi  pilar  durante  toda  mi  etapa universitaria y a mis amigos y familiares que  me  apoyaron  siempre  que  lo necesitaba  y  me  motivaban  con  sus palabras de aliento. 

`  `*Bryan Guillermo Galarza Indacochea* 

Dedico este trabajo a mis padres, por su apoyo incondicional desde el inicio de esta carrera; a mi hermana, por su compañía y apoyo  constante;  a  mis  amigos,  por  su ánimo y motivación; a Noelia, quien en los momentos  en  que  quise  rendirme  me brindó su apoyo para seguir adelante; y a Melanie, quien en un momento importante de  mi  vida  fue  una  fortaleza  y  un  gran apoyo. 

*Naldo Jonnel Anchundia Caicedo* 

<a name="_page4_x69.00_y99.92"></a>**AGRADECIMIENTO** 

Agradezco  a  mi  familia,  a  mis compañeros y a cada uno de los docentes que  fueron  una  guía  durante  todo  este trayecto,  pero  sobre  todo  agradezco  a Dios por darme fuerzas para no rendirme. 

*Bryan Guillermo Galarza Indacochea* 

Agradezco a Dios por darme la fortaleza para  culminar  este  proyecto  y  a  mi familia, por su apoyo y acompañamiento durante todo este proceso. 

*Naldo Jonnel Anchundia Caicedo* 

<a name="_page5_x69.00_y85.92"></a>**TRIBUNAL PROYECTO DE TITULACIÓN** 



Ing. Douglas Iturburu Salvador, M.Sc. ![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.005.png)DECANO DE LA FACULTAD \
CIENCIAS MATEMÁTICAS Y FÍSICAS ![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.006.png)

Nombres y Apellidos \
PROFESOR(A) TUTOR(A) DEL PROYECTO 

DE TITULACIÓN 

Ing. Leili López Dominguez, Msc. DIRECTOR DE LA CARRERA DE INGENIERÍA EN SISTEMAS       COMPUTACIONALES 

Nombre y Apellidos \
![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.007.png)![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.008.png)PROFESOR(A) REVISOR(A) DEL PROYECTO 

DE TITULACIÓN 



Ab. Juan Chávez Atocha, Esp. ![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.009.png)SECRETARIO 

26 

<a name="_page6_x69.00_y114.00"></a>**DECLARACIÓN EXPRESA** 

“La  responsabilidad  del  contenido  de  este  Proyecto  de Titulación, me corresponden exclusivamente; y el patrimonio intelectual  de  la  misma  a  la  UNIVERSIDAD  DE GUAYAQUIL”. 

Bryan Guillermo Galarza Indacochea Naldo Jonnel Anchundia Caicedo 

![ref2]

<a name="_page7_x69.00_y152.00"></a>**CESIÓN DE DERECHOS DE AUTOR** 

Ingeniero 

Douglas Iturburu Salvador, M.Sc. 

**DECANO DE LA FACULTAD DE CIENCIAS MATEMÁTICAS Y FÍSICAS** Presente. 

A través de este medio indico a usted que procedo a realizar la entrega de la cesión de derechos de autor en forma libre y voluntaria del trabajo de titulación “**PLATAFORMA WEB DE  MATCHING  BIDIRECCIONAL  PARA  PRÁCTICAS  PREPROFESIONALES BASADO EN TÉCNICAS NLP Y MODELOS DE SIMILITUD SEMÁNTICA**”, realizado como requisito previo para la obtención del Título de Ingeniero en Software de la Universidad de Guayaquil.** 

Guayaquil, \_\_\_\_\_\_\_\_ de \_\_\_\_\_\_\_. 

**\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ ![ref3]Bryan Guillermo Galarza Indacochea** 

**C.I. N°** 0955236773 

**\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ ![ref4]Naldo Jonnel Anchundia Caicedo** 

**C.I. N°** 0942646266 

![ref5]

**UNIVERSIDAD DE GUAYAQUIL \
FACULTAD DE CIENCIAS MATEMÁTICAS Y FÍSICAS  CARRERA DE SOFTWARE** 

PLATAFORMA WEB DE MATCHING BIDIRECCIONAL PARA PRÁCTICAS PREPROFESIONALES BASADO EN TÉCNICAS NLP Y  

MODELOS DE SIMILITUD SEMÁNTICA. 

Proyecto de Titulación que se presenta como requisito para optar por el título de  INGENIERO EN SOFTWARE 

**Autores:** Bryan Guillermo Galarza Indacochea **C.I. N°** 0955236773 

Naldo Jonnel Anchundia Caicedo **C.I. N°** 0942646266 

**Tutor**: ING. JOSÉ ABEL ALARCÓN 

Guayaquil, \_\_\_\_\_\_de\_\_\_\_\_                        Mes        Año

<a name="_page9_x69.00_y72.00"></a>**CERTIFICADO DE ACEPTACIÓN DEL TUTOR** 

En mi calidad de Tutor(a) del Proyecto de Titulación, nombrado por el Consejo Directivo de la Facultad de Ciencias Matemáticas y Físicas de la Universidad de Guayaquil. 

**CERTIFICO:** 

Que  he  analizado  el  Proyecto  de  Titulación  presentado  por  los  estudiantes  **Bryan Guillermo Galarza Indacochea, Naldo Jonnel Anchundia Caicedo**, como requisito previo para optar por el Título de Ingeniero en Software cuyo proyecto es: 

**PLATAFORMA WEB DE MATCHING BIDIRECCIONAL PARA PRÁCTICAS PREPROFESIONALES BASADO EN TÉCNICAS NLP Y**  

**MODELOS DE SIMILITUD SEMÁNTICA.** 

Considero aprobado el trabajo en su totalidad. Presentado por: 

![ref3]

`     `Bryan Guillermo Galarza Indacochea                           Cédula de identidad N° 0955236773 ![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.014.png)![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.015.png)

![ref4]

`     `Naldo Jonnel Anchundia Caicedo                                Cédula de identidad N° 0-942646266 ![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.016.png)![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.017.png)

**Tutor:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_                                                                                          Firma 

Guayaquil, \_\_\_\_\_\_de\_\_\_\_\_ 

![ref6]

**UNIVERSIDAD DE GUAYAQUIL \
FACULTAD DE CIENCIAS MATEMÁTICAS Y FÍSICAS  CARRERA DE SOFTWARE** 

<a name="_page10_x69.00_y176.00"></a>**AUTORIZACIÓN PARA PUBLICACIÓN DE PROYECTO DE TITULACIÓN EN FORMATO DIGITAL** 

1. **Identificación del Proyecto de Titulación** 



|**Nombre del Estudiante:** Bryan Guillermo Galarza Indacochea ||
| - | :- |
|**Dirección:** Sergio toral 2 etp. ||
|**Teléfono:**0998094515 |**Email:** bryan.galarzaind@ug.edu.ec |



|**Nombre del Estudiante:** Naldo Jonnel Anchundia Caicedo** ||
| - | :- |
|**Dirección:** Daule, parroquia Limonal ||
|**Teléfono:** 0990020956 |**Email:**  naldo.anchundiac@ug.edu.ec |



|**Facultad:** Ciencias Matemáticas y Físicas |
| - |
|**Carrera:** Software |
|**Proyecto de Titulación al que opta:** Proyecto de desarrollo**  |
|**Profesor Tutor:** Ing. José Abel Alarcón** |

**Título del Proyecto de Titulación:** PLATAFORMA WEB DE MATCHING BIDIRECCIONAL PARA ![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.019.png)PRÁCTICAS PREPROFESIONALES BASADO EN TÉCNICAS NLP Y MODELOS DE SIMILITUD SEMÁNTICA.** 

**Palabras  Claves:**  M*atching,  Plataforma  web,  NLP,  practicas  preprofesionales,  similitud ![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.020.png)*

*semántica.*

2. **Autorización de Publicación de Versión Electrónica del Proyecto de Titulación**  

A través de este medio autorizo a la Biblioteca de la Universidad de Guayaquil y a la Facultad de Ciencias Matemáticas y Físicas a publicar la versión electrónica de este Proyecto de Titulación.  

**Publicación Electrónica:**  



|Inmediata** ||Después de 1 año  ||
| - | :- | - | :- |
Firma Estudiante:  

![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.021.png)

`            `Bryan Guillermo Galarza Indacochea                                           Cédula de identidad N° 0955236773 ![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.022.png)![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.023.png)

![ref4]

Naldo Jonnel Anchundia Caicedo                                                 Cédula de identidad N° 0-942646266 ![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.024.png)![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.025.png)

3. **Forma de envío:**  

El texto del Proyecto de Titulación debe ser enviado en formato Word, como archivo .docx, .RTF o .Puf para PC. Las imágenes que la acompañen pueden ser: .gif, .jpg o .TIFF. 

DVDROM  ![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.026.png)                                CDROM  ![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.027.png)

<a name="_page12_x69.00_y72.00"></a>**ÍNDICE GENERAL** 

[**FICHA DE REGISTRO DE TRABAJO DE TITULACIÓN ................................................... 2** ](#_page1_x73.00_y179.92)[**APROBACIÓN DEL TUTOR ..................................................................................................... 3** ](#_page2_x69.00_y72.92)[**DEDICATORIA ............................................................................................................................ 4** ](#_page3_x69.00_y99.92)[**AGRADECIMIENTO .................................................................................................................. 5** ](#_page4_x69.00_y99.92)[**TRIBUNAL PROYECTO DE TITULACIÓN .......................................................................... 6** ](#_page5_x69.00_y85.92)[**DECLARACIÓN EXPRESA....................................................................................................... 7** ](#_page6_x69.00_y114.00)[**CESIÓN DE DERECHOS DE AUTOR ..................................................................................... 8** ](#_page7_x69.00_y152.00)[**CERTIFICADO DE ACEPTACIÓN DEL TUTOR ............................................................... 10**](#_page9_x69.00_y72.00)

[**AUTORIZACIÓN PARA PUBLICACIÓN DE PROYECTO DE TITULACIÓN EN FORMATO DIGITAL ............................................................................................................... 11**](#_page10_x69.00_y176.00)

[**ÍNDICE GENERAL ................................................................................................................... 13** ](#_page12_x69.00_y72.00)[**ÍNDICE DE TABLAS................................................................................................................. 18** ](#_page17_x69.00_y100.00)[**ÍNDICE DE FIGURAS............................................................................................................... 19** ](#_page18_x69.00_y72.00)[**ABREVIATURAS....................................................................................................................... 20** ](#_page19_x69.00_y86.00)[**SIMBOLOGÍA ............................................................................................................................ 21** ](#_page20_x69.00_y72.00)[**RESUMEN................................................................................................................................... 22** ](#_page21_x69.00_y389.00)[**ABSTRACT ................................................................................................................................. 23** ](#_page22_x69.00_y327.00)[**INTRODUCCIÓN ...................................................................................................................... 24** ](#_page23_x69.00_y72.00)[**CAPÍTULO I ............................................................................................................................... 22**](#_page26_x69.00_y72.00)

[**PLANTEAMIENTO DEL PROBLEMA ................................................................................. 22** ](#_page26_x69.00_y120.00)[**Descripción de la situación problemática ................................................................................. 22** ](#_page26_x69.00_y164.00)[Ubicación del problema en un contexto.................................................................................... 22 ](#_page26_x69.00_y203.00)[Situación conflicto nudos críticos ............................................................................................. 23 ](#_page27_x69.00_y348.00)[Delimitación del problema ........................................................................................................ 24 ](#_page28_x69.00_y238.00)[Evaluación del Problema .......................................................................................................... 25 ](#_page29_x69.00_y72.00)[**Causas y consecuencias del problema ....................................................................................... 27** ](#_page31_x69.00_y72.00)[**Formulación del problema ......................................................................................................... 28** ](#_page32_x69.00_y72.00)[**Objetivos del proyecto ................................................................................................................ 22** ](#_page26_x69.00_y243.00)[Objetivo general ........................................................................................................................ 29 ](#_page33_x69.00_y103.00)[Objetivos específicos ................................................................................................................ 29 ](#_page33_x69.00_y225.00)[**Alcance del problema ................................................................................................................. 29** ](#_page33_x69.00_y582.00)[**Justificación e importancia ........................................................................................................ 31** ](#_page35_x69.00_y210.00)[**Limitaciones del estudio ............................................................................................................. 32** ](#_page36_x69.00_y72.00)[**CAPÍTULO II ............................................................................................................................. 31** ](#_page37_x69.00_y142.00)[**MARCO TEÓRICO ................................................................................................................... 31** ](#_page37_x69.00_y189.00)[**Antecedentes del estudio............................................................................................................. 31** ](#_page37_x69.00_y234.00)[**Fundamentación teórica ............................................................................................................. 35** ](#_page42_x69.00_y197.00)[**Preguntas científicas a contestarse ............................................................................................ 67** ](#_page74_x69.00_y72.00)[**Definiciones conceptuales ........................................................................................................... 67**](#_page74_x69.00_y225.00)**CAPÍTULO III ................................................................................** ¡Error! Marcador no definido. **PROPUESTA TECNOLÓGICA ...................................................** ¡Error! Marcador no definido. **Análisis de factibilidad ...................................................................** ¡Error! Marcador no definido. Factibilidad operacional ............................................................ **¡Error! Marcador no definido.** Factibilidad técnica ................................................................... **¡Error! Marcador no definido.** Factibilidad legal ....................................................................... **¡Error! Marcador no definido.** Factibilidad económica ............................................................. **¡Error! Marcador no definido. Metodologías del proyecto ..............................................................** ¡Error! Marcador no definido. Metodología de investigación ................................................... **¡Error! Marcador no definido.** Población y muestra ............................................................ **¡Error! Marcador no definido.** Población*.* ....................................................................... **¡Error! Marcador no definido.** Muestra*.* .......................................................................... **¡Error! Marcador no definido.**

Procesamiento y análisis...................................................... **¡Error! Marcador no definido.**

Técnicas de recolección de datos. ................................... **¡Error! Marcador no definido.** Técnicas estadísticas para el procesamiento de la información*.*..... **¡Error! Marcador no** 

**definido.**

Metodología de gestión del proyecto (opcional) ...................... **¡Error! Marcador no definido.** Metodología de desarrollo del proyecto ................................... **¡Error! Marcador no definido. Beneficiarios directos e indirectos del proyecto ...........................** ¡Error! Marcador no definido. **Entregables del proyecto ................................................................** ¡Error! Marcador no definido. **Propuesta .........................................................................................** ¡Error! Marcador no definido. **Criterios de validación de la propuesta ........................................** ¡Error! Marcador no definido. **Resultados ........................................................................................** ¡Error! Marcador no definido. **CAPÍTULO IV ................................................................................** ¡Error! Marcador no definido. **CONCLUSIONES Y RECOMENDACIONES............................** ¡Error! Marcador no definido. **Criterios de aceptación del producto o servicio ...........................** ¡Error! Marcador no definido. **Conclusiones ....................................................................................** ¡Error! Marcador no definido. **Recomendaciones ............................................................................** ¡Error! Marcador no definido. **Trabajos futuros..............................................................................** ¡Error! Marcador no definido. **REFERENCIAS BIBLIOGRÁFICAS ..........................................** ¡Error! Marcador no definido. **BIBLIOGRAFÍA.............................................................................** ¡Error! Marcador no definido. **ANEXOS ..........................................................................................** ¡Error! Marcador no definido. Anexo 1.  Planificación de actividades del proyecto ................ **¡Error! Marcador no definido.** Anexo 2.  Geo-localización del problema................................. **¡Error! Marcador no definido.** Anexo 3.  Carta de autorización del proyecto ........................... **¡Error! Marcador no definido.** Anexo 4.  Fundamentación Legal ............................................. **¡Error! Marcador no definido.**

Anexo 5.  Criterios éticos a utilizarse en el desarrollo del proyecto......... **¡Error! Marcador no definido.**

Anexo 6.  Formatos de técnicas de recolección de datos aplicadas para variables cuantitativas o cualitativas. ............................................................................ **¡Error! Marcador no definido.**

Anexo 7.  Validación de expertos. ............................................ **¡Error! Marcador no definido.** Anexo 8.  Bases de datos para análisis estadístico (Opcional) . **¡Error! Marcador no definido.**

Anexo 9. Diagramas de casos de uso (Dependiendo de la metodología que aplique en el proyecto) ................................................................................... **¡Error! Marcador no definido.**

Anexo 10. Acta de entrega y recepción definitiva .................... **¡Error! Marcador no definido.**

Anexo 11.  Carta de uso de software (Aplica según se requiera) ............. **¡Error! Marcador no definido.**

Anexo 12. Evidencias fotográficas adicionales (Opcional) ...... **¡Error! Marcador no definido.** Anexo 13. Manual técnico ........................................................ **¡Error! Marcador no definido.**

Anexo 14. Manual de usuario ................................................... **¡Error! Marcador no definido.**

<a name="_page17_x69.00_y100.00"></a>**ÍNDICE DE TABLAS** 

Tabla 1. Delimitación del problema. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .22 Tabla 2. Matriz de causas y consecuencias del problema . . . . . . . . . . . . . . . . . . . . . . . .24 Tabla 3. Tecnologías a utilizarse en el proyecto . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .32 Tabla 4. Costos por recursos humanos en el proyecto . . . . . . . . . . . . . . . . . . . . . . . . . . 32 Tabla 5. Costos de inversión en hardware en el proyecto . . . . . . . . . . . . . . . . . . . . . . . .32 Tabla 6. Costos de inversión en software en el proyecto . . . . . . . . . . . . . . . . . . . . . . . . 33 Tabla 7. Resumen de costos de inversión en el proyecto . . . . . . . . . . . . . . . . . . . . . . . . 33 Tabla 8. Cálculo de la muestra. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 36 Tabla 9. Pregunta 4: ¿Tiene mascotas en casa actualmente? . . . . . . . . . . . . . . . . . . . . . .42 

<a name="_page18_x69.00_y72.00"></a>**ÍNDICE DE FIGURAS** 

Figura 1. Estructura de un objetivo general . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 26 Figura 2. Análisis comparativo: Ionic vs React Native vs Flutter . . . . . . . . . . . . . . . . 31 Figura 3. Pregunta 4: Análisis gráfico de la pregunta número 4 de la encuesta. . . . . . 42 Figura 4. Descripción breve pero completa que explique la imagen o fotografía. . . .  82** 

<a name="_page19_x69.00_y86.00"></a>**ABREVIATURAS** 

ABP   Aprendizaje Basado en Problemas CC.MM.FF    Facultad de Ciencias Matemáticas y Físicas EDT   Estructura de Desglose de Trabajo 

FTP    Archivos de Transferencia 

g.l.   Grados de Libertad 

HTML   Lenguaje de Marca de salida de Hyper Texto HTTP    Protocolo de transferencia de Hyper Texto Ing.    Ingeniero 

ISP   Proveedor de Servicio de Internet 

M.Sc.    Máster 

Mtra.    Maestra 

UG   Universidad de Guayaquil 

URL    Localizador de Fuente Uniforme 

WWW   World Wide Web (Red Mundial) 

<a name="_page20_x69.00_y72.00"></a>**SIMBOLOGÍA** 

s   Desviación estándar 

e   Error 

*E*   Espacio muestral 

E(*Y*)    Esperanza matemática de la v.a. y 

s   Estimador de la desviación estándar e   Exponencial** 

![ref7]

**UNIVERSIDAD DE GUAYAQUIL \
FACULTAD DE CIENCIAS MATEMÁTICAS Y FÍSICAS CARRERA DE SOFTWARE** 

PLATAFORMA WEB DE MATCHING BIDIRECCIONAL PARA PRÁCTICAS PREPROFESIONALES BASADO EN TÉCNICAS NLP Y  

MODELOS DE SIMILITUD SEMÁNTICA. 

. 

**Autor(a)(es):** Bryan Guillermo Galarza Indacochea C.I. N° 0955236773 

Naldo Jonnel Anchundia Caicedo C.I. N° 0942646266 

**Tutor:** Ing. José Abel Alarcón 

<a name="_page21_x69.00_y389.00"></a>**RESUMEN ![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.029.png)**

Realice una exposición corta y precisa de los puntos sustanciales de los contenidos del proyecto, en relación a: los objetivos que persigue, la orientación teórica o marco referencial, la metodología utilizada, la importancia, trascendencia y contenido y las conclusiones del trabajo. Preséntelo en forma de un solo párrafo, los contenidos se separan entre sí por puntos seguidos escritos a un solo espacio. No exceda de una página. Maneje interlineado sencillo. Se recomienda realizarlo cuando se haya concluido el desarrollo del proyecto). Se sugiere considerar 2 líneas para objetivos, 4 para el marco referencial 4 de metodología, 16 de contenido y 4 líneas de conclusiones (máximo 300 palabras en una sola hoja). 

**Palabras clave:** Matching, Plataforma web, NLP, practicas preprofesionales, similitud semántica. 

Considere entre 5 a 8 palabras claves relevantes en su trabajo de titulación. Coloque cada una de ellas separadas por comas. Coloque junto a la última palabra el símbolo de punto. 

![ref7]

**UNIVERSIDAD DE GUAYAQUIL** 

**FACULTAD DE CIENCIAS MATEMÁTICAS Y FÍSICAS CARRERA DE SOFTWARE** 

Plataforma web de matching bidireccional para prácticas preprofesionales  basado en técnicas NLP y modelos de similitud semántica. 

**Author(s):** Bryan Guillermo Galarza Indacochea C.I. N° 0955236773 

Naldo Jonnel Anchundia Caicedo C.I. N° 0942646266 

**Tutor:** Ing. José Abel Alarcón 

<a name="_page22_x69.00_y327.00"></a>**ABSTRACT ![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.030.png)**

Realice  una  exposición  en  idioma  inglés  corta  y  precisa  de  los  puntos  sustanciales  de  los contenidos del proyecto, en relación a: los objetivos que persigue, la orientación teórica o marco referencial, la metodología utilizada, la importancia, trascendencia y contenido y las conclusiones del trabajo. Preséntelo en forma de un solo párrafo, los contenidos se separan entre sí por puntos seguidos escritos a un solo espacio. No exceda de una página. Maneje interlineado sencillo. Se recomienda realizarlo cuando se haya concluido el desarrollo del proyecto). Se sugiere considerar 2 líneas para objetivos, 4 para el marco referencial 4 de metodología, 16 de contenido y 4 líneas de conclusiones **(máximo 300 palabras en una sola hoja).** 

**Key words:** Considere entre 5 a 8 palabras claves relevantes en su trabajo de titulación. Coloque cada una de ellas separadas por comas. Coloque junto a la última palabra el símbolo de punto. 

<a name="_page23_x69.00_y72.00"></a>**INTRODUCCIÓN** 

Uno  de  los  componentes  fundamentales  dentro  de  la  formación  universitaria  es  la realización de prácticas preprofesionales las cuales permiten a los estudiantes sumergirse en la experiencia laboral, aplicar los conocimientos adquiridos durante su carrera y desarrollar sus habilidades. En los últimos años, la cantidad de estudiantes que se matriculan para una carrera universitaria en la Universidad de Guayaquil ha estado creciendo lo cual implica una mayor demanda de futuros profesionales que requerirán de un espacio para la realización de sus prácticas. 

Es debido a esto que la universidad ha impulsado la firma de múltiples convenios con empresas de distintos sectores con el objetivo de ampliar la oferta de estos espacios. Sin embargo, a pesar de contar con una amplia red de convenios, el proceso de selección no está sistematizado por lo cual el acercamiento inicial que tienen los estudiantes con las empresas de convenio está bajo su responsabilidad teniendo que realizar una ardua gestión sobre la búsqueda de vacantes en base a un listado general en formato Excel que tiene como contenido los miles de nombres de empresas que cuentan con el convenio, pero con información muy básica de cada una de ellas como nombre, correo y facultad relacionada, es decir que los estudiantes no tienen a la mano detalles referente a perfiles requeridos o áreas de vacantes disponibles por lo cual ellos mismos deben investigar a cada una y solicitar mayor información.  

El resultado de esta gestión autodidacta produce una alta tasa de postulaciones irrelevantes a través de correo electrónico, rechazos por una mala relación entre el perfil del estudiante y los requerimientos de la empresa y repetición de trámites al tener que empezar de cero en la búsqueda de otra empresa. Esto provoca pérdida de tiempo para los estudiantes al causar retrasos en el inicio de sus prácticas, así como también un hostigamiento y pérdida de tiempo en las empresas al tener que responder a una gran cantidad de correos de estudiantes y programar reuniones en donde en ocasiones resulta que las habilidades del estudiante no se relacionan con los objetivos y áreas disponibles en la empresa. 

Uno  de  los  nudos  críticos  que  surge  a  partir  de  esta  problemática  es  la  deficiente compatibilidad  que  existe  entre  el  perfil  del  estudiante  y  los  requerimientos  de  la  empresa desencadenando otra serie de problemáticas como que las actividades que termina realizando el practicante  no  mantienen  una  relación  directa  con  su  formación  profesional  si  no  que  son actividades comunes de gestión. Esto se da debido a que no existió de por medio un sistema de afinidad por lo que el conocimiento del estudiante puede no estar relacionado con los procesos o tecnologías que utiliza la empresa o simplemente por subestimación de parte de la empresa limitando el desarrollo profesional del estudiante, oportunidades de aprendizaje y una futura inserción laboral. 

En base a este contexto resulta necesario el desarrollo de una solución tecnológica que permita  la  optimización  del  proceso  de  búsqueda,  postulación  y  asignación  de  prácticas preprofesionales,  mejorando la compatibilidad entre el  perfil académico del  estudiante y los requerimientos  de  las  empresas.  Es  por  esto  que  la  idea  de  una  plataforma  de  matching bidireccional que utilice como  base las técnicas de  procesamiento  de  lenguaje  natural  y los modelos de similitud semántica representa una alternativa innovadora al permitir la automatización del  análisis  de  compatibilidad  relacionando  los  perfiles  y  promoviendo  un  sistema  de recomendación. 

El presente trabajo se estructura en 4 capítulos. 

- **Capítulo 1:** Planteamiento del problema 

  En este capítulo se aborda toda la información acerca de los conflictos en los procesos actuales para la búsqueda y asignación de prácticas preprofesionales teniendo como puntos esenciales la delimitación del tema, definición de nudos críticos, objetivos,  alcance y limitaciones además del planteamiento de la pregunta clave sobre la formulación del problema y la justificación e importancia del estudio. 

26 

<a name="_page26_x69.00_y72.00"></a>**CAPÍTULO I \
<a name="_page26_x69.00_y120.00"></a>PLANTEAMIENTO DEL PROBLEMA** 

<a name="_page26_x69.00_y164.00"></a>**Descripción de la situación problemática** 

<a name="_page26_x69.00_y203.00"></a>**Ubicación del problema en un contexto** 

<a name="_page26_x69.00_y243.00"></a>La facultad de ciencias matemáticas y físicas de la Universidad de Guayaquil en donde se sitúa el contexto del proyecto se ubica en la avenida “Víctor Manuel Rendón” en la ciudad de guayaquil. En los últimos años la Universidad de Guayaquil ha experimentado un crecimiento sostenido en la cantidad de estudiantes matriculados para cursar una carrera universitaria y debido a esta razón se ha impulsado la firma de múltiples convenios con empresas de distintos sectores, con la finalidad de ampliar la oferta de espacios disponibles para la realización de prácticas preprofesionales.  

Los estudiantes a través de la página web tienen acceso al listado en Excel en donde se encuentra información de todas las empresas que tienen convenio con la Universidad para el desarrollo de prácticas preprofesionales. En este listado observan información relevante de cada una de ellas como nombre de la empresa, correo al cual dirigirse y facultad, información mediate la cual los estudiantes podrán contactar a una de su interés a través del correo electrónico y enviándoles su solicitud de postulación.  

Además del contacto por correo los estudiantes disponen de alternativas externas como plataformas de empleo tales como LinkedIn en donde múltiples empresas que mantienen convenio con la universidad realizan publicaciones de oferta de empleo y en algunos casos ofertas de prácticas a los cuales los estudiantes pueden aplicar registrándose con su información académica y experiencia previa. Por otra parte, la Universidad de Guayaquil cuenta con un sistema académico que se encarga del seguimiento de los estudiantes en su proceso de realización de  prácticas preprofesionales desde el inicio hasta la finalización de las horas de prácticas 

En esta plataforma una vez que los estudiantes ya cuentan con una empresa que les permitirá realizar sus prácticas, un administrador los registra con su información e información de la empresa y se les asigna un tutor que los guiará en todo el proceso de sus horas de prácticas. En este proceso los estudiantes semanalmente realizan un registro de las acciones que están realizando en la empresa y el día de finalización también comparten el certificado de culminación emitido por la empresa, lo que proporciona a la universidad la información necesaria para emitir un certificado de que se ha cumplido con todas las horas de prácticas. 

<a name="_page27_x69.00_y348.00"></a>**Situación conflicto nudos críticos** 

El  área  de  prácticas  preprofesionales  en  la  universidad  de  Guayaquil  enfrenta  como problemática principal la falta de un sistema que permita la identificación de vacantes por parte de los estudiantes, ya que solo se cuenta con un listado en formato Excel con más de 1000 registros donde se enlistan todas las empresas con convenio y se presenta información básica de cada una de ellas. Esta falta de contexto provoca que estudiantes sin experiencia previa en en procesos de postulación laboral realicen una búsqueda desorientada contactando con múltiples empresas que parezcan relacionadas a su carrera para darse cuenta en la entrevista que la empresa no dispone de una vacante para su área si no para otras.  

Como consecuencia a esto, se genera una alta tasa de postulaciones, repetición de trámites, retrasos, y una pérdida significativa de tiempo tanto para los estudiantes como para las empresas involucradas. Por otra parte, otro de los nudos críticos es la deficiencia en la alineación de perfiles que existe cuando un estudiante es aceptado por una empresa para realizar sus prácticas, pero las actividades que se le designan no son relacionadas a su área ya sea porque se considera que no dispone de los conocimientos suficientes para participar en esa área o porque la empresa requiere más apoyo en tareas administrativas. A causa de esto, se limita el desarrollo de habilidades, se reduce las oportunidades de aprendizaje y sobre todo se disminuye la probabilidad de una posible inserción laboral, sin embargo, los estudiantes suelen aceptarlo únicamente con el objetivo de cumplir con el número de horas exigidas de prácticas.  

<a name="_page28_x69.00_y238.00"></a>**Delimitación del problema** 

En la siguiente tabla se presenta el enfoque del proyecto utilizando como delimitadores el tema del proyecto, campo, área y aspecto en el cual se desarrolla. El presente proyecto se centra en el diseño y desarrollo de una plataforma que implemente un modelo de matching bidireccional con el fin de mejorar la compatibilidad y eficiencia en la asignación de prácticas preprofesionales. (Ver ***Tabla1***). 

**Tabla 1**  

*Delimitación del problema*** 



|**Delimitador** |**Descripción** |
| - | - |
|<p>Campo Área </p><p>Aspecto Tema </p>|<p>Tecnología </p><p>Desarrollo de Software </p><p>Proceso  de  emparejamiento  de  prácticas  preprofesionales  entre estudiantes y empresas. </p><p>Plataforma de matching bidireccional para prácticas preprofesionales basado en técnicas NLP y modelos de similitud semántica. </p>|

***Nota:*** En esta tabla se plantean los términos de análisis aplicados para la delimitación del problema conforme al contexto en donde se desarrolla la problemática.  

**Elaborado por:** Galarza Bryan, Anchundia Naldo. 

<a name="_page29_x69.00_y72.00"></a>**Evaluación del Problema** 

Los aspectos generales de evaluación son: 

- **Delimitado:**  

  El  estudio  está  delimitado  bajo  el  contexto  de  prácticas  preprofesionales tomando como población a los estudiantes de las carreras perteneciente a la facultad de ciencias matemáticas de la universidad de Guayaquil permitiendo analizar de manera eficaz las ineficiencias en el proceso de búsqueda, postulación y asignación de prácticas preprofesionales. 

- **Claro:**  

  Los  puntos  relevantes  sobre  la  problemática  identificada  son  claros:  la vinculación  inicial  entre  estudiantes  y  empresas  de  convenio  no  se  encuentra centralizada ni estandarizada, por lo que cada estudiante deberá realizar el proceso de búsqueda bajo su responsabilidad lo que ha provocado que el proceso de postulación sea  desorganizado,  poco  eficiente  y  generando  pérdida  de  tiempo  tanto  para  los estudiantes  interesados  como  para  las  empresas  implicadas  que  entrevistan  a estudiantes de áreas con las que ellos no disponen. 

- **Evidente:**  

  La problemática es evidente y se refleja fácilmente en la cantidad de tiempo que invierten los estudiantes investigando a las empresas para posteriormente postular a ellas, así como en las entrevistas fallidas que debido a la falta de correspondencia entre sus perfiles y requerimientos solicitados son descartados. Por otro lado, esto también se  evidencia  en  la  cantidad  masiva  de  correos  que  reciben  las  empresas  sobre información de las postulaciones. 

- **Relevante:**  

  El proyecto es relevante para la comunidad educativa universitaria debido a que brindará  una  solución  tecnológica  a  la  problemática  sobre  la  ineficiencia  en  los procesos iniciales de prácticas preprofesionales proporcionando una mayor posibilidad de inserción laboral gracias a la aplicación de modelos de similitud semántica que permitirán una adecuada relación entre perfiles. 

- **Contextual:**  

  El problema surge bajo el contexto educativo que determina que las practicas preprofesionales  constituyen  un  componente  obligatorio  para  la  formación  de  los estudiantes  de  la  universidad  de  Guayaquil.  La  falta  de  sistematización  de  estos procesos de postulación implica afectaciones en estudiantes y empresas de manera simultánea. 

- **Factible:**  

  Nuestra solución sobre una plataforma de matching es factible debido a la información disponible respecto a la temática de prácticas preprofesionales y a la diversidad  de  herramientas  y  librerías  existentes  para  procesamiento  de  lenguaje natural, así como también disponemos de la ventaja del factor tiempo contando con un tiempo razonable para el desarrollo del proyecto. 

27 

<a name="_page31_x69.00_y72.00"></a>**Causas y consecuencias del problema** 

En esta sección presentaremos la relación entre las causas y las consecuencias que implica la  problemática  identificada  en  el  proceso  inicial  de  selección  de  empresas  de  prácticas preprofesionales en la universidad de Guayaquil. (Ver ***tabla 2***) 

**Tabla 2**  

*Matriz de causas y consecuencias del problema*** 

**Causas**  **Consecuencias** ![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.031.png)![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.032.png)

E5.1. Búsqueda desorientada. ![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.033.png)![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.034.png)

C1. Búsqueda manual basada en información  E1.2  Perdida  de  tiempo  al  tener  que básica de un listado en Excel.  investigar el perfil de cada empresa. 

E2.1. Alta tasa de postulaciones irrelevantes. C2.  Desconocimiento  de  empresas  con  E2.2. Repetición de procesos de contacto y vacantes relacionadas a su carrera.  entrevista. 

E3.1.  Disminuye  la  probabilidad  de  ser C3.  Falta  de  alineación  entre  el  perfil  contratado por la empresa. 

académico del estudiante y los requisitos de la  E3.2 Practicas que no aportan en la formación empresa.  del estudiante. 

27 

C4. Falta de un sistema centralizado para publicar y filtrar vacantes de prácticas. 

C5. Subestimación de las habilidades del practicante. 

E4.1. Los estudiantes contactan una a una a las empresas para información. 

E4.2 Saturación en el correo de las empresas con  solicitudes  no  alineadas  a  sus requerimientos. 

E5.1  Asignación  de  actividades  poco relacionadas a su carrera. 

E5.2 Desmotivación sobre sus oportunidades laborales. 

27 

E6. Estudiantes que solo buscan cumplir las C6. Presión institucional para cumplir con el 

horas de práctica sin importar el aprendizaje. número de horas exigidas. 

***Nota:*** Esta tabla refleja el análisis causal que se realizó en base a las causas y consecuencias identificadas referentes ![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.035.png)![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.036.png)a la problemática. **Elaborado por:** Galarza Bryan, Anchundia Naldo. 

28 

<a name="_page32_x69.00_y72.00"></a>**Formulación del problema** 

En los últimos años la cantidad de convenios entre la universidad y las empresas para el proceso de prácticas preprofesionales ha estado en aumento, así como el porcentaje de estudiantes que requieren de este proceso. Sin embargo, no existe un proceso de asignación sistematizado por lo que la gestión manual suele ser poco eficiente para los estudiantes al tener que buscar y solicitar información  sobre  las  vacantes  en  base  a  un  listado  de  convenios  manteniendo  una  baja correspondencia entre sus perfiles y los requerimientos de las empresas por lo cual muchas veces luego de la entrevista las empresas los descartan. 

En base a esto se plantea la siguiente interrogante: 

¿De  qué  manera  una  plataforma  de  matching  bidireccional  basada  en  técnicas  NLP  y modelos de similitud semántica mejoraría la compatibilidad entre el perfil académico de los estudiantes y las vacantes ofrecidas por las empresas? 

29 

**Objetivos del proyecto** 

<a name="_page33_x69.00_y103.00"></a>**Objetivo general** 

Desarrollar una plataforma web de matching bidireccional para prácticas preprofesionales mediante el uso de técnicas NLP y modelos de similitud semántica para la optimización del proceso de búsqueda y postulación a través de recomendaciones personalizadas.  

<a name="_page33_x69.00_y225.00"></a>**Objetivos específicos** 

1. Determinar los requisitos funcionales y no funcionales del sistema para la definición del alcance lógico y las reglas de operación de la plataforma. 
1. Diseñar la arquitectura de software y los esquemas de base de datos aplicando patrones de desarrollo web para la estructuración de los módulos de gestión de usuarios y publicación de vacantes. 
1. Desarrollar el modelo de matching bidireccional para la generación de porcentajes de afinidad entre las competencias del postulante y los requisitos de la vacante. 
1. Desarrollar el prototipo funcional de la plataforma web integrando los componentes de interfaz y lógica de servidor. 
1. Validar  la  operatividad  técnica  de  la  plataforma  y  la  precisión  del  motor  de emparejamiento mediante la ejecución de escenarios de prueba con datos simulados. 

<a name="_page33_x69.00_y582.00"></a>**Alcance del problema** 

El  presente  proyecto  contempla  el  diseño  y  desarrollo  de  una  plataforma  web  con arquitectura Cliente-Servidor para la gestión de prácticas preprofesionales en la Universidad de Guayaquil, estableciendo como frontera del proyecto la optimización técnica del emparejamiento entre ofertas y demandas académicas mediante algoritmos de similitud. 

30 

Para la definición de los requerimientos, el alcance se basa en el estudio de los flujos de procesos y datos operativos actuales, identificando la información necesaria para la delimitación lógica del sistema y asegurando que el prototipo se adapte a la realidad académica de la institución. 

El diseño del sistema contemplará una arquitectura cliente-servidor escalable, utilizando tecnologías de desarrollo web y ciencia de datos tales como: 

- **React.js y Next.js:** Para interfaces dinámicas y optimización de la experiencia de usuario.** 
- **Python y Flask:** Para la gestión lógica y seguridad de la API RESTFUL.** 
- **Python:** Para el procesamiento NLP y algoritmos de similitud semántica.** 
- **PostgreSQL:** Para el almacenamiento relacional, íntegro y seguro de la información.** El aplicativo web integrará estrictamente los siguientes módulos funcionales: 
  - **Módulo de Gestión de Usuarios:** Controlará el acceso seguro y la autenticación, diferenciando los roles de Administrador, Estudiante y Empresa con permisos y vistas personalizadas. 
  - **Módulo de Perfil Académico:** Permitirá a los estudiantes gestionar su información curricular y habilidades, estructurando los datos para facilitar el análisis semántico. 
  - **Módulo de Gestión de Vacantes:** Habilitará a las empresas para administrar sus ofertas de prácticas, detallando requisitos y competencias de forma estandarizada. 
  - **Módulo de Emparejamiento (Matching):** Ejecutará el algoritmo de similitud semántica (desarrollado en Python) para comparar automáticamente los perfiles con las vacantes, generando un porcentaje de afinidad visible para recomendar las mejores opciones. 
  - **Módulo de Postulación y Seguimiento:** Facilitará la aplicación a vacantes y la 

31 

visualización del estado de la solicitud, centralizando el flujo del proceso. 

La plataforma web será desplegada en un servidor de pruebas para validar la integración de los servicios y la precisión del algoritmo de emparejamiento. Se realizarán pruebas técnicas y de usabilidad utilizando datos simulados, permitiendo identificar mejoras y asegurar que el sistema sea estable, intuitivo y cumpla con los objetivos de optimización planteados. 

<a name="_page35_x69.00_y210.00"></a>**Justificación e importancia** 

El presente proyecto surge a partir de la identificación de las deficiencias en el proceso actual  de  postulación  de  prácticas  el  el  cual  se  caracteriza  por  ser  manual  y  desorientado provocando un alta tasa de postulaciones irrelevantes, pérdida de tiempo, y una baja alineación entre el perfil del estudiante y las actividades que termina realizando. 

La plataforma centralizará la comunicación y filtrará las mejores opciones beneficiando tanto a los estudiantes como a las empresas al migrar de un proceso manual a algo sistematizado minimizando los niveles de frustración e incertidumbre en los estudiantes al contar con una plataforma  en  la  que  pueden  observar  las  vacantes  y  postular  y  además  centralizando  la información de los postulantes para las empresas.  

El sistema de match no solo busca ser un espacio de publicación y postulación, sino que integra técnicas de inteligencia artificial como el procesamiento de lenguaje natural para reforzar el sistema con recomendaciones automatizadas permitiendo relacionar a ambas partes de acuerdo a sus criterios de búsqueda con la intención de fortalecer la empleabilidad de los estudiantes al exponerlos a prácticas que están altamente alineadas con sus perfiles, dándoles la oportunidad de ser contratados por la empresa en la que realizan las practicas. 

32 

<a name="_page36_x69.00_y72.00"></a>**Limitaciones del estudio** 

El presente estudio muestra las siguientes limitaciones técnicas, operativas y de alcance, tomando en consideración los recursos disponibles, la naturaleza académica del proyecto y la privacidad de la información: 

- **Uso de Datos Simulados:** Debido a las políticas de privacidad y protección de datos personales, el entrenamiento y validación del modelo de NLP se realizará exclusivamente con datos ficticios (simulados) que repliquen la estructura de perfiles y vacantes reales, sin utilizar información sensible de estudiantes actuales de la universidad. 
- **Entorno de Despliegue:** El prototipo será implementado y validado únicamente en un servidor de pruebas o entorno local; no se contempla el despliegue en la infraestructura tecnológica oficial de la Universidad de Guayaquil ni la integración con sus sistemas de gestión académica existentes (SIUG). 
- **Alcance del Algoritmo NLP:** El motor de recomendación se limitará a analizar la similitud semántica  textual  entre  las  habilidades  declaradas  y  los  requisitos  de  la  vacante;  no contempla análisis psicométricos, validación de la veracidad de la información ingresada, ni procesos de entrevista automatizada.  

31 

<a name="_page37_x69.00_y142.00"></a>**CAPÍTULO II \
<a name="_page37_x69.00_y189.00"></a>MARCO TEÓRICO** 

<a name="_page37_x69.00_y234.00"></a>**Antecedentes del estudio** 

En esta sección presentamos una revisión sistemática acerca de artículos científicos, tesis de grado y proyectos previos realizados en los últimos cinco años a nivel nacional e internacional que mantienen  relación  con  nuestro  presente  proyecto  de  maching  bidireccional  en  prácticas preprofesionales. Esto con el objetivo de contextualizar la importancia de aplicar modelos de similitud semántica para mejorar la relación entre promoviendo la empleabilidad. 

**Antecedentes Internacionales** 

El trabajo de investigación realizado por Ajjam y Al-Raweshidy (2026) titulado “AI-driven semantic  similarity-based  job  matching  framework  for  recruitment  systems”  consiste  en  la evaluación del uso de técnicas de procesamiento de lenguaje natural (NLP), vectorización TF-IDF y cálculo de similitud para el desarrollo de un modelo de reclutamiento inteligente capaz de procesar la información de un currículum, evaluar las habilidades y características y filtrarlos con una vacante especifica mejorando así la correspondencia entre candidatos y puestos de trabajo. 

Entre los resultados de la investigación se evidenció la eficacia de estos modelos semánticos en comparación con otros modelos como el de relación por palabras clave al superarlo en una prueba experimental de similitud con 0,74 de efectividad frente al 0,35 del método de palabras clave. De la misma manera en otras pruebas más desafiantes abordando contextos reales

31 

` `como el análisis en ciencia de datos y el alineamiento de perfiles alcanzó una puntuación máxima  de  0,88,  mientras  que  los  otros  modelos  se  mantuvieron  por  debajo  de  un  17% concluyendo  la  utilidad  del  modelo  en  distintos  sectores  y  sobre  todo  su  eficacia  para  el emparejamiento de empleos basado en similitud. 

Bajo un contexto similar, una investigación realizada en Arabia Saudita por Alsaif et al. (2022) consistió en la propuesta de un sistema de recomendación bidireccional cuyo objetivo fue la optimización del proceso de contratación y mitigación de los niveles de desempleo al relacionar de forma recíproca a solicitantes y reclutadores idóneos entre sí, esto a través del uso de técnicas NLP para la transformación de información desestructurada de perfiles y descripciones de puestos de trabajo para ser comparadas y según el nivel de precisión realizar el filtrado de recomendación.  

En la investigación a través del uso de métricas de precisión se logró llegar a la conclusión de que el modelo bidireccional mejoró la correspondencia entre perfiles y puestos alineando a los postulantes con áreas donde sus conocimientos serian realmente útiles y separándolos de áreas en donde su porcentaje de similitud fue notoriamente bajo, así como también hubo una reducción en el tiempo que les tomaba a los reclutadores evaluar candidatos. 

En base a esto podemos reafirmar nuestra postura por aplicar modelos de similitud semántica al contexto de prácticas preprofesionales a través de una plataforma web que optimice la búsqueda de vacantes a través de la vinculación basada en compatibilidad existente entre perfiles y los requisitos de la vacante aumentado las posibilidades de inserción laboral. 

**Antecedentes regionales** 

En  un  estudio  realizado  en  Colombia  por  Carabali-Sanchez  (2025)  con  el  nombre  de “Procesamiento de Lenguaje Natural Aplicado a la Selección de Personal” se exploró el uso de 

32 

técnicas NLP y la aplicación de modelos Transformers y Word embeddings para la modernización de los métodos tradicionales de selección de personal a través de la identificación automática entre relaciones semánticas para distintas partes. 

La metodología del estudio requirió de la aplicación de técnicas de scrapping para realizar la capturar dato de entrenamiento directamente desde plataformas web como LinkedIn, seguido a esta etapa de recolección se realizó la etapa de limpieza y transformación utilizando los modelos modelo de transformación y embeddings como Universal Sentence Encoder (USE) convirtiendo el texto desestructurado en representaciones vectoriales las cuales permitieron la comparación de perfiles y la clasificación automática.  

La investigación concluyó que el modelo Universal Sentence Encoder es uno de los modelos más eficientes en NLP para comprender el contexto de los currículums y realizan la clasificación semántica  prestándose  como  un  recurso  clave  para  el  modelo  de  selección,  optimizando  la experiencia de empleadores y postulantes. 

En una tesis de maestría elaborada por Alasino, A. (2024) se propuso la elaboración de un sistema inteligente basado en aprendizaje no supervisado y técnicas de procesamiento de lenguaje natural  para  la  selección  de  candidatos  y  clasificación  en  base  a  curriculums  filtrados  en plataformas de ATS. 

El estudio consistió en dos partes, primero el procesamiento de datos no estructurados provenientes de un corpus de texto con 1,120 currículums y 3,840 vacantes laborales aplicando métodos  de  limpieza,  etiquetado  por  áreas  y  entrenamiento.  Posteriormente  se  aplicaron  los modelos Lbl2Vec, Transformers para clasificación de documentos y finalmente para la generación de recomendaciones específicas simulando un escenario de recursos humanos. 

33 

Los resultados evidenciaron la utilidad de los modelos semánticos, en especial Lbl2Vec para el entrenamiento de un sistema de recomendación destacando que el modelo entrenado puede ser integrado a entornos corporativos que integren ATS facilitando la identificación de cualidades y mejorando la eficiencia del proceso de selección  

Según lo planteado por los autores se puede confirmar la viabilidad de implementar modelos semánticos de embedding, Lbl2Vec y vectorización para un sistema inteligente de matching orientado a la selección y postulación de practicas preprofesionales, reduciendo los tiempos de búsqueda a través de filtrado automático basado en contexto y siendo un apoyo para la toma de decisiones tanto para estudiantes como para empresas. 

**Antecedentes locales** 

La investigación realizada por Recalde Morales y Soria Columba (2022) consistió en el desarrollo de un buscador interno mediante el entrenamiento de un modelo de recomendación orientado a la mejora de una plataforma de e-commerce. El sistema fue implementado utilizando base de datos NoSQL para el corpus de texto y utilizando para la comparación de consultas técnicas de Procesamiento de Lenguaje Natural (NLP), métricas de similitud y algoritmos de relación como el coseno de Salton y el coeficiente de Jaccard, concluyendo que la aplicación de técnicas de procesamiento de lenguaje natural mejoran significativamente los resultados recomendados por un sistema en base a una consulta, brindando una mejor experiencia a los usuarios. 

Villamar Cahueñas  (2024)  en su tesis  de grado elaboró  el  diseño y  desarrollo de una plataforma web integral a través del uso de la metodología SCRUM y el framework Next.js con el objetivo de optimizar la asignación y gestión de prácticas preprofesionales en la Facultad de Ingeniería en Sistemas (FIS) en Escuela Politécnica Nacional. El sistema sistematizo los procesos 

34 

manuales  y  mediante  diferentes  módulos  permitió  centralizar  la  búsqueda  de  vacantes  para estudiantes y facilitar la publicación de ofertas para empresas. 

Los resultados del estudio luego de la aplicación de cuestionarios SUS para identificar la usabilidad y pruebas de uso al prototipo utilizando una pequeña población de usuarios indicaron que una plataforma que pueda ser utilizada tanto por estudiantes como por empresas mejora significativamente la experiencia de los usuarios, logrando una mayor eficiencia en la gestión de vacantes y postulantes. 

Por otro lado, Palma Moreira (2024) realizó un estudio descriptivo y documental respecto al aporte que tienen las practicas preprofesionales en la inserción laboral de los graduados en la ULEAM. Para el desarrollo de este estudio se aplicó una encuesta a 249 egresados y se procesaron los datos utilizando SPSS con el objetivo de evaluar la relación que existe entre  la tasa de empleabilidad, habilidades desarrolladas y acompañamiento tutorial.  

En base a los resultados se pudo identificar que las habilidades que más se desarrollan en la realización de prácticas son las interpersonales y de relación social con un 39%, mientras que las habilidades  técnicas  se  desarrollaron,  pero  de  forma  mínima  concluyendo  que  existe  una desconexión crítica entre las actividades que se realizan en las prácticas y las competencias que se exigen en el  ámbito  profesional.  Sin  embargo,  Palma Moreira (2024)  sostiene que las otras habilidades que desarrollan los estudiantes en las practicas son igual de importantes, pero que aun así  se  deberían  rediseñar  los  programas  de  prácticas  preprofesionales  para  asegurar  que  las actividades realizadas por el estudiante se vinculen con las necesidades laborales garantizando una transición profesional menos brusca. 

En base a estos antecedentes tanto mundiales como regionales y locales podemos sustentar la viabilidad de implementar modelos de similitud semántica y técnicas de procesamiento de 

35 

lenguaje  natural  para  el  desarrollo  de  un  modelo  de  matching  en  prácticas  preprofesionales optimizando los tiempos de búsqueda, postulación y filtrado y resolviendo problemas como las identificadas  por  Palma  garantizando  una  vinculación  más  justa  y  fiable  que  permita  a  los estudiantes desarrollar sus habilidades profesionales requeridas en el mundo laboral. 

<a name="_page42_x69.00_y197.00"></a>**Fundamentación teórica** 

**Prácticas Preprofesionales** 

Las prácticas preprofesionales constituyen actividades académicas obligatorias que buscan la convergencia entre los conocimientos adquiridos en el aula y la práctica en el mundo real. Estás actividades se pueden definir como un proceso de formación crítico para los estudiantes a través del  cual  podrán  entender  la  realidad  profesional,  confrontar  retos  y  elaborar  soluciones  a problemáticas sociales o laborales (Varguillas et al., 2020). 

De acuerdo con el Consejo de Educación Superior (2022), las prácticas preprofesionales se definen como un conjunto estructurado de actividades destinadas a la aplicación de conocimientos y al desarrollo de competencias profesionales acercando a los estudiantes al contexto laboral. Sin embargo, las prácticas no solo promueven este acercamiento, sino que también son consideradas como un instrumento de innovación social el cual promueve la generación de vínculos entre la universidad y la empresas (Seller, 2022). 

Para Cabrera González et al. (2024) define a las prácticas preprofesionales como un medio exploratorio donde profesionales en formación tienen la oportunidad de familiarizarse de forma directa  con  su  futuro  contexto  laboral  mediante  la  observación,  participación  e  interacción constante con profesionales del área. Por otro lado, Carranza Guevara et al. (2025) las define como 

36 

un espacio para la aplicación de conocimientos teóricos adquiridos orientados al desarrollo de competencias y habilidades necesarias para el ejercicio profesional. 

En base a estas definiciones podemos describir a las prácticas como un puente diseñado para la transición de un entorno académico al contexto laboral complementando la formación de los estudiantes a través de la participación activa, el cumplimiento de reglamentos, la ampliación de perspectivas y el desarrollo de valores.  

**Reglamentos** 

Las practicas preprofesionales constituyen una parte elemental en el currículo universitario, siendo un requisito para la obtención del título profesional. Para esto el CES menciona en el artículo 44 del reglamento de régimen académico que las practicas deberán ser monitoreadas y coordinadas por el personal académico garantizando que el estudiante aplique sus competencias en  la  institución  receptora.  Es  debido  a  esto  que  la  institución  educativa  deberá  establecer convenios o cartas de compromiso con las contrapartes públicas o privadas para permitir el seguimiento de los practicantes a través de tutores. 

En cuanto a la cantidad de horas, esta dependerá de la carrera que este cursando el estudiante. Según el reglamento del Consejo de Educación Superior (2022) la cantidad mínima de horas correspondiente a prácticas preprofesionales para un estudiante de tercer nivel deberá ser de 240 horas las cuales se pueden distribuir entre 144 y 96, estimando que el cumplimiento de estas horas refleje la aplicación de conocimientos y destrezas adquiridos por los estudiantes. 

No obstante, el cumplimiento de las horas para la obtención del certificado va más allá de ser un simple requisito para la posterior titulación por lo que solo cumplirlas no debe ser el objetivo de los estudiantes universitarios y por ello es primordial el apoyo y seguimiento de la de las 

37 

instituciones  involucradas  enfocando  las  actividades  en  base  a  la  resolución  de  problemas profesionales (Rodríguez Díaz et al., 2022). 

Las normativas y directrices que regulan las prácticas preprofesionales en Ecuador son indispensables para la vinculación de los estudiantes con el sector productivo manteniendo sus derechos y evitando que este componente formativo se convierta en una relación laboral sin beneficios, es por esto que la carga diaria de horas no debe ser mayor a 6 y la cantidad de horas máximas puede ser distribuida por semestres, sin embargo, cada institución universitaria mantiene su propio reglamento, aunque este se deben basar con lo decretado por el CES. 

**Importancia laboral** 

Las  prácticas  preprofesionales  son  un  componente  esencial  para  la  integración  de conocimientos y el desarrollo de habilidades profesionales siendo a su vez la puerta de entrada al mundo laboral debido a que por medio de estás los estudiantes pueden crear una red de contactos, adquirir experiencia, mejorar la toma de decisiones y además se promueve la posibilidad de una futura inserción laboral. Arévalo Cordovilla, Campoverde Pico y Andaluz León. (2024). indican que el mercado laboral exige profesionales flexibles con conocimientos técnicos, pero también con la capacidad de adaptarse a la situación, las cuales son destrezas que deberían maximizarse en la formación de los practicantes. 

Las prácticas preprofesionales influyen en el aprendizaje integral juntando los dos pilares del saber, el saber ser y el saber hacer, conocimientos esenciales para la formación optima del profesional (Rodríguez Díaz et al., 2022). En la investigación de Guim & Marreno (2022) se menciona que además de los  conocimientos técnicos la experiencia de  prácticas  favorece  al desarrollo de competencias clave que son requeridas por las organizaciones como lo son la visión 

38 

interdisciplinaria, la creatividad, la innovación y el trabajo en equipo, habilidades blandas que incrementan las posibilidades de inserción en el mercado laboral.  

La investigación de Quilumba (2023) refuerza esta postura al estudiar el impacto de las prácticas en la formación de los estudiantes y llegando a la conclusión de que estas no solo complementan los conocimientos teóricos, sino que también mejoraron habilidades sociales de los practicantes tales como la responsabilidad y escucha activa, lo que demuestra la importancia de las prácticas en la formación de los futuros profesionales. 

Por otro lado, un reciente estudio realizado por Macas Padilla et al. (2025) determina que la formación basada en competencias en la que se basan las practicas preprofesionales no solo genera aprendizajes  significativos  en  valores  y  capacidades  técnicas  al  exponer  a  los  estudiantes  a escenarios reales, sino que también impulsa a la socialización profesional facilitando la transición de los estudiantes hacia las oportunidades laborales. 

Esta formación basada en competencias es fundamental, ya que ofrece a los estudiantes la oportunidad de fortalecer sus habilidades blandas, desarrollar técnicas, comprender una estructura organizacional, aprender el uso de herramientas  y consolidar su identidad como profesional, incrementando sus posibilidades de empleabilidad. 

**Desafíos en prácticas preprofesionales** 

Los  profesionales  en  formación  presentan  múltiples  desafíos  en  sus  practicas preprofesionales, desde el momento de elegir el lugar de prácticas ya sea por desconocimiento de lugares  o  debido  a  una  cantidad  limitada  de  vacantes  para  su  área,  hasta  la  realización  de actividades no relacionadas a su carrera o el desconocimiento previo con el que llegan a sus puestos presentando incertidumbre y desmotivación. Villamar Cahueñas (2024) menciona que son muy pocos los estudiantes que logran encontrar un buen lugar para la realización de sus prácticas por 

39 

cuenta propia y que las empresas suelen filtrar a los candidatos según sus niveles de experiencia y proactividad en base a los requerimientos del área y no solo aceptándolos por ser parte de la institución de convenio. 

La adaptación a situaciones inesperadas de forma frecuente es otro de los desafíos que los estudiantes deben enfrentar para su formación que si bien muchos estudiantes suelen desarrollar habilidades  de  resiliencia  y  adaptarse  a  las  situaciones  otros  se  estancan  y  requieren  de acompañamiento institucional (Arevalo Cordovilla et al., 2024). 

El autoaprendizaje es otro de los desafíos que deberán enfrentar los practicantes puesto que se ha evidenciado que los alumnos realizan las actividades que su tutor o responsable a cargo le ordena que no necesariamente son relacionadas a su carrera. Las empresas ven a los estudiantes como  mano de obra adicional y les  brindan la  oportunidad  de involucrarse  en un ambiente organizacional real y los inducen, pero con conocimientos básicos, es decir que no existe una guía con  el  paso  a  paso  por  lo  que  los  estudiantes  deben  ser  autodidactas,  siendo  observadores, investigando y practicando fuera del horario de prácticas (Naranjo y Ávila, 2024). 

Otro de los desafíos que enfrentan los estudiantes en prácticas preprofesionales es el brusco cambio de panorama pasando de un ambiente académico a un ambiente laboral real en el que un error puede desencadenar varios problemas. No obstante, los desafíos no deben ser un factor de desmotivación ya que a través del enfrentamiento de estos con resiliencia y proactividad los estudiantes logran aprender nuevos conocimientos y desarrollar nuevas habilidades. 

**Relación Estudiantes - Empresa** 

En el proceso de prácticas preprofesionales es evidente que los estudiantes tendrán que vincularse con una empresa de convenio sea pública o privada, sin embargo, las labores que desarrollarán dependerán de cada entidad puesto que cada una cuenta con un reglamento interno 

40 

al que el estudiante tendrá que adaptarse, así como proyectos que desarrollar, pero esta vinculación también contribuye a la consolidación de relaciones entre la institución y la empresa, así como la fomentación de competencias profesionales (Caamaño López et al., 2023). 

La relación entre la universidad y el sector empresarial crean un modelo de beneficio mutuo que  va  más  allá  del  cumplimiento  de  un  requisito  académico  para  estudiantes.  Mediante  la formación  de  acuerdos  de  cooperación  como  los  convenios  ambas  entidades  promueven  un intercambio estratégico  de recursos y  capacidades. Las prácticas son un medio de conexión reciproco en donde instituciones ofrecen a las empresas soporte y apoyo para sus proyectos, mientras que la institución recibe como beneficio espacios laborales para que sus estudiantes puedan desarrollar las prácticas preprofesionales (Fernández Medina et al., 2023). 

Por palabras de Ruiz Ducase (2024), el vínculo que se crea entre universidades y empresas es un componente estratégico que no solo garantiza la formación del estudiante adaptándolos a exigencias reales en el entorno profesional si no que es un promotor para su permanencia en las empresas poniendo en alto el nombre de las instituciones. 

Sabemos que el éxito de las practicas preprofesionales depende de varios factores y uno de ellos es la compatibilidad entre lo que realiza el estudiante y lo que estudia por lo que mantener una buena relación estudiante-empresa es algo crucial y responsabilidad de todos los involucrados, sean estudiantes, empresas y universidades debido a que en este convenio de formación todos se involucran por igual. 

41 

**Inteligencia artificial** 

La IA es una disciplina que tiene como objetivo simular aspectos del pensamiento humano, incluyendo el aprendizaje automático o Machine Learning, el Procesamiento de Lenguaje Natural (NLP),  la  visión  por  computadora,  los  sistemas  expertos,  la  robótica  y  el  razonamiento automatizado. Cada rama aborda diferentes aspectos del objetivo general de dotar a los sistemas computacionales de capacidades inteligentes para interpretar, aprender y actuar autónomamente en entornos complejos. (Instituto Data Science Argentina, 2025) 

**Plataforma Web Definición** 

Una plataforma web se define como un conjunto de tecnologías, herramientas y servicios que permiten la creación, gestión y funcionamiento de aplicaciones y servicios a través de internet; en otros términos, es un entorno en línea donde los usuarios pueden acceder y utilizar diversas funcionalidades, contenidos o servicios a través de un navegador web, sin depender de un sistema operativo específico .(Villacreses Chong, 2024) 

Se entiende por aplicación web a aquella solución de software que trasciende la simple publicación de contenidos estáticos para integrar una lógica de negocio dinámica y una gestión de datos centralizada. A diferencia del software de escritorio, su arquitectura delega el procesamiento pesado y la seguridad de la información a servidores remotos, permitiendo que la interacción del usuario ocurra de manera ubicua a través de un navegador estándar, independientemente del hardware utilizado (Márquez Coca et al., 2023). 

42 

En  base  a  las  definiciones  presentadas,  se  puede  establecer  que  las  plataformas  web constituyen una solución tecnológica que elimina las barreras de acceso tradicionales al no requerir instalación local, permitiendo a los usuarios interactuar con el sistema desde cualquier ubicación geográfica. Esta característica resulta especialmente relevante en el contexto del presente proyecto, donde tanto estudiantes como empresas necesitan acceder a la plataforma de matching desde diferentes dispositivos y ubicaciones para gestionar el proceso de prácticas preprofesionales. 

**Características de las Aplicaciones Web** 

Según Márquez Coca et al. (2023), el desarrollo web moderno se distingue por una serie de  ventajas  operativas  frente  al  software  tradicional  de  escritorio,  destacando  cuatro  pilares fundamentales: 

- Ubicuidad y Accesibilidad: La naturaleza distribuida de la web permite que el software esté disponible 24/7 desde cualquier ubicación geográfica, requiriendo únicamente un navegador y conexión a internet. 
- Centralización del Mantenimiento: Al residir la lógica en el servidor, las actualizaciones y correcciones  de  errores  se  despliegan  instantáneamente  para  todos  los  usuarios  sin necesidad de intervenir en sus equipos. 
- Escalabilidad: Estas plataformas pueden adaptarse al crecimiento de la demanda (aumento de tráfico o datos) mediante la asignación dinámica de recursos en el servidor. 
- Independencia  de  la  Plataforma  (Reducción  de  costos):  Al  ser  agnósticas  al  sistema operativo  del  cliente  (Windows,  Linux,  macOS,  Android),  eliminan  la  necesidad  de 

43 

desarrollar  múltiples  versiones  nativas,  reduciendo  significativamente  los  costos  de desarrollo y soporte. 

` `Estas características validan a la plataforma web como la alternativa tecnológica idónea para el sistema propuesto. La accesibilidad universal garantizará que tanto estudiantes como empresas puedan interactuar con la plataforma de *matching* sin barreras de hardware, mientras que el mantenimiento centralizado facilitará la gestión ágil de perfiles y vacantes, asegurando que la información crítica esté siempre sincronizada y actualizada para todos los actores involucrados. 

**Arquitectura Cliente-Servidor** 

La arquitectura cliente-servidor tradicional constituye la base de las aplicaciones web modernas.  Según  Llamuca-Quinaloa,  Vera-Vincent  y  Tapia-Cerda.  (2021)  en  este  modelo arquitectónico el sistema se divide estrictamente en dos roles: el cliente, que opera desde el navegador web y realiza peticiones de recursos, y el servidor, que centraliza el procesamiento y la lógica de negocio. Esta separación permite que el servidor gestione la carga computacional pesada y la seguridad de los datos, enviando al cliente únicamente la información necesaria (generalmente en formato HTML o JSON) para su visualización. 

La  adopción  de  esta  arquitectura  es  indispensable  para  la  plataforma  de  *matching* propuesta. Al igual que se describe en el estudio de Llamuca-Quinaloa et al., el sistema requiere desacoplar  el  Frontend  (React.js,  Next.js)  del  Backend  (Python,  Flask)  para  optimizar  el rendimiento. Esta separación garantiza que el servidor pueda dedicar sus recursos a la ejecución de los algoritmos de Inteligencia Artificial (NLP) sin verse ralentizado por la gestión de la interfaz gráfica, asegurando así que los estudiantes reciban recomendaciones de vacantes en tiempo real sin latencia perceptible. 

44 

**Figura 1** 

*Arquitectura Cliente-Servidor propuesta para la plataforma de matching* 

![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.037.png)

**Nota.** El esquema ilustra la separación de responsabilidades en el sistema. El Cliente Web (Frontend) gestiona la interfaz y solicita datos vía HTTP, mientras que el Servidor de Aplicaciones (Backend) centraliza la lógica de negocio y los algoritmos NLP, siendo el único punto de acceso seguro a la Base de Datos PostgreSQL. Fuente: Elaboración propia. 

**Modelo de Aplicación Web (SPA)** 

La arquitectura de Página Única (SPA) es un modelo de desarrollo web donde la aplicación carga un único documento HTML al inicio y actualiza dinámicamente el contenido mediante JavaScript, eliminando la necesidad de recargas completas de página. Según Phan Khoi (2024), a diferencia de las Aplicaciones de Múltiples Páginas (MPA) tradicionales que solicitan al servidor un nuevo código HTML por cada interacción del usuario, las SPA operan solicitando únicamente los datos necesarios (usualmente en formato JSON) y renderizándolos en el navegador. Esta técnica  reduce  drásticamente  la  latencia  y  el  consumo  de  ancho  de  banda,  permitiendo  una navegación fluida similar a la de una aplicación de escritorio nativa, lo cual es crítico en sistemas modernos que requieren alta interactividad. 

Para este proyecto de Matching Bidireccional, se adopta el modelo SPA utilizando React.js y Next.js debido a su capacidad para desacoplar la interfaz de usuario del procesamiento lógico del servidor. Al integrar módulos de Inteligencia Artificial (NLP) en el backend, es vital que el frontend no se bloquee mientras se procesan los algoritmos de similitud; tal como se fundamenta en la **Tabla 1**, la arquitectura SPA permite que el usuario siga interactuando con la plataforma de 

45 

forma asíncrona, evitando el "parpadeo" de recarga y garantizando que la visualización de las vacantes  recomendadas  sea  instantánea  en  cuanto  el  motor  de  IA  devuelve  los  resultados vectorizados. 

**Tabla 1** 

*Diferencias Estructurales Clave: SPA vs. MPA*** 



|**Aspecto Diferencial** |**Single Page Application (SPA)** |**Multi Page Application (MPA)** |
| - | - | - |
|<p>Experiencia de Navegación Intercambio de Datos </p><p>Arquitectura de Software </p>|<p>**Fluida:** Actualiza el contenido dinámicamente sin recargar la página (cero parpadeos). </p><p>**Eficiente (JSON):** Consume solo datos puros desde la API, ideal para respuestas de IA. </p><p>**Desacoplada:** Frontend y Backend funcionan independientemente (cliente-servidor puro). </p>|<p>**Interrumpida:** Recarga la página completa y sus recursos en cada clic del usuario. </p><p>**Redundante (HTML):** El servidor reenvía la estructura visual completa constantemente. </p><p>**Acoplada:** La lógica del servidor y la interfaz visual son interdependientes. </p>|

*Nota.* Elaboración propia basada en la comparativa de rendimiento de Phan Khoi (2024). 

**Procesamiento de lenguaje natural (NLP)** 

El Procesamiento de Lenguaje Natural (NLP) se ha consolidado como el pilar fundamental para la interacción hombre-máquina. Majumder et al. (2020) definen al NLP como el campo interdisciplinario donde convergen la inteligencia artificial y la lingüística computacional, cuyo objetivo no es solo procesar texto como datos, sino dotar a las computadoras de la capacidad de comprender, interpretar y manipular el lenguaje humano en contextos reales. Estos autores señalan que, a diferencia de las bases de datos tradicionales, el NLP permite resolver problemas complejos de ambigüedad semántica, siendo esencial para aplicaciones modernas de clasificación de texto y sistemas de recomendación. 

46 

La  implementación  de  técnicas  de  NLP  es  indispensable  debido  a  la  naturaleza  no estructurada de la información. Las vacantes empresariales y los perfiles estudiantiles se componen de texto libre, no de categorías rígidas. Sin el uso de NLP, el sistema sería incapaz de detectar que "Manejo  de  React"  y  "Desarrollo  Frontend  con  librerías  JS"  son  conceptos  técnicamente vinculados, lo que resultaría en una pérdida significativa de oportunidades de práctica (falsos negativos). 

**Evolución Histórica** 

La evolución del Procesamiento de Lenguaje Natural (PLN) ha estado marcada por un cambio de paradigma radical en las últimas décadas. Giraldo Forero & Orozco Duque (2023), en su análisis sobre el estado del arte de esta tecnología, explican que los primeros algoritmos de PLN eran sistemas basados puramente en reglas gramaticales manuales, lo que limitaba su capacidad de adaptación. Sin embargo, los autores señalan que la integración de técnicas de Inteligencia Artificial permitió transitar hacia modelos de clasificación supervisada y estadística (como la regresión logística y máquinas de soporte vectorial), los cuales son capaces de aprender patrones automáticamente a partir de datos, superando la rigidez de los enfoques simbólicos tradicionales. 

En  el  desarrollo  de  sistemas  inteligentes,  el  dataset  constituye  la  infraestructura fundamental  que  alimenta  los  modelos  algorítmicos.  Sarker  (2021),  en  su  análisis  sobre aplicaciones de aprendizaje automático en el mundo real, define al dataset como una colección organizada de datos que contiene instancias y atributos (características) representativos de un dominio específico. El autor establece que la calidad de este conjunto de datos es más determinante que  la  complejidad  del  algoritmo  mismo;  para  que  un  sistema  de  software  pueda  generar predicciones  o  recomendaciones  válidas,  el  dataset  debe  estar  libre  de  inconsistencias  y 

47 

estructurado de tal forma que permita a la máquina detectar patrones matemáticos ocultos entre las variables. 

Para esta plataforma web, el dataset no es un archivo estático, sino una estructura dinámica compuesta por los registros de Vacantes (Oferta) y Perfiles Estudiantiles (Demanda) almacenados en la base de datos PostgreSQL. Al adoptar esta definición técnica, se justifica el proceso de extracción de datos (Data Fetching) desde el backend; el sistema toma estos registros crudos y los convierte en una matriz de características procesable. Sin esta estructuración rigurosa del dataset, el motor de similitud del coseno carecería de los vectores numéricos necesarios para calcular la afinidad entre un estudiante y una empresa. 

**Técnicas de Preprocesamiento de Texto** 

La eficacia de cualquier modelo de similitud depende directamente de la calidad de los datos  de entrada.  Han et al.  (2022)  establecen en sus  principios de minería de datos  que el preprocesamiento es la fase crítica donde se reduce el ruido y la dimensionalidad del texto crudo; un  proceso  deficiente  en  esta  etapa  conduce  inevitablemente  a  resultados  erróneos  en  los algoritmos de aprendizaje, bajo la premisa de "basura entra, basura sale". 

A continuación, se describen las técnicas secuenciales implementadas en el sistema: 

1. **Tokenización  (Tokenization)**  Este  proceso  constituye  la  unidad  fundamental  del 

análisis léxico. Según , Kowsari et al. (2019) en su estudio sobre algoritmos de clasificación de texto, la tokenización se define como el método de descomponer un flujo de texto continuo (oraciones o párrafos) en elementos atómicos denominados "tokens" (palabras, frases clave o símbolos). Los autores explican que esta separación es indispensable porque los algoritmos de 

48 

aprendizaje automático no pueden procesar cadenas de caracteres crudas; requieren una estructura discretizada donde cada palabra pueda ser tratada como una característica (feature) independiente para su posterior vectorización. 

2. **Eliminación  de  Stopwords  (Palabras  Vacías)**  Una  vez  tokenizado  el  texto,  es 

necesario filtrar el ruido. Sarkar (2019) argumenta que las "stopwords" (artículos, preposiciones, pronombres) constituyen la mayor parte del volumen de un texto humano pero aportan una carga semántica casi nula para el análisis computacional. Siguiendo la recomendación de este autor, la eliminación  de  estos  términos  permite  que  el  vector  resultante  represente  exclusivamente  el contenido  sustantivo  (habilidades  y  requerimientos),  optimizando  así  el  rendimiento computacional y la precisión del cálculo de similitud. 

3. **Lematización  (Lemmatization)**  Para  estandarizar  el  vocabulario,  se  opta  por  la 

lematización sobre el stemming. Majumder et al. (2020) destacan que, mientras el stemming corta palabras de forma agresiva (a menudo generando raíces sin sentido), la lematización utiliza un análisis morfológico detallado y diccionarios léxicos para devolver la palabra a su forma base o "lema" (ej. transformar "programando" a "programar"). En el contexto de este proyecto, esta distinción es crucial para asegurar que las competencias técnicas escritas en diferentes tiempos verbales sean tratadas como la misma habilidad. 

4. **Vectorización y Representación (Sentence Embeddings)** Una vez limpiado el texto, 

es  indispensable  transformarlo  en  una  representación  numérica  vectorial  que  preserve  el significado del contenido. A diferencia de los métodos estadísticos tradicionales (como TF-IDF) que solo cuentan coincidencias exactas de palabras, este proyecto implementa Word Embeddings basados en arquitecturas de Transformadores (como SBERT). 

49 

Según  Reimers  y  Gurevych  (2019),estos  modelos  generan  vectores  densos  donde  las palabras con significados  similares  se ubican cerca en el  espacio  matemático, incluso si  no comparten la misma grafía. Esto permite que el sistema entienda que términos como 'Desarrollo Web' y 'Programación Frontend' están semánticamente relacionados, solucionando el problema de la disparidad de vocabulario entre lo que escribe un estudiante y lo que solicita una empresa.** 

La arquitectura de datos diseñada para esta plataforma adopta un enfoque de reducción de ruido secuencial. Tal como se esquematiza a continuación en la **Figura 2**, el sistema no procesa las  descripciones  de  las  vacantes  en  su  estado  nativo,  sino  que  las  somete  a  un  flujo  de transformación riguroso. Este diseño es crítico para la investigación porque garantiza la integridad del  espacio  vectorial:  al  eliminar  elementos  sintácticos  irrelevantes  (stopwords)  y  unificar variantes morfológicas (lematización) antes de la vectorización, se logra que el algoritmo de Similitud del Coseno opere exclusivamente sobre los núcleos semánticos de las competencias técnicas. De esta forma, el gráfico ilustra cómo el sistema convierte una entrada ambigua y ruidosa en una estructura de datos limpia y matemáticamente comparable, maximizando la precisión del matching final. 

50 

**Figura 2** 

*Implementación del Pipeline de Preprocesamiento* 

![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.038.jpeg)

*Nota:* Diagrama de flujo del proceso de limpieza de texto implementado. Elaboración propia basada en el flujo estándar de procesamiento descrito por Sarkar (2019). 

51 

**Modelos de similitud semántica** 

Para  determinar  la  afinidad  entre  una  vacante  y  un  perfil  profesional,  no  basta  con transformar el texto en números; es necesario aplicar un modelo matemático que cuantifique la proximidad dentro del Espacio Vectorial. La literatura técnica en sistemas de recomendación clasifica las métricas de evaluación en tres categorías principales según su enfoque geométrico: basadas en conjuntos, basadas en distancia lineal y basadas en orientación angular (Han et al., 2022). 

**Análisis comparativo de métricas**  

En el diseño de motores de emparejamiento, se evaluaron distintas métricas estándar para determinar su viabilidad en el contexto de las prácticas preprofesionales: 

1. **Coeficiente de Jaccard:** Este modelo calcula la similitud como la intersección de dos conjuntos dividida por su unión. Aunque es útil para comparar listas simples de etiquetas, su desventaja crítica es que ignora tanto la frecuencia como el significado contextual de los términos. Si un estudiante utiliza sinónimos técnicos o describe una habilidad de forma narrativa, Jaccard no captura esa relevancia semántica, tratándolo como un término distinto y reduciendo erróneamente el porcentaje de afinidad (Yadalam et al., 2020). 
1. **Distancia Euclidiana:** Es la métrica más intuitiva, pues mide la distancia lineal recta entre dos puntos en el espacio. Sin embargo, en minería de texto presenta un defecto mayor: es extremadamente sensible a la magnitud del vector. Esto significa que si se compara un documento largo con uno corto, la distancia será grande (indicando baja similitud) aunque 

52 

ambos hablen del mismo tema, lo que genera falsos negativos en el reclutamiento (Han et al., 2022) 

3. **Similitud del Coseno:** A diferencia de la anterior, esta métrica mide el coseno del ángulo entre dos vectores. Su principal fortaleza radica en que se enfoca en la "dirección" del contenido y no en su "longitud", siendo el estándar para comparar documentos de tamaños desiguales (Han et al., 2022).  

**Tabla 2** 

*Comparativa de métricas para el emparejamiento de perfiles.* 



|**Métrica** |**Principio Matemático** |**Ventaja Principal** |**Desventaja Crítica en Reclutamiento** |
| - | :- | - | - |
|<p>**Coeficiente de Jaccard** </p><p>**Distancia Euclidiana** </p><p>**Similitud del Coseno** </p>|<p>Intersección de Conjuntos </p><p>Distancia Lineal Recta (L\_2) </p><p>Ángulo entre Vectores </p>|<p>Eficiente para listas de etiquetas simples o datos binarios. </p><p>Intuitiva y fácil de calcular en espacios de baja dimensión. </p><p>Agnóstico a la longitud. Se enfoca en la orientación semántica. </p>|<p>Ignora el contexto semántico; no detecta sinónimos (ej: 'React' vs 'JS') ni relaciones conceptuales. Extremadamente sensible a la longitud del documento. Penaliza textos cortos (estudiantes) frente a largos (empresas). </p><p>Computacionalmente más costosa que Jaccard, pero más precisa para textos descriptivos. </p>|

**Nota**: Elaboración propia basada en los criterios teóricos de Han et al. (2022). 

Basado en el análisis anterior y las comparativas métricas de la **Tabla 2**, se implementa la Similitud del Coseno como el núcleo del motor de inferencia. Según (Moiz et al., 2021), quienes aplicaron  este  algoritmo  específicamente  en  sistemas  de  pasantías  universitarias,  el  Coseno 

53 

permite normalizar la verbosidad de las descripciones. Matemáticamente, el cálculo se realiza mediante el producto punto de los vectores (Estudiante) y (Empresa) dividido por el producto de sus magnitudes euclidianas, resultando en un valor acotado entre 0 y 1. 

La formulación matemática que rige el sistema es: 

⋅ ∑

Similitud( , ) =  = =1

‖ ‖‖ ‖ ![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.039.png)

√∑ =1 2 √∑ =1 2

La implementación de este algoritmo responde a una necesidad crítica del proyecto: la disparidad en la longitud de los textos. En las prácticas preprofesionales, es común que las empresas publiquen ofertas extensas y detalladas, mientras que los estudiantes redactan perfiles técnicos muy concisos. Tal como se evidencia en la comparación de métricas, el uso de la Distancia Euclidiana penalizaría a los postulantes por tener descripciones breves. Al optar por la Similitud del Cosen**o**, el sistema neutraliza esta diferencia de verbosidad y evalúa estrictamente la alineación de las competencias técnicas (Hard Skills), garantizando que el ranking de recomendaciones se base en la calidad del contenido y no en la cantidad de palabras. 

**Matching Bidireccional** 

**Sistemas de Recomendación Recíproca en el contexto de prácticas preprofesionales** 

En los procesos de asignación de prácticas preprofesionales no existe una relación de selección unidireccional, como ocurre en los sistemas de recomendación tradicionales de comercio electrónico, donde únicamente el usuario elige un producto. En este contexto, tanto el estudiante 

54 

como la empresa actúan como entidades activas que evalúan mutuamente su compatibilidad, dando lugar a un proceso de decisión de dos vías. Este tipo de escenarios es abordado por los Sistemas de Recomendación Recíproca (Reciprocal Recommender Systems, RRS), cuyo objetivo principal es  maximizar  la  afinidad  entre  dos  conjuntos  de  usuarios  con  intereses  y  criterios  propios, considerando simultáneamente las preferencias del postulante y los requisitos de la organización (Palomares et al., 2021). 

Desde  una  perspectiva  de  intermediación  laboral,  los  RRS  permiten  modelar  el emparejamiento empresa–candidato como un problema de optimización de compatibilidad mutua, donde no basta con recomendar vacantes al estudiante, sino que también se debe estimar el grado de adecuación del perfil académico frente a las necesidades técnicas de la empresa. Este enfoque resulta especialmente pertinente para el presente proyecto, ya que la plataforma propuesta busca generar  porcentajes  de  afinidad  basados  en  similitud  semántica  entre  competencias  y requerimientos, fortaleciendo así el proceso de selección bidireccional (Palomares et al., 2021) 

**Tipos de Filtrado en Sistemas de Recomendación** 

La literatura sobre sistemas de recomendación clasifica los métodos de generación de sugerencias en dos enfoques principales: el filtrado colaborativo y el filtrado basado en contenido. 

- Filtrado Colaborativo: Fundamenta sus recomendaciones en el comportamiento histórico de usuarios similares, utilizando patrones de interacción previos para inferir preferencias. 
- Filtrado Basado en Contenido: Se apoya en el análisis directo de las características de los elementos  a  comparar,  en  este  caso,  la  información  textual  de  los  currículums  y  las 

55 

descripciones de vacantes, para calcular su grado de similitud (Guevara Fernandez y Coral Ygnacio, 2023). 

En el ámbito del reclutamiento y las prácticas preprofesionales, el filtrado basado en contenido adquiere una relevancia particular, ya que permite comparar competencias, habilidades técnicas y formación académica del estudiante con los requisitos especificados por la empresa, sin depender de evaluaciones previas de otros usuarios. Este enfoque se integra de forma natural con técnicas de Procesamiento de Lenguaje Natural (NLP), al posibilitar la representación vectorial del  contenido  y  el  cálculo  de  similitud  semántica,  constituyendo  la  base  del  motor  de emparejamiento propuesto en esta investigación (Guevara Fernandez & Coral Ygnacio, 2023). 

La elección del filtrado basado en contenido no es solo una decisión técnica, sino una necesidad  operativa  para  la  arquitectura  del  software  propuesto.  Al  fundamentar  el emparejamiento exclusivamente en las características intrínsecas de los perfiles (los vectores semánticos generados por el modelo de Transformadores), el sistema se vuelve determinista y transparente. Esto significa que la recomendación no es una 'caja negra' basada en gustos subjetivos de terceros, sino el resultado matemático de comparar el vocabulario técnico del estudiante con el de la vacante, asegurando que cada sugerencia tenga un respaldo lógico verificable en el contenido de los documentos. 

**Problema del Arranque en Frío (Cold Start)** 

Uno de los principales desafíos en la implementación de sistemas de recomendación es el denominado problema del “arranque en frío” (Cold Start), el cual se presenta cuando no existe suficiente  información  histórica  de  usuarios  o  interacciones  para  aplicar  técnicas  de  filtrado colaborativo de manera confiable. Esta situación es común en plataformas nuevas, donde aún no 

56 

se  dispone  de  datos  de  comportamiento  que  permitan  establecer  patrones  de  similitud  entre postulantes o empresas (Gabriel  Amaya, 2021). 

En  escenarios  de  arranque,  los  enfoques  basados  en  contenido  se  convierten  en  la alternativa más adecuada, ya que permiten generar recomendaciones utilizando únicamente la información explícita disponible en los perfiles y en las descripciones de las vacantes. Para una plataforma de prácticas preprofesionales como la propuesta, este enfoque resulta especialmente pertinente,  dado  que  el  sistema  puede  calcular  la  afinidad  semántica  entre  competencias  y requerimientos desde el primer momento, sin depender de históricos de postulaciones previas, mitigando así el problema de cold start y garantizando un proceso de matching bidireccional funcional desde su fase inicial. 

**Herramientas de desarrollo** 

La  selección  de  herramientas  y  tecnologías  para  el  desarrollo  de  una  plataforma  de *matching* bidireccional implica no sólo elegir librerías y servicios populares, sino fundamentar esas  elecciones  en  criterios  técnicos  replicables:  rendimiento  (latencia,  throughput), mantenibilidad  (modularidad,  pruebas),  escalabilidad  (horizontal/vertical),  disponibilidad  de ecosistema (paquetes, soporte) y compatibilidad con los requisitos no funcionales del proyecto (privacidad,  despliegue,  acceso  concurrente).  En  proyectos  que  integran  modelos  de Procesamiento de Lenguaje Natural (NLP) y cálculos de similitud semántica, la tecnología debe además facilitar el procesamiento vectorial y el tratamiento eficiente de textos no estructurados en producción (Gabriel Amaya, 2021) 

57 

**Tecnologías Frontend** 

React es una biblioteca de código abierto basada en JavaScript, desarrollada y mantenida por Meta (anteriormente Facebook), que se ha consolidado como el estándar de facto para la construcción de interfaces de usuario dinámicas. De acuerdo con el análisis de Paucar Mayanquer (2023), la innovación disruptiva de React radica en su implementación del **Virtual DOM** (Modelo de Objetos del Documento Virtual), una representación ligera y en memoria de la estructura del documento HTML real. A diferencia de la manipulación tradicional del DOM, que es costosa computacionalmente y lenta debido a los repintados constantes del navegador, React emplea un algoritmo de reconciliación (*Diffing Algorithm*) que compara el estado anterior y el nuevo del Virtual DOM para calcular la diferencia mínima necesaria y aplicar solo esos cambios específicos al DOM real. 

Además, la arquitectura de React fomenta el flujo de datos unidireccional (*One-Way Data Binding*). Según explican Banks y Porcello (2020) en su obra sobre patrones de diseño modernos, esto significa que los datos fluyen siempre desde los componentes padres hacia los hijos a través de propiedades (*props*), lo que hace que el estado de la aplicación sea predecible y fácil de depurar. Para un sistema de recomendación de empleos donde la consistencia de los datos mostrados (vacantes,  porcentajes  de afinidad)  es vital,  esta característica asegura  que la interfaz visual siempre esté sincronizada con la lógica de negocio, evitando inconsistencias de estado que son comunes en frameworks de enlace bidireccional más antiguos. 

58 

**Figura 3** 

*Análisis comparativo Global: React vs Angular vs Vue* 

![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.040.jpeg)

**Nota.** La gráfica evidencia la hegemonía de React (línea azul) sobre sus competidores, validando su elección por soporte y comunidad. Fuente: Google Trends (2025). 

**Figura 4** 

*Análisis comparativo Ecuador: React vs Angular vs Vue* 

![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.041.jpeg)

**Nota.** El uso de React en Ecuador muestra picos de interés superiores, lo que garantiza la disponibilidad de talento técnico. Fuente: Google Trends (2025). 

59 

La elección de React para este proyecto es estratégica y técnica. Dado que la plataforma requiere interfaces complejas con múltiples filtros dinámicos que deben actualizarse en tiempo real sin recargar la página, el Virtual DOM de React ofrece el rendimiento necesario para mantener la fluidez. Además, su ecosistema de componentes reutilizables permitieron acelerar el desarrollo: elementos como las "tarjetas de vacante" o los "formularios de perfil" se programaron una sola vez y se instanciaron en múltiples vistas, garantizando consistencia visual y reduciendo la deuda técnica, una eficiencia que respalda su liderazgo en la industria tal como se ve reflejada en la **Figura 3** y **Figura 4**. 

**Framework de desarrollo** 

Next.js  es  un  framework  de  desarrollo  web  creado  por  Vercel  que  permite  a  los desarrolladores construir aplicaciones web full-stack extendiendo las capacidades de la biblioteca React. Según la documentación técnica de Vercel (2024), este framework se distingue por su capacidad de realizar renderizado híbrido, permitiendo que el desarrollador elija entre *Static Site Generation*  (SSG)  y  *Server-Side  Rendering*  (SSR)  según  las  necesidades  de  cada  ruta.  Esta arquitectura permite que el contenido sea procesado en el servidor antes de llegar al cliente, optimizando el rendimiento y garantizando que la aplicación sea plenamente indexable por los motores  de  búsqueda  (SEO),  superando  la  limitación  de  las  aplicaciones  tradicionales  de renderizado en el cliente. 

Asimismo, Next.js introduce optimizaciones críticas como el Image Optimization y el *Middleware*. De acuerdo con Vercel (2024), estas herramientas permiten una entrega de contenido más rápida y segura, gestionando la lógica de autenticación y redireccionamiento en el "borde" (Edge), lo que reduce la latencia global y mejora la experiencia del usuario final en plataformas de alta demanda. 

60 

La implementación de Next.js responde a una necesidad crítica de rendimiento y visibilidad para la plataforma. Dado que el sistema de *matching* bidireccional maneja datos dinámicos que deben actualizarse en tiempo real (como las nuevas vacantes y perfiles), el uso de *Server-Side Rendering* (SSR) asegura que la información sea siempre fresca y que, a su vez, las ofertas de prácticas sean fácilmente indexables en búsquedas orgánicas. Al delegar el renderizado al servidor, liberamos carga computacional del dispositivo del estudiante, garantizando una navegación fluida incluso en condiciones de conectividad limitada. Esta elección tecnológica se valida con la realidad del mercado: su popularidad en la comunidad de desarrollo demuestra su utilidad y adaptabilidad y se ve reflejada en la **Figura 5 y Figura 6**, donde se evidencia que Next.js mantiene una tendencia de  adopción  superior  a  otras  librerías  tradicionales  tanto  a  nivel  global  como  en  Ecuador, asegurando así la sostenibilidad y soporte a largo plazo del proyecto. 

**Figura 5** 

*Análisis comparativo Global: Next.js vs Nuxt vs SvelteKit* 

![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.042.jpeg)

**Nota:** El gráfico demuestra la hegemonía de Next.js sobre otros frameworks de su categoría a nivel mundial, lo que justifica su elección por la amplia documentación y soporte disponible. Fuente: Google Trends (2025). 

61 

**Figura 6** 

*Análisis comparativo Ecuador: Next.js vs Nuxt vs SvelteKit* 

![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.043.jpeg)

**Nota:** La tendencia en Ecuador refleja un crecimiento constante en el interés por Next.js, alineándose con las demandas tecnológicas del Ecuador para proyectos de software escalables. Fuente: Google Trends (2025). 

**Herramienta backend Python** 

Python se define como un lenguaje de programación de alto nivel que se ha posicionado como el "núcleo tecnológico" indiscutible para la innovación empresarial y científica moderna. Según una investigación reciente presentada en Medina Condori et al. (2024), su arquitectura robusta y versátil facilita la integración de múltiples funcionalidades críticas, desde la gestión de bases de datos hasta la automatización de tareas complejas. Su dominio en el mercado se debe a su  capacidad  para  simplificar  el  desarrollo  de  algoritmos  lógicos  mediante  bibliotecas especializadas, permitiendo a los ingenieros centrarse en la resolución del problema de negocio más que en la sintaxis del código. 

62 

Python también cuenta micro frameworks, uno de ellos es Flask, que a diferencia de las arquitecturas monolíticas, no impone dependencias rígidas ni herramientas predefinidas. Según la reciente investigación de Pinto Demera & Morejón López (2025), su diseño minimalista permite a los desarrolladores construir aplicaciones web escalables integrando únicamente las librerías necesarias para el proyecto. Esta característica es crítica para el desarrollo ágil, ya que facilita la creación de APIs y microservicios sin la sobrecarga de código que generan frameworks más pesados como Django, optimizando así el rendimiento en el intercambio de datos. 

El Procesamiento de Lenguaje Natural (PLN) es el campo de la Inteligencia Artificial que permite a las máquinas interpretar el lenguaje humano. Según una revisión sistemática de Delso Vicente et al. (2024), Python es el lenguaje estándar para esta disciplina debido a su ecosistema de librerías  avanzadas  que  permiten analizar grandes volúmenes de texto en tiempo  real.  Estas herramientas facilitan la tokenización, el análisis semántico y la vectorización de documentos, procesos esenciales para transformar descripciones textuales (como perfiles profesionales) en datos numéricos comparables. 

La arquitectura del sistema de matching requiere un backend capaz de procesar operaciones matemáticas complejas sin sacrificar el rendimiento web. Se ha seleccionado **Python** como el núcleo del sistema porque es la única tecnología que ofrece soporte nativo para las librerías de NLP necesarias para calcular la similitud semántica entre vacantes y estudiantes. Para exponer esta lógica  al  mundo,  utilizamos  Flask,  ya  que  su  ligereza  permite  procesar  las  peticiones  de recomendación con menor latencia que un framework monolítico. Esta elección no solo es técnica, sino  estratégica:  su  popularidad  en  la  comunidad  de  desarrollo  demuestra  su  utilidad  y adaptabilidad y se ve reflejada en la **Figura 7 y Figura 8**, donde se confirma que Python lidera las 

63 

tendencias de búsqueda tanto a nivel global como en Ecuador, garantizando que el proyecto se construye sobre una tecnología sostenible y en constante evolución. 

**Figura 7** 

*Análisis comparativo Global: Python vs PHP vs Java (2024-2025)* 

![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.044.jpeg)

**Nota:** La gráfica mundial ratifica el dominio de Python, impulsado por el auge de la IA, superando ampliamente a lenguajes tradicionales. Fuente: Google Trends (2025). 

64 

**Figura 8** 

*Análisis comparativo Ecuador: Python vs PHP vs Java (2024-2025)* 

![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.045.jpeg)

**Nota:** A nivel nacional, la tendencia muestra un interés creciente y sostenido por Python, validando su pertinencia en el mercado laboral ecuatoriano. Fuente: Google Trends (2025). 

**Base de datos PostgreSQL** 

PostgreSQL se ha establecido como el estándar de referencia en sistemas de gestión de bases de datos relacionales debido a su capacidad para manejar cargas de trabajo concurrentes complejas. Según el estudio reciente de Salunke & Ouda (2024), publicado en la revista Future Internet, PostgreSQL demuestra un rendimiento superior en operaciones de selección (*SELECT* queries) en comparación con MySQL, siendo hasta 9 veces más eficiente en escenarios de alta latencia. Esta arquitectura robusta garantiza que la plataforma pueda escalar verticalmente, 

65 

procesando miles de peticiones de matching por segundo sin comprometer la estabilidad del sistema, un requisito indispensable para la naturaleza transaccional del proyecto. 

PostgreSQL ha evolucionado hacia un motor híbrido que combina el modelo relacional tradicional con soporte avanzado para datos semiestructurados, como los almacenados en formato JSONB. Esto le permite gestionar documentos complejos dentro de un esquema relacional sin renunciar a las garantías ACID (Atomicidad, Consistencia, Aislamiento y Durabilidad). En estudios comparativos entre motores relacionales y NoSQL se ha observado que PostgreSQL ofrece **rendimientos competitivos en consultas y operaciones con estructuras complejas**, especialmente cuando se emplean índices adecuados y estructuras híbridas, lo que lo convierte en una solución robusta para aplicaciones que requieren integridad transaccional y flexibilidad de esquema, como sistemas de emparejamiento laboral con datos heterogéneos (Mihai, 2020). 

La implementación de PostgreSQL en la plataforma responde a una decisión arquitectónica fundamental: la necesidad de un entorno híbrido que soporte la complejidad del *matching*. Mientras que la gestión de credenciales y la vinculación empresarial requieren la integridad referencial estricta de un modelo relacional, el almacenamiento de los vectores semánticos y los perfiles de competencias demanda la flexibilidad de una estructura documental. Al optar por el uso nativo de JSONB, se unifica la robustez transaccional con la versatilidad de almacenamiento en un solo motor, evitando la dispersión de datos. Esta estrategia se ve respaldada por la realidad del mercado tecnológico; tal como se evidencia en la **Figura 9** y **Figura 10**, PostgreSQL mantiene una hegemonía técnica sobre alternativas como MySQL y MongoDB, garantizando no solo el rendimiento actual, sino también la escalabilidad y soporte a largo plazo del proyecto en el entorno ecuatoriano y global. 

66 

**Figura 9** 

*Análisis comparativo Global: PostgreSQL vs MySQL vs MongoDB (2024-2025)* 

![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.046.jpeg)

**Nota:** El gráfico mundial evidencia cómo PostgreSQL ha superado a sus competidores en interés técnico, gracias a su capacidad de unificar SQL y NoSQL. Fuente: Google Trends (2025). 

**Figura 10** 

*Análisis comparativo Ecuador: PostgreSQL vs MySQL vs MongoDB (2024-2025)* 

![](Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.047.jpeg)

**Nota:** En Ecuador, la tendencia confirma la preferencia por PostgreSQL en proyectos de ingeniería de software, garantizando disponibilidad de soporte local. Fuente: Google Trends (2025). 

67 

<a name="_page74_x69.00_y72.00"></a>**Preguntas científicas a contestarse** 

¿La implementación  de una plataforma web de matching  bidireccional para prácticas preprofesionales, basada en técnicas de NLP y modelos de similitud semántica, permitirá optimizar los tiempos de búsqueda y selección, asegurando una mayor compatibilidad entre los perfiles de los estudiantes y los requerimientos de las empresas? 

<a name="_page74_x69.00_y225.00"></a>**Definiciones conceptuales** 

**NLP:** Se trata de una rama de la inteligencia artificial y el maching learning, la cual permite a los sistemas computacionales procesar, entender y generar información en lenguaje humano mediante técnicas avanzadas como transformación, vectorización y normalización de palabras, aspectos útiles para los modelos de clasificación, análisis semántico y extracción de información aplicable a múltiples dominios. (Gardazi, Daud et al., 2025) 

**Matching bidireccional:** Consiste en un sistema de recomendación reciproco para las partes donde se satisfacen las preferencias de ambos lados de la relación, siendo la contraparte de los sistema tradicionales que evalúan las preferencias de una sola dirección (Yang et al., 2024). 

**Plataforma Web:** Una plataforma web, o aplicación web moderna, se define como una solución de software distribuida que reside en servidores remotos y es accesible a través de navegadores estándar, eliminando la necesidad de instalación local. A diferencia de los sitios estáticos, estas plataformas integran arquitecturas dinámicas que permiten la gestión de usuarios, el procesamiento de transacciones y la interacción en tiempo real mediante el uso de tecnologías de vanguardia que aseguran escalabilidad y seguridad en el intercambio de datos (Márquez Coca et al., 2023)**.** 

68 

**Frontend:**  También  denominado  desarrollo  del  lado  del  cliente  se  define  como  la arquitectura visual y funcional de una aplicación web con la que el usuario interactúa directamente. A diferencia de los procesos ocultos del servidor, el frontend se encarga de la presentación de contenidos, la estructura de la interfaz gráfica (GUI) y la captura de eventos en tiempo real, utilizando lenguajes estándar como HTML, CSS y JavaScript para asegurar la adaptabilidad (responsividad) en distintos dispositivos y navegadores (Celí Párraga et al., 2023).** 

**Backend:** Conocido técnicamente como desarrollo del lado del servidor, este entorno constituye la estructura lógica y funcional que opera en segundo plano, permaneciendo invisible para el usuario final pero siendo indispensable para la operatividad del sistema. Es el responsable de administrar la base de datos, procesar las peticiones del cliente mediante APIs y ejecutar la lógica de negocio compleja que garantiza la seguridad, integridad y persistencia de la información en la aplicación web (Celí Párraga et al., 2023).** 

**Métrica:**  En  el  contexto  de  la  inteligencia  artificial  semántica  y  los  sistemas  de clasificación, una métrica se define como un indicador cuantitativo diseñado para medir la calidad y fiabilidad de las predicciones de un modelo. A diferencia de las mediciones estáticas, estas métricas (como la precisión, la exactitud y el recall) evalúan dinámicamente la capacidad del algoritmo para emparejar correctamente instancias de datos —por ejemplo, perfiles de estudiantes con requisitos académicos— permitiendo validar objetivamente el éxito del proceso de aprendizaje automático antes de su despliegue (Torres-Diaz & Reátegui Rojas, 2024). 

69 

70 

**Referencias Bibliográficas** 

` `Ajjam, M.-H., y Al-Raweshidy, H. S. (2026). AI-driven semantic similarity-based job 

matching framework for recruitment systems. *Information Sciences*, *724*, Artículo 122728. [https://doi.org/10.1016/j.ins.2025.122728 ](https://doi.org/10.1016/j.ins.2025.122728)

Alsaif, S. A., Hidri, M. S., Ferjani, I., Eleraky, H. A., & Hidri, A. (2022). NLP-Based Bi-

Directional Recommendation System: Towards Recommending Jobs to Job Seekers and Resumes to Recruiters. *Big Data and Cognitive Computing*, *6*(4), 147. [https://doi.org/10.3390/bdcc6040147 ](https://doi.org/10.3390/bdcc6040147)

Gupta, V., Gupta, M., Garg, J., & Garg, N. (2021). Improvement in Semantic Address 

Matching using Natural Language Processing. 2021 *2nd International Conference for Emerging Technology (INCET)* (pp. 1-5). IEEE. [https://doi.org/10.1109/INCET51464.2021.9456342 ](https://doi.org/10.1109/INCET51464.2021.9456342)

Gardazi, N. M., Daud, A., Malik, M. K., Bukhari, A., Alsahfi, T., & Alshemaimri, B. (2025). 

BERT applications in natural language processing: a review. Artificial Intelligence Review, 58(166). https://doi.org/10.1007/s10462-025-11162-5 

Carabali Sanchez, L. M. (2025). Procesamiento de Lenguaje Natural Aplicado a la Selección 

de Personal. *Apuntes De Ciencia & Sociedad*, *13*(1), 145-162. [https://doi.org/10.18259/acs.2025011 ](https://doi.org/10.18259/acs.2025011)

Alasino, A. (2024). *Un enfoque de clasificación no supervisada para un sistema de* 

*recomendación de currículums vitae basado en la similitud semántica* [Tesis de maestría, Universidad Torcuato Di Tella]. Repositorio Digital UTDT. [https://repositorio.utdt.edu/handle/20.500.13098/12910 ](https://repositorio.utdt.edu/handle/20.500.13098/12910)

71 

Villamar Cahueñas, M. J. (2024). *Plataforma web para asignación de estudiantes a* 

*programas de prácticas preprofesionales en la Facultad de Ingeniería en Sistemas (FIS) con enfoque ágil en el desarrollo de front-end y back-end: Desarrollo de front-end* [Trabajo de integración curricular, Escuela Politécnica Nacional]. Repositorio Institucional EPN. [http://bibdigital.epn.edu.ec/handle/15000/27364 ](https://www.google.com/search?q=http://bibdigital.epn.edu.ec/handle/15000/27364)

Palma Moreira, N. (2024). *Las prácticas preprofesionales y su aporte en la inserción laboral* 

*de los graduados de la carrera de Trabajo Social de la ULEAM, años 2024-2025* [Tesis de licenciatura, Universidad Laica Eloy Alfaro de Manabí]. Repositorio Institucional ULEAM. [https://repositorio.uleam.edu.ec/handle/123456789/8041 ](https://repositorio.uleam.edu.ec/handle/123456789/8041)

Recalde Morales, H. A., & Soria Columba, L. S. (2022). *Buscador interno Web con* 

*procesamiento del lenguaje natural y métricas de similitud de inteligencia artificial tomando como caso de estudio un E-commerce* [Tesis de grado, Universidad Politécnica Salesiana]. Repositorio Institucional UPS. [http://dspace.ups.edu.ec/handle/123456789/22223 ](http://dspace.ups.edu.ec/handle/123456789/22223)

Carranza Guevara, R., Cruz Caro, O., Tarrillo Perez, D., Reina Marín, Y., Portocarrero Ramos, 

H. C., Contreras Portocarrero, J. P., Sánchez Bardales, E., Campos Trigoso, J. A., & Chávez Santos, R. (2025). Pre-professional internships in the development of skills and employability of accounting students: A case study from a Peruvian University. *Frontiers in Education, 10[. https://doi.org/10.3389/feduc.2025.1714109 ](https://www.google.com/search?q=https://doi.org/10.3389/feduc.2025.1714109)*

Guim Bustos, P., y Marreno Ancizar, Y. (2022). Desarrollo de competencias en prácticas pre-

profesionales y la inserción laboral de egresados universitarios en Ecuador. *Revista de Ciencias Sociales (Ve)*, *28*(6), 232-246 

72 

Quilumba Tumbaco, M. P. (2023). Prácticas preprofesionales en el proceso de formación 

académica de estudiantes universitarios. *Revista Científica Y Arbitrada De Ciencias Sociales Y Trabajo Social: Tejedora. 6*(13), 1–21. [https://doi.org/10.56124/tj.v6i12ep.0098 ](https://doi.org/10.56124/tj.v6i12ep.0098)

Rodríguez Díaz, J. L., Cabrera Olvera, J. L., & Muñoz Guanga, A. P. (2022). El éxito de las 

Prácticas pre-profesionales:¿ De qué depende?. *Revista Habanera de Ciencias* 

*Médicas*, *21*(2). 

Consejo de Educación Superior [CES]. (2022). *Reglamento de Régimen Académico*. Gaceta 

Oficial del Consejo de Educación Superior[. https://www.ces.gob.ec/wp- content/uploads/2022/08/Reglamento-de-Re%CC%81gimen-Acade%CC%81mico- vigente-a-partir-del-16-de-septiembre-de-2022.pdf ](https://www.ces.gob.ec/wp-content/uploads/2022/08/Reglamento-de-Re%CC%81gimen-Acade%CC%81mico-vigente-a-partir-del-16-de-septiembre-de-2022.pdf)

Macas Padilla, B. A., Mero Baquerizo, C. A., Vasco Delgado, J. C., Solís Franco, G. C., 

Yépez González, D. A., Vasco Delgado, L. A., Paucar Moreno, J. P., y Vasco Delgado, L. J. (2025). Prácticas preprofesionales y transición al empleo en jóvenes universitarios del Ecuador. *South Florida Journal of Health*, *6*(3), 1-18. [https://doi.org/10.46981/sfjhv6n3-006 ](https://www.google.com/search?q=https://doi.org/10.46981/sfjhv6n3-006)

Arevalo Cordovilla, B. C., Andaluz Leon, D. M., y Campoverde Pico, J. L. (2024). El papel de 

las prácticas preprofesionales en el desarrollo de la adaptabilidad de los estudiantes a los cambios en el mercado laboral durante el período marzo - septiembre 2024. *Ciencia Latina Revista Científica Multidisciplinar*, *8*(6). [https://doi.org/10.37811/cl_rcm.v8i6.14925 ](https://doi.org/10.37811/cl_rcm.v8i6.14925)

Cabrera González, A. R., Rodríguez Rueda, R. C., Rivera Celi, A. E., Vite Guzman, D. T., y 

Cumbicus Castillo, E. M. (2024). Prácticas profesionales: Una oportunidad para 

73 

familiarizarse con su futuro contexto profesional. *Ciencia Latina Revista Científica* 

*Multidisciplinar*, *8*(4), 5122-5136. [https://doi.org/10.37811/cl_rcm.v8i4.13237 ](https://doi.org/10.37811/cl_rcm.v8i4.13237)\
Varguillas, C., Guffante, T. M., Manzano, M. R., & Moreno, P. E. (2020). *Develaciones* 

*significantes de la práctica pre profesional desde la vivencia estudiantil*. *Revista* 

*ESPACIOS*, 41(18). 

Naranjo Naranjo, P. A., & Ávila Segovia, L. A. (2024). *Experiencias de los estudiantes* 

*universitarios frente a las prácticas preprofesionales* [Trabajo de integración curricular, Universidad Tecnológica Indoamérica]. Repositorio Institucional UTI. [https://hdl.handle.net/20.500.14809/6580 ](https://hdl.handle.net/20.500.14809/6580)

Caamaño López, L. C., Palacios Meléndez, J. G., Tomalá Uribe, J. X., Benavides Rodríguez, 

A., & Ramírez Constante, L. G. (2023). Prácticas preprofesionales universitarias en empresas públicas y privadas: Caso de estudio facultad de ciencias administrativas UPSE. *Ciencia Latina Revista Científica Multidisciplinar*, *7*(2), 2415-2432. [https://doi.org/10.37811/cl_rcm.v7i2.5491 ](https://doi.org/10.37811/cl_rcm.v7i2.5491)

Fernández Medina, C. R., Pérez Hernández, B., & Ferreiro Concepción, J. F. (2023). 

Estrategia para fortalecer la práctica laboral con el uso de las TIC desde la relación Universidad–Empresa. *Revista Iberoamericana de Tecnología en Educación y Educación en Tecnología*, (34), 110-116. [https://doi.org/10.24215/18509959.34.e12 ](https://www.google.com/url?sa=E&source=gmail&q=https://doi.org/10.24215/18509959.34.e12)

Ruiz Ducasse, D., Pineda Ramos, D., & Ocejo Salvador, A. (2024). Vínculo universidad–

empresa en la formación de profesionales. Resultados y experiencias en la Universidad de Oriente, Cuba. *Revista de Investigación, Formación y Desarrollo: Generando Productividad Institucional*, *12*(1)[. https://doi.org/10.34070 ](https://doi.org/10.34070)

74 

Banks, A., & Porcello, E. (2020). *Learning React Modern Patterns for Developing React Apps* 

*SECOND EDITION*. http://oreilly.com/catalog/errata.csp?isbn=9781492051725 

Celí Párraga, R. Javier., Boné Andrade, M. Fabricio., & Mora Olivero, A. Patricio. (2023). 

*Programación Web del Frontend al Backend Ricardo Javier Celí Párraga*. Editorial Grupo AEA. 

Delso Vicente, A. T., Carvajal Camperos, M., & Corral De La Mata, D. Á. (2024). La 

evolución del procesamiento del lenguaje natural y su influencia en la inteligencia artificial: Una revisión y líneas de investigación futura. *European Public & Social Innovation Review*, *10*, 1-23. https://doi.org/10.31637/epsir-2025-782 

Gabriel  Amaya. (2021). *SISTEMA DE RECOMENDACIÓN DE EMPLEO-EVIDENCIA* 

*PARA ALGUNOS PROGRAMAS DE PREGRADO DE LA UNIVERSIDAD DE LA SABANA*. https://intellectum.unisabana.edu.co/server/api/core/bitstreams/95a1babb-c0b6- 4849-a469-c71fee18e0a9/content 

Giraldo Forero, A. F., & Orozco Duque, A. F. (2023). Evolución del procesamiento natural del 

lenguaje. *TecnoLógicas*, *26*(56), e2687. https://doi.org/10.22430/22565337.2687 \
Guevara Fernandez, A., & Coral Ygnacio, M. A. (2023). Una revisión de métodos, técnicas y 

algoritmos para sistemas de recomendación de productos tecnológicos. *Interfases*, *018*, 

255-280. https://doi.org/10.26439/interfases2023.n018.6357 

Han, J., Pei, J., & Tong, H. (2022). Data Mining: Concepts and Techniques, Fourth Edition. 

*Data Mining: Concepts and Techniques, Fourth Edition*, 1-752. https://doi.org/10.1016/C2013-0-18660-6 

75 

Kowsari, K., Meimandi, K. J., Heidarysafa, M., Mendu, S., Barnes, L., & Brown, D. (2019). 

Text Classification Algorithms: A Survey. *Information 2019, Vol. 10,* *10*(4). https://doi.org/10.3390/INFO10040150 

Llamuca-Quinaloa, J., Vera-Vincent, Y., Tapia-Cerda, V., Llamuca-Quinaloa, J., Vera-

Vincent, Y., & Tapia-Cerda, V. (2021). Análisis comparativo para medir la eficiencia de desempeño entre una aplicación web tradicional y una aplicación web progresiva. *TecnoLógicas*, *24*(51), 164-185. https://doi.org/10.22430/22565337.1892 

Majumder, Bodhisattwa., Gupta, Anuj., & Surana, Harshit. (2020). *Practical natural language* 

*processing : a comprehensive guide to building real-world NLP systems*. O’Reilly Media. Márquez Coca, W. A., Valenzuela Chicaiza, C. V., Acosta Jaramillo, C. A., Gaón Rojas, N. 

M., & Chimarro Amaguaña, J. D. (2023a). *Desarrollo de aplicaciones web con* 

*tecnologías modernas*. Religación Press. https://doi.org/10.46652/ReligacionPress.108 Márquez Coca, W. A., Valenzuela Chicaiza, C. V., Acosta Jaramillo, C. A., Gaón Rojas, N. 

M., & Chimarro Amaguaña, J. D. (2023b). *Desarrollo de aplicaciones web con* 

*tecnologías modernas*. Religación Press. https://doi.org/10.46652/ReligacionPress.108 Medina Condori, V. N., Mendoza Ibarra, V., Rondón Rojas, A. Y. F., Salazar Quispe, I. C., 

Rojas Poma, H. E., Aguilar Calderón, H. A., & Larios Soldevilla, O. A. (2024). The Use 

of Python in AI and Its Impact on Inventory Management in America 2023. *Proceedings* 

*of the 4th LACCEI International Multiconference on Entrepreneurship, Innovation and* 

*Regional Development (LEIRD 2024): «Creating solutions for a sustainable future:* 

*technology-based entrepreneurship»*. https://doi.org/10.18687/LEIRD2024.1.1.593 

76 

Mihai, G. (2020). Comparison between Relational and NoSQL Databases. *Annals of Dunarea* 

*de Jos University of Galati. Fascicle I. Economics and Applied Informatics*, *26*(3), 38-42. https://doi.org/10.35219/eai15840409134 

Moiz, M., Malik, H., Bilal, M., & Naseer, N. (2021). A Comparative Analysis of Multiple 

Biasing Techniques for $Q\_{biased}$ Softmax Regression Algorithm. *2021 International Conference on Artificial Intelligence and Mechatronics Systems (AIMS)*, 1- 5. https://doi.org/10.1109/AIMS52415.2021.9466049 

Palomares, I., Porcel, C., Pizzato, L., Guy, I., & Herrera-Viedma, E. (2021). Reciprocal 

Recommender Systems: Analysis of state-of-art literature, challenges and opportunities towards social recommendation. *Information Fusion*, *69*, 103-127. https://doi.org/10.1016/j.inffus.2020.12.001 

Paucar Mayanquer, J. E. (2023). *Análisis comparativo de los Frameworks Javascript React y* 

*Vue.JS mediante las Normas ISO/IEC 25010, para el desarrollo del sistema web de control de ventas para la Panificadora Royal*. https://repositorio.utn.edu.ec/handle/123456789/14547 

Phan Khoi. (2024). *A Comprehensive Study on Single-Page Applications: Pros, Cons, and* 

*Practical*. 

Pinto Demera, L. N., & Morejón López, G. E. (2025). FLASK: El microframework para el 

desarrollo rápido de aplicaciones con Python. *Revista Social Fronteriza*, *5*(1). https://doi.org/10.59814/resofro.2025.5(1)597 

Reimers, N., & Gurevych, I. (2019). Sentence-BERT: Sentence Embeddings using Siamese 

BERT-Networks. *Proceedings of the 2019 Conference on Empirical Methods in Natural* 

77 

*Language Processing and the 9th International Joint Conference on Natural Language* 

*Processing (EMNLP-IJCNLP)*, 3980-3990. https://doi.org/10.18653/v1/D19-1410 Salunke, S. V., & Ouda, A. (2024). A Performance Benchmark for the PostgreSQL and 

MySQL Databases. *Future Internet*, *16*(10), 382. https://doi.org/10.3390/fi16100382 Sarkar, D. (2019). *Text Analytics with Python*. Apress. https://doi.org/10.1007/978-1-4842-

4354-1 

Sarker, I. H. (2021). Machine Learning: Algorithms, Real-World Applications and Research 

Directions. *SN Computer Science*, *2*(3), 160. https://doi.org/10.1007/s42979-021-00592-x Torres-Diaz, J. C., & Reátegui Rojas, R. M. (2024). Análisis del éxito académico mediante 

aprendizaje automático: adicción y ChatGPT. *Interfases*, *020*, 15-29. 

https://doi.org/10.26439/interfases2024.n020.7390 

Vercel. (2024). *Next.js Documentation: Rendering and Performance Optimization.* 

https://nextjs.org/docs/app/building-your-application/rendering 

Villacreses Chong, X. I. (2024). *MÓDULO WEB PARA LA GESTIÓN Y AGENDAMIENTO* 

*DE CITAS EN LA PLATAFORMA INNOVUS MEDICAL DE LA EMPRESA «INNOVUS SOFTWARE»* [Tesis de Grado, Universidad Estatal del Sur de Manabí (UNESUM)]. https://repositorio.unesum.edu.ec/bitstream/53000/6334/1/VILLACRESES%20CHONG %20XAVIER%20ISAAC.pdf 

Yadalam, T. V., Gowda, V. M., Kumar, V. S., Girish, D., & M., N. (2020). Career 

Recommendation Systems using Content based Filtering. *2020 5th International Conference on Communication and Electronics Systems (ICCES)*, 660-665. https://doi.org/10.1109/ICCES48766.2020.9137992 

78 

[ref1]: Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.001.png
[ref2]: Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.010.png
[ref3]: Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.011.png
[ref4]: Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.012.png
[ref5]: Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.013.png
[ref6]: Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.018.png
[ref7]: Aspose.Words.66bf4c5c-2fb2-426b-b979-a387545aed44.028.png
