





## UNIVERSIDAD DE GUAYAQUIL

## FACULTAD DE CIENCIAS MATEMÁTICAS Y FÍSICAS
## CARRERA DE SOFTWARE


## SISTEMA DE RECOMENDACIÓN WEB PARA PRÁCTICAS
## PREPROFESIONALES DE LA CARRERA DE SOFTWARE MEDIANTE
## TÉCNICAS NLP Y MODELOS DE SIMILITUD SEMÁNTICA.

## PROYECTO DE INTEGRACIÓN CURRICULAR

Previa a la obtención del Título de:

## INGENIERO DE SOFTWARE

## AUTORES:
## ANCHUNDIA CAICEDO NALDO JONNEL
## GALARZA INDACOCHEA BRYAN GUILLERMO

## TUTOR:
## ING. ELEANOR VARELA TAPIA, MGS.

## GUAYAQUIL – ECUADOR

## 2026


## 2




## REPOSITORIO NACIONAL EN CIENCIAS Y TECNOLOGÍAS
## FICHA DE REGISTRO DE TRABAJO DE INTEGRACIÓN CURRICULAR
TÍTULO: “Sistema de recomendación web para prácticas preprofesionales de la Carrera de
Software mediante técnicas NLP y modelos de similitud semántica”
## AUTOR(ES):
## Naldo Jonnel Anchundia Caicedo
## Bryan Guillermo Galarza Indacochea
## REVISOR(A):
Nombres y apellidos del (la) docente revisor(a)
INSTITUCIÓN:  Universidad de
## Guayaquil
FACULTAD: Ciencias Matemáticas y Físicas
CARRERA:  Software
## FECHA DE PUBLICACIÓN:  N° DE PÁGS.: 999
ÁREA TEMÁTICA: Aplicación web, Desarrollo de Software.
PALABRAS CLAVES: Matching, Plataforma web, NLP, prácticas preprofesionales,
similitud semántica.
RESUMEN: (Colocar el mismo resumen y palabras clave colocados en la sección del
trabajo de integración curricular que corresponde a “RESUMEN”)
## N° DE REGISTRO: N° DE CLASIFICACIÓN:
## DIRECCIÓN URL: (PROYECTO DE INTEGRACIÓN CURRICULAR EN LA WEB)
## ADJUNTO PDF SI NO
## CONTACTO CON AUTOR(ES):
## Naldo Jonnel Anchundia Caicedo
## Bryan Guillermo Galarza Indacochea
## Teléfono:
## 0990020956
## 0998094515
## Email:
naldo.anchundiac@ug.edu.ec
bryan.galarzaind@ug.edu.ec
## CONTACTO DE LA INSTITUCIÓN

## Nombre: Ab. Juan Chávez Atocha
## Teléfono: 2307729
Email: juan.chaveza@ug.edu.ec



x

## 3

## APROBACIÓN DEL TUTOR



En   mi   calidad   de   Tutora del Trabajo   de Integración   Curricular,  “SISTEMA   DE
## RECOMENDACIÓN    WEB    PARA    PRÁCTICAS    PREPROFESIONALES    DE    LA
## CARRERA DE SOFTWARE MEDIANTE TÉCNICAS NLP Y MODELOS DE SIMILITUD
SEMÁNTICA.” elaborados  por  los  Sres.  NALDO  JONNEL  ANCHUNDIA  CAICEDO y
BRYAN GUILLERMO GALARZA INDACOCHEA, estudiantes no titulados de la Carrera
de  Software,  Facultad  de  Ciencias  Matemáticas  y  Físicas  de  la  Universidad  de  Guayaquil,
previo a la obtención del Título de Ingeniero de Software, me permito declarar que luego de
haber orientado, estudiado y revisado, la apruebo en todas sus partes.


## Atentamente,


## ING. ELEANOR VARELA TAPIA, MGS.
## TUTORA







## 4


## DEDICATORIA


Este trabajo se lo dedico a mis padres por
ser   mi   pilar   durante   toda   mi   etapa
universitaria  y  a  mis  amigos  y  familiares
que    me    apoyaron    siempre    que    lo
necesitaba   y   me   motivaban   con   sus
palabras de aliento.
## Bryan Guillermo Galarza Indacochea


Dedico  este  trabajo  a  mis  padres,  por  su
apoyo incondicional desde el inicio de esta
carrera; a mi hermana, por su compañía y
apoyo  constante;  a  mis  amigos,  por  su
ánimo y motivación; a Noelia, quien en los
momentos   en   que   quise   rendirme   me
brindó  su  apoyo para  seguir  adelante;  y  a
Melanie, quien en un momento importante
de  mi  vida  fue  una  fortaleza  y  un  gran
apoyo.
## Naldo Jonnel Anchundia Caicedo


## 5



## AGRADECIMIENTO



Agradezco     a     mi     familia,     a     mis
compañeros y a cada uno de los docentes
que  fueron  una  guía  durante  todo  este
trayecto,  pero  sobre  todo  agradezco  a
Dios por darme fuerzas para no rendirme.
## Bryan Guillermo Galarza Indacochea


Agradezco a Dios por darme la fortaleza
para   culminar   este   proyecto   y   a   mi
familia, por su apoyo y acompañamiento
durante todo este proceso.
## Naldo Jonnel Anchundia Caicedo





## 6

## TRIBUNAL PROYECTO DE INTEGRACIÓN CURRICULAR


## Ing. Douglas Iturburu Salvador, M. Sc.
## DECANO DE LA FACULTAD
## CIENCIAS MATEMÁTICAS Y FÍSICAS

## Ing. Leili Lopezdominguez Rivas, M. Sc.
## DIRECTORA DE LA CARRERA DE
## SOFTWARE


Nombres y Apellidos
## DOCENTE TUTOR(A) DEL PROYECTO
## DE INTEGRACIÓN CURRICULAR
Nombre y Apellidos
## DOCENTE REVISOR(A) DEL
## PROYECTO DE INTEGRACIÓN
## CURRICULAR


## Ab. Juan Chávez Atocha, Esp.
## SECRETARIO







## 7


## DECLARACIÓN EXPRESA



“La  responsabilidad  del  contenido  de  este Proyecto  de
Integración  Curricular,  me  corresponden  exclusivamente;  y
el  patrimonio  intelectual  de  la  misma  a  la  UNIVERSIDAD
## DE GUAYAQUIL”.



## Bryan Guillermo Galarza Indacochea


## Naldo Jonnel Anchundia Caicedo




## 8



## CESIÓN DE DERECHOS DE AUTOR

## Ingeniero
## Douglas Iturburu Salvador, M. Sc.
## DECANO DE LA FACULTAD DE CIENCIAS MATEMÁTICAS Y FÍSICAS
## Presente.

A  través  de  este  medio  indico  a  usted  que  procedo  a  realizar  la  entrega  de  la  cesión  de
derechos de autor en forma libre y voluntaria del trabajo de integración curricular “SISTEMA DE
## RECOMENDACIÓN    WEB    PARA    PRÁCTICAS    PREPROFESIONALES    DE    LA
## CARRERA    DE   SOFTWARE   MEDIANTE   TÉCNICAS   NLP    Y   MODELOS   DE
SIMILITUD  SEMÁNTICA”, realizado como requisito previo para la obtención del Título de
Ingeniero(a) de Software de la Universidad de Guayaquil.

Guayaquil, ________ de _______.

## ______________________________________
## Bryan Guillermo Galarza Indacochea
## C.I. N° 0955236773


## ______________________________________
## Naldo Jonnel Anchundia Caicedo
## C.I. N° 0942646266

## 9



## UNIVERSIDAD DE GUAYAQUIL
## FACULTAD DE CIENCIAS MATEMÁTICAS Y FÍSICAS
## CARRERA DE SOFTWARE

## SISTEMA DE RECOMENDACIÓN WEB PARA PRÁCTICAS PREPROFESIONALES
## DE LA CARRERA DE SOFTWARE MEDIANTE TÉCNICAS
## NLP Y MODELOS DE SIMILITUD SEMÁNTICA.

Proyecto de Integración Curricular que se presenta como requisito para optar por el título de
## INGENIERO DE SOFTWARE

## Autores: Bryan Guillermo Galarza Indacochea
## C.I. N° 0955236773
## Naldo Jonnel Anchundia Caicedo
## C.I. N° 0942646266

## Tutora: Ing. Eleanor Varela Tapia, Mgs.


Guayaquil, _(Mes)_de_(Año)_

## 10

## CERTIFICADO DE ACEPTACIÓN DEL TUTOR

En  mi  calidad  de  Tutor(a) del Proyecto  de  Integración  Curricular,  nombrado  por  el  Consejo
Directivo de la Facultad de Ciencias Matemáticas y Físicas de la Universidad de Guayaquil.
## CERTIFICO:
Que  he  analizado  el Proyecto  de  Integración  Curricular presentado por  los  estudiantes
## NALDO   JONNEL   ANCHUNDIA   CAICEDO, BRYAN   GUILLERMO   GALARZA
INDACOCHEA, como requisito previo para optar por el Título de Ingeniero(a) de Software cuyo
proyecto es:
## SISTEMA DE RECOMENDACIÓN WEB PARA PRÁCTICAS PREPROFESIONALES
## DE LA CARRERA DE SOFTWARE MEDIANTE TÉCNICAS
## NLP Y MODELOS DE SIMILITUD SEMÁNTICA.

Considero aprobado el trabajo en su totalidad.
Presentado por:

Bryan Guillermo Galarza Indacochea                           Cédula de identidad N° 0955236773

Naldo Jonnel Anchundia Caicedo                                Cédula de identidad N° 0942646266

## Tutor(a): ____________________________
## Firma
Guayaquil, __(Mes)__de_(Año)____

## 11


## UNIVERSIDAD DE GUAYAQUIL
## FACULTAD DE CIENCIAS MATEMÁTICAS Y FÍSICAS
## CARRERA DE SOFTWARE
## AUTORIZACIÓN PARA PUBLICACIÓN DE PROYECTO DE INTEGRACIÓN CURRICULAR EN
## FORMATO DIGITAL
- Identificación del Proyecto de Integración Curricular
Nombre del Estudiante: Bryan Guillermo Galarza Indacochea
Dirección: Sergio toral 2 etp.
## Teléfono:0998094515
Email: bryan.galarzaind@ug.edu.ec

Nombre del Estudiante: Naldo Jonnel Anchundia Caicedo
Dirección: Daule, parroquia Limonal
Teléfono: 0990020956 Email: naldo.anchundiac@ug.edu.ec

Facultad: Ciencias Matemáticas y Físicas
## Carrera: Software
Proyecto de Integración Curricular al que opta:
## Docente Tutor:

Título  del Proyecto  de  Integración  Curricular: SISTEMA  DE  RECOMENDACIÓN  WEB  PARA
## PRÁCTICAS PREPROFESIONALES DE LA CARRERA DE SOFTWARE MEDIANTE TÉCNICAS
## NLP Y MODELOS DE SIMILITUD SEMÁNTICA.

Palabras Claves: Matching, Plataforma web, NLP, prácticas preprofesionales, similitud semántica.

- Autorización de Publicación de Versión Electrónica del Proyecto de Integración Curricular

A  través  de  este  medio  autorizo  a  la  Biblioteca  de  la  Universidad  de  Guayaquil  y  a  la  Facultad  de  Ciencias
Matemáticas y Físicas a publicar la versión electrónica de este Proyecto de Integración Curricular.

## Publicación Electrónica:

Inmediata  Después de 1 año

## Firma Estudiante:


Bryan Guillermo Galarza Indacochea                                            Cédula de identidad N°0955236773


Naldo Jonnel Anchundia Caicedo                                             Cédula de identidad N°0942646266

- Forma de envío:


## 12

El texto del Proyecto de Integración Curricular debe ser enviado en formato Word, como archivo .docx, .RTF o.
Puf para PC. Las imágenes que la acompañen pueden ser: .gif, .jpg o .TIFF.

## DVDROM                                       CDROM


## 13

## ÍNDICE GENERAL
## FICHA DE REGISTRO DE TRABAJO DE INTEGRACIÓN CURRICULAR ................... 2
APROBACIÓN DEL TUTOR ..................................................................................................... 3
DEDICATORIA ............................................................................................................................ 4
AGRADECIMIENTO .................................................................................................................. 5
TRIBUNAL PROYECTO DE INTEGRACIÓN CURRICULAR ........................................... 6
DECLARACIÓN EXPRESA ....................................................................................................... 7
CESIÓN DE DERECHOS DE AUTOR ..................................................................................... 8
CERTIFICADO DE ACEPTACIÓN DEL TUTOR ............................................................... 10
## AUTORIZACIÓN PARA PUBLICACIÓN DE PROYECTO DE INTEGRACIÓN
CURRICULAR EN FORMATO DIGITAL ............................................................................ 11
ÍNDICE GENERAL ................................................................................................................... 13
ÍNDICE DE TABLAS................................................................................................................. 18
ÍNDICE DE FIGURAS............................................................................................................... 19
ABREVIATURAS....................................................................................................................... 20
SIMBOLOGÍA ............................................................................................................................ 21
RESUMEN................................................................................................................................... 22
ABSTRACT ................................................................................................................................. 23
INTRODUCCIÓN ...................................................................................................................... 24
CAPÍTULO I ............................................................................................................................... 22

## 14

PLANTEAMIENTO DEL PROBLEMA ................................................................................. 22
Descripción de la situación problemática ................................................................................. 22
Ubicación del problema en un contexto.................................................................................... 22
Situación conflicto nudos críticos ............................................................................................. 22
Delimitación del problema ........................................................................................................ 23
Evaluación del Problema .......................................................................................................... 24
Causas y consecuencias del problema ....................................................................................... 24
Formulación del problema ......................................................................................................... 28
Objetivos del proyecto ................................................................................................................ 29
Objetivo general ........................................................................................................................ 30
Objetivos específicos ................................................................................................................ 30
Alcance del problema ................................................................................................................. 30
Justificación e importancia ........................................................................................................ 32
Limitaciones del estudio ............................................................................................................. 32
CAPÍTULO II ............................................................................................................................. 30
MARCO TEÓRICO ................................................................................................................... 30
Antecedentes del estudio............................................................................................................. 30
Fundamentación teórica ............................................................................................................. 30
Preguntas científicas a contestarse ............................................................................................ 81
Definiciones conceptuales ........................................................................................................... 81

## 15

CAPÍTULO III ............................................................................................................................ 31
PROPUESTA TECNOLÓGICA ............................................................................................... 31
Análisis de factibilidad ............................................................................................................... 31
Factibilidad operacional ............................................................................................................ 32
Factibilidad técnica ................................................................................................................... 36
Factibilidad legal ....................................................................................................................... 37
Factibilidad económica ............................................................................................................. 38
Metodologías del proyecto .......................................................................................................... 40
Metodología de investigación ................................................................................................... 41
Población y muestra ............................................................................................................ 43
Población. ....................................................................................................................... 43
Muestra. .......................................................................................................................... 43
Procesamiento y análisis...................................................................................................... 46
Técnicas de recolección de datos. ................................................................................... 46
Técnicas estadísticas para el procesamiento de la información. ..................................... 47
Metodología de gestión del proyecto (opcional) ...................................................................... 52
Metodología de desarrollo del proyecto ................................................................................... 53
Beneficiarios directos e indirectos del proyecto ....................................................................... 54
Entregables del proyecto ............................................................................................................ 56
Propuesta ..................................................................................................................................... 56

## 16

Criterios de validación de la propuesta .................................................................................... 56
Resultados .................................................................................................................................... 57
CAPÍTULO IV ............................................................................................................................ 49
CONCLUSIONES Y RECOMENDACIONES ........................................................................ 49
Criterios de aceptación del producto o servicio ....................................................................... 49
Conclusiones ................................................................................................................................ 49
Recomendaciones ........................................................................................................................ 49
Trabajos futuros.......................................................................................................................... 50
REFERENCIAS BIBLIOGRÁFICAS ...................................................................................... 51
BIBLIOGRAFÍA......................................................................................................................... 52
ANEXOS ...................................................................................................................................... 53
Anexo 1.  Planificación de actividades del proyecto ................................................................ 55
Anexo 2.  Geolocalización del problema .................................................................................. 56
Anexo 3.  Carta de autorización del proyecto ........................................................................... 57
Anexo 4.  Fundamentación Legal ............................................................................................. 58
Anexo 5.  Criterios éticos a utilizarse en el desarrollo del proyecto......................................... 58
Anexo 6.  Formatos de técnicas de recolección de datos aplicadas para variables cuantitativas
o cualitativas. ............................................................................................................................ 62
Anexo 7.  Validación de expertos. ............................................................................................ 66
Anexo 8.  Bases de datos para análisis estadístico (Opcional) ................................................. 70

## 17

Anexo 9. Diagramas de casos de uso (Dependiendo de la metodología que aplique en el
proyecto) ................................................................................................................................... 76
Anexo 10. Acta de entrega y recepción definitiva .................................................................... 77
Anexo 11.  Carta de uso de software (Aplica según se requiera) ............................................. 79
Anexo 12. Evidencias fotográficas adicionales (Opcional) ...................................................... 80
Anexo 13. Certificado del Docente-Tutor del Trabajo de Integración Curricular .................... 82
Anexo 14. Certificado Porcentaje de Similitud ........................................................................ 83
Anexo 15. Informe del Docente Revisor .................................................................................. 84
Anexo 16. Manual técnico ........................................................................................................ 85
Anexo 17. Manual de usuario ................................................................................................... 86
























## 18




## ÍNDICE DE TABLAS
Tabla 1. Delimitación del problema. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .. .22
Tabla 2. Matriz de causas y consecuencias del problema . . . . . . . . . . . . . . . . . . . . . . . .24
Tabla 3. Tecnologías a utilizarse en el proyecto . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .32
Tabla 4. Costos por recursos humanos en el proyecto . . . . . . . . . . . . . . . . . . . . . . . .. 32
Tabla 5. Costos de inversión en hardware en el proyecto . . . . . . . . . . . . . . . . . . . . . . . .32
Tabla 6. Costos de inversión en software en el proyecto . . . . . . . . . . . . . . . . . . . . . . . . 33
Tabla 7. Resumen de costos de inversión en el proyecto . . . . . . . . . . . . . . . . . . . . . . . . 33
Tabla 8. Cálculo de la muestra. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 36
Tabla 9. Pregunta 4: ¿Tiene mascotas en casa actualmente? . . . . . . . . . . . . . . . . . . . . . .42






















## 19

## ÍNDICE DE FIGURAS
Figura 1. Estructura de un objetivo general . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 26
Figura 2. Análisis comparativo: Ionic vs React Native vs Flutter . . . . . . . . . . . . . . .. 31
Figura 3. Pregunta 4: Análisis gráfico de la pregunta número 4 de la encuesta. . . . . . 42
Figura 4. Descripción breve pero completa que explique la imagen o fotografía. . ..  82



































## 20


## ABREVIATURAS
ABP   Aprendizaje Basado en Problemas
CC.MM.FF   Facultad de Ciencias Matemáticas y Físicas
EDT   Estructura de Desglose de Trabajo
FTP    Archivos de Transferencia
g.l.    Grados de Libertad
HTML   Lenguaje de Marca de salida de Hyper Texto
HTTP    Protocolo de transferencia de Hyper Texto
## Ing.    Ingeniero
ISP    Proveedor de Servicio de Internet
## M. Sc.    Máster
## Mtra.    Maestra
UG    Universidad de Guayaquil
URL    Localizador de Fuente Uniforme
WWW   World Wide Web (Red Mundial)












## 21

## SIMBOLOGÍA
s   Desviación estándar
e   Error
E   Espacio muestral
E(Y)   Esperanza matemática de la v.a. y
s   Estimador de la desviación estándar
e   Exponencial


























## 22



## UNIVERSIDAD DE GUAYAQUIL
## FACULTAD DE CIENCIAS MATEMÁTICAS Y FÍSICAS
## CARRERA DE SOFTWARE



## SISTEMA DE RECOMENDACIÓN WEB PARA PRÁCTICAS PREPROFESIONALES
## DE LA CARRERA DE SOFTWARE MEDIANTE TÉCNICAS
## NLP Y MODELOS DE SIMILITUD SEMÁNTICA.


## Autores: Naldo Jonnel Anchundia Caicedo
## C.I. N° 0942646266
## Bryan Guillermo Galarza Indacochea
## C.I. N° 0955236773

## Tutora: Ing. Eleanor Varela Tapia, Mgs.

## RESUMEN
Realice una exposición corta y precisa de los puntos sustanciales de los contenidos del proyecto,
en relación a: los objetivos que persigue, la orientación teórica o marco referencial, la metodología
utilizada, la importancia, trascendencia y contenido y las conclusiones del trabajo. Preséntelo en
forma de un solo párrafo, los contenidos se separan entre sí por puntos seguidos escritos a un solo
espacio. No exceda de una página. Maneje interlineado sencillo. Se recomienda realizarlo cuando
se haya concluido el desarrollo del proyecto). Se sugiere considerar 2 líneas para objetivos, 4 para
el marco referencial 4 de metodología, 16 de contenido y 4 líneas de conclusiones (máximo 300
palabras en una sola hoja).

Palabras clave: Matching, Plataforma web, NLP, prácticas preprofesionales, similitud semántica.

Considere entre 5 a 8 palabras claves relevantes en su trabajo de integración curricular. Coloque
cada una de ellas separadas por comas. Coloque junto a la última palabra el símbolo de punto.





## 23



## UNIVERSIDAD DE GUAYAQUIL
## FACULTAD DE CIENCIAS MATEMÁTICAS Y FÍSICAS
## CARRERA DE SOFTWARE



## SISTEMA DE RECOMENDACIÓN WEB PARA PRÁCTICAS PREPROFESIONALES
## DE LA CARRERA DE SOFTWARE MEDIANTE TÉCNICAS
## NLP Y MODELOS DE SIMILITUD SEMÁNTICA.


## Autores: Naldo Jonnel Anchundia Caicedo
## C.I. N° 0942646266
## Bryan Guillermo Galarza Indacochea
## C.I. N° 0955236773

## Tutora: Ing. Eleanor Varela Tapia, Mgs.

## ABSTRACT
Realice  una  exposición  en  idioma  inglés  corta  y  precisa  de  los  puntos  sustanciales  de  los
contenidos del proyecto, en relación con: los objetivos que persigue, la orientación teórica o marco
referencial, la metodología utilizada, la importancia, trascendencia y contenido y las conclusiones
del trabajo. Preséntelo en forma de un solo párrafo, los contenidos se separan entre sí por puntos
seguidos  escritos  a  un  solo  espacio.  No  exceda  de  una  página. Maneje  interlineado  sencillo. Se
recomienda realizarlo cuando se haya concluido el desarrollo del proyecto). Se sugiere considerar
2 líneas para objetivos, 4 para el marco referencial 4 de metodología, 16 de contenido y 4 líneas
de conclusiones (máximo 300 palabras en una sola hoja).

Key  words: Considere  entre  5  a  8  palabras  claves relevantes  en  su trabajo  de  integración
curricular. Coloque cada una de ellas separadas por comas. Coloque junto a la última palabra el
símbolo de punto.


## 24

## INTRODUCCIÓN
Uno  de  los  componentes  fundamentales  dentro  de  la  formación  universitaria  es  la
realización  de  prácticas  preprofesionales  las  cuales  permiten  a  los  estudiantes sumergirse  en  la
experiencia  laboral,  aplicar  los  conocimientos  adquiridos  durante  su  carrera y desarrollar sus
habilidades. En  los  últimos  años, la  cantidad  de  estudiantes  que  se  matriculan  para  una  carrera
universitaria  en  la  Universidad  de  Guayaquil ha  estado  creciendo  lo  cual  implica  una  mayor
demanda de futuros profesionales que requerirán de un espacio para la realización de sus prácticas.
Es  debido  a  esto  que  la  universidad ha  impulsado  la  firma  de  múltiples  convenios  con
empresas de distintos sectores con el objetivo de ampliar la oferta de estos espacios. Sin embargo,
a pesar de contar con una amplia red de convenios, el proceso de selección no está sistematizado
por lo cual el acercamiento inicial que tienen los estudiantes con las empresas de convenio está
bajo su responsabilidad teniendo que realizar una ardua gestión sobre la búsqueda de vacantes en
base  a  un  listado  general en  formato Excel que  tiene  como  contenido  los  miles  de  nombres  de
empresas  que  cuentan  con  el  convenio,  pero  con  información  muy  básica  de  cada  una  de  ellas
como  nombre,  correo  y  facultad  relacionada,  es  decir  que  los  estudiantes  no  tienen  a  la  mano
detalles referente a perfiles requeridos o áreas de vacantes disponibles por lo cual ellos mismos
deben investigar a cada una y solicitar mayor información.
El resultado de esta gestión autodidacta produce una alta tasa de postulaciones irrelevantes
a través de correo electrónico, rechazos por una mala relación entre el perfil del estudiante y los
requerimientos de la empresa y repetición de trámites al tener que empezar de cero en la búsqueda
de otra empresa. Esto provoca pérdida de tiempo para los estudiantes al causar retrasos en el inicio
de sus prácticas, así como también un hostigamiento y pérdida de tiempo en las empresas al tener
que responder a una gran cantidad de correos de estudiantes y programar reuniones en donde en

## 25

ocasiones  resulta  que  las  habilidades  del  estudiante  no  se  relacionan  con  los  objetivos  y  áreas
disponibles en la empresa.
Uno  de  los  nudos  críticos  que  surge  a  partir  de  esta  problemática  es  la  deficiente
compatibilidad  que  existe  entre el  perfil  del  estudiante y  los  requerimientos  de  la  empresa
desencadenando otra serie de problemáticas como que las actividades que termina realizando el
practicante  no  mantienen  una  relación directa  con  su  formación  profesional si  no  que  son
actividades comunes de gestión. Esto se da debido a que no existió de por medio un sistema de
afinidad por lo que el conocimiento del estudiante puede no estar relacionado con los procesos o
tecnologías  que  utiliza  la  empresa  o  simplemente  por  subestimación  de  parte  de  la  empresa
limitando  el  desarrollo  profesional  del  estudiante,  oportunidades  de  aprendizaje  y  una  futura
inserción laboral.
En  base  a  este  contexto  resulta necesario  el  desarrollo  de  una  solución tecnológica que
permita la  optimización  del  proceso  de  búsqueda,  postulación  y  asignación  de  prácticas
preprofesionales,  mejorando  la  compatibilidad  entre  el  perfil  académico  del  estudiante  y  los
requerimientos  de  las  empresas. Es  por  esto por  lo  que la  idea  de  una  plataforma  de  matching
bidireccional  que  utilice  como  base  las  técnicas  de procesamiento  de lenguaje natural y  los
modelos de similitud semántica representa una alternativa innovadora al permitir la automatización
del   análisis   de   compatibilidad relacionando   los   perfiles   y   promoviendo   un   sistema   de
recomendación.





## 26

El presente trabajo se estructura en 4 capítulos.
- Capítulo 1: Planteamiento del problema
En  este  capítulo  se  aborda  toda  la  información  acerca  de  los  conflictos  en  los  procesos
actuales para la búsqueda y asignación de prácticas preprofesionales teniendo como puntos
esenciales  la  delimitación  del  tema,  definición  de  nudos  críticos,  objetivos, alcance  y
limitaciones  además  del  planteamiento  de  la  pregunta  clave  sobre  la  formulación  del
problema y la justificación e importancia del estudio.
- Capítulo 2: Marco teórico
En este capítulo se expone toda la información relevante que se pueda referenciar acerca
de la temática planteada lo que incluye, prácticas, matching, técnicas de preprocesamiento
de lenguaje natural, modelos de similitud semántica, desarrollo web, librerías y lenguajes
de programación requeridos, así como la definición de la metodología que se utilizará. La
información  se  desarrolla  a  partir  de  la  lectura  de  artículos  científicos,  documentos  de
investigación y libros.

## 22
## CAPÍTULO I
## PLANTEAMIENTO DEL PROBLEMA
Descripción de la situación problemática
Ubicación del problema en un contexto
En  estos  últimos  años  la  Universidad  de  Guayaquil ha  experimentado  un  notable
crecimiento en la cantidad de estudiantes matriculados en la Carrera de Software evidenciándose
un mayor interés en las carreras tecnológicas. Debido a esta demanda académica se ha impulsado
la firma de múltiples convenios con empresas de distintos sectores, con la finalidad de ampliar la
oferta de espacios disponibles para la realización de prácticas preprofesionales de los estudiantes
de Software puesto que son un componente primordial para su formación.
La Universidad cuenta con un sistema académico que se encarga del seguimiento de los
estudiantes  en  su  proceso  de  realización  de prácticas  preprofesionales  desde  el  inicio  hasta  la
finalización  de sus  horas incluyendo  el  acompañamiento  con  un  tutor  asignado  durante  este
proceso, así como también se dispone del sitio web donde se puede consultar el listado Excel de
convenios. Sin embargo, este sistema carece de información detallada acerca de vacantes o áreas
disponibles que los estudiantes puedan aplicar.
Esta carencia es la principal causa de que los estudiantes de la Carrera de Software que se
enfrentan por  primera  vez  al  proceso  de  prácticas  preprofesionales  presenten  incertidumbre  y
atrasos ya que se encuentran limitados a información básica de las empresas como nombre, correo
al cual dirigirse, fecha de inicio y fin de convenio y facultad. Información mediate la cual podrán

## 23
contactar a una empresa de su interés a través del correo electrónico y enviándoles su solicitud de
postulación, sin garantía de que existan vacantes afines a su carrera.
La Carrera de Software perteneciente a la Facultad de Ciencias Matemáticas y Físicas de
la  Universidad  de  Guayaquil en  donde  se  sitúa  el  contexto  del  proyecto  se  ubica en  la  avenida
“Víctor Manuel Rendón” en la ciudad de Guayaquil. (Ver Anexo 2)
Situación conflicto nudos críticos
La Carrera de Software de la Facultad de Ciencias Matemáticas y Físicas de la Universidad
de  Guayaquil  enfrenta  como  problemática  principal  la  falta  de  un  sistema  que  permita  a  sus
estudiantes identificar vacantes disponibles para prácticas preprofesionales, ya que únicamente se
dispone  de  un  listado  en  formato  Excel  con  más  de  1000  registros  donde  se  enlistan  todas  las
empresas con convenio presentando información básica de cada una de ellas. Esta falta de contexto
provoca  que  los  estudiantes  de  la  Carrera de  Software  sin  experiencia  previa  en  procesos  de
postulación laboral realicen una búsqueda desorientada, contactando con múltiples empresas que
parezcan relacionadas a su formación técnica, para descubrir  en la entrevista que la empresa no
dispone de una vacante orientada al desarrollo de software sino para otras áreas.
Como  consecuencia  de  esto,  se  genera  una  alta  tasa  de  postulaciones  irrelevantes,
repetición de trámites, retrasos en el inicio de las prácticas y una pérdida significativa de tiempo
tanto para los estudiantes como para las empresas involucradas. Otro nudo crítico aparece cuando
el estudiante de la Carrera de Software logra ser aceptado por una empresa, pero las actividades
que  termina  realizando  no  tienen  nada  que  ver  con  su  formación,  ya  sea  porque  la  empresa
considera que no tiene los conocimientos suficientes para integrarse en áreas de desarrollo o porque
simplemente  necesita  apoyo  en  tareas  administrativas.  Esto  limita  el  crecimiento  técnico  del
practicante, reduciendo sus posibilidades de aprendizaje real y disminuyendo las probabilidades

## 24
de que la empresa lo contrate una vez terminadas las prácticas, algo que los estudiantes terminan
aceptando sin cuestionamiento con el fin de cumplir con las horas exigidas.
Delimitación del problema
En la siguiente tabla se presenta el enfoque del proyecto utilizando como delimitadores el
tema del proyecto, campo, área y aspecto en el cual se desarrolla. El presente proyecto se centra
en el diseño y desarrollo de un sistema web que implemente un modelo de recomendación con el
fin de mejorar la compatibilidad y eficiencia en la asignación de prácticas preprofesionales.
(Ver Tabla1).
## Tabla 1
Delimitación del problema
## Delimitador Descripción
## Campo Tecnología
Área Desarrollo de Software
## Aspecto
Proceso   de emparejamiento   de   prácticas   preprofesionales   entre
estudiantes y empresas.
## Tema
Sistema  de  recomendación  web  para  prácticas  preprofesionales  de  la
Carrera  de  Software  mediante  técnicas  NLP  y  modelos  de  similitud
semántica.
Nota: En  esta  tabla se  plantean  los  términos  de análisis aplicados  para  la  delimitación  del  problema  conforme  al
contexto en donde se desarrolla la problemática.
Elaborado por: Galarza Bryan, Anchundia Naldo.

Evaluación del Problema
Los aspectos generales de evaluación son:
- Delimitado: La  delimitación  de  un  problema  está  relacionada  a  las  limitaciones
existentes  en  el  proyecto  se  encarga  de  la  inclusión  o  exclusión  de  alguna  temática
basado  en  el  criterio  del  investigador.  La  delimitación  debe  ser  alineada  con  las
preguntas  y  metodología de  investigación  actuando  como  una  guía  y  una  visión

## 25
contextual  de  cómo  y  qué  realizó  el  investigador  para  llevar  a  cabo  la  tesis.  (Coke,
## 2022).
El  estudio  está  delimitado  bajo  el  contexto  de  prácticas  preprofesionales
tomando como población a los estudiantes de la Carrera de Software perteneciente a la
Facultad   de Ciencias Matemáticas y   Físicas de   la Universidad   de   Guayaquil
permitiendo  analizar  de  manera  eficaz  las  ineficiencias  en  el  proceso  de  búsqueda,
postulación y asignación de prácticas preprofesionales.

- Claro: La claridad del problema asegura la facilidad en la comprensión de ideas al ser
redactado de forma precisa logrando que el investigador no se desvíe del objetivo. Esto
se logra mediante la  redacción  de oraciones  directas  e  ideas  organizadas  evitando  el
lenguaje complejo. (Romero Palmera, 2024).
Los   puntos   relevantes   sobre   la   problemática   identificada   son   claros:   la
vinculación  inicial  entre los  estudiantes  de  Software y las empresas no  se  encuentra
centralizada ni estandarizada, por lo que cada estudiante deberá realizar el proceso de
búsqueda bajo su responsabilidad lo que ha provocado que el proceso de postulación
sea  desorganizado y poco  eficiente, generando  pérdida  de  tiempo  tanto  para  los
estudiantes  interesados  como  para  las  empresas  implicadas  que se  reúnen  con
estudiantes de áreas con las que ellos no disponen.

- Evidente: Una problemática se considera evidente si se puede comprender mediante la
observación sustentándose en información concreta y clara. Además, se considera auto

## 26
justificable  porque  no  requiere  de  deducciones  complejas  para  ser  captado. (Riofrío
Martínez-Villalba, 2021).
La problemática es evidente y se refleja fácilmente en la cantidad de tiempo que
invierten  los  estudiantes de  la  Carrera  de  Software investigando  a  las  empresas  para
posteriormente postular a ellas, así como en las entrevistas fallidas que debido a la falta
de correspondencia entre sus perfiles y requerimientos solicitados son descartados. Por
otro lado, esto también se evidencia en la cantidad masiva de correos que reciben las
empresas sobre consultas sobre vacantes de prácticas.

- Relevante: La relevancia de un problema de investigación se refiere a su importancia
y pertinencia dentro de un contexto específico, es decir, cuando aborda una necesidad
real que afecta de manera significativa a un grupo o proceso determinado, generando
un aporte práctico y útil para mejorar situaciones concretas como la eficiencia operativa
o la formación profesional. (Carlino, 2021).
El  proyecto  es  relevante  para  la  Carrera  de  Software  porque  propone  una
solución tecnológica directa al problema de las búsquedas manuales. Al implementar
un  sistema recomendación que  mejora  la  compatibilidad  entre  el  estudiante  y  la
empresa, se ahorra tiempo, se reducen las postulaciones irrelevantes y se garantiza que
el practicante realice actividades que verdaderamente aporten a su formación técnica y
futura inserción laboral.

- Contextual: El  enfoque  contextual  en  la  investigación  implica  analizar  el  problema
dentro del marco específico de circunstancias, condiciones institucionales, temporales

## 27
y espaciales en las que se presenta, permitiendo una comprensión más precisa y realista
del fenómeno estudiado. Este enfoque sirve como guía para relacionar las decisiones
metodológicas  con  la  realidad  particular  del  entorno  donde  ocurre  el  problema.
(Salcedo Lobatón, 2023).
El  problema  surge en  la  Facultad  de  Ciencias  Matemáticas  y  Físicas  de  la
Universidad de Guayaquil, dentro de la Carrera de Software, bajo el contexto educativo
que   determina   que   las   prácticas   preprofesionales   constituyen   un   componente
obligatorio  para  la  formación  de  los  estudiantes  de  la Universidad  de  Guayaquil.  La
falta  de  sistematización  de  estos  procesos  de  postulación  implica desorientación en
estudiantes y empresas de manera simultánea.

- Factible: La factibilidad se refiere a la posibilidad real de llevar a cabo la
investigación del problema planteado, considerando los recursos disponibles, el tiempo
requerido,  el  acceso  a  la  información  necesaria  y  la  viabilidad  metodológica.  Un
problema  es  factible  cuando  puede  ser  abordado  de  manera  eficiente  dentro  de  las
limitaciones del proyecto. (Zeas Guaraca, 2023).
La solución propuesta es factible tanto a nivel técnico como operativo. Por un
lado,  existe  amplia  documentación  y  herramientas  accesibles  para  implementar
modelos de procesamiento de lenguaje natural y embeddings semánticos. Por otro lado,
la  viabilidad  se  asegura  al  probar  el  sistema  en  un  entorno  de  validación  con  datos
simulados, lo que evita conflictos de privacidad institucional y permite cumplir con el
cronograma del proyecto.

## 28
Causas y consecuencias del problema
En esta sección presentaremos la relación entre las causas y las consecuencias que implica
la  problemática  identificada  en  el  proceso  inicial  de  selección  de  empresas  de  prácticas
preprofesionales en la Carrera de Software en la Universidad de Guayaquil. (Ver tabla 2)
## Tabla 2
Matriz de causas y consecuencias del problema
## Causas Consecuencias
C1. Búsqueda  manual  basada  en información
básica de un listado en Excel.
E5.1. Búsqueda desorientada.
E1.2   Perdida   de   tiempo   al   tener   que
investigar el perfil de cada empresa.


C2.    Desconocimiento    de    empresas    con
vacantes relacionadas a su carrera.
E2.1. Alta tasa de postulaciones irrelevantes.
E2.2.  Repetición  de  procesos  de  contacto  y
entrevista.

C3.    Falta    de    alineación    entre    el    perfil
académico del estudiante y los requisitos de la
empresa.
E3.1.   Disminuye   la   probabilidad   de   ser
contratado por la empresa.
E3.2 Prácticas que no aportan en la formación
del estudiante.


C4. Falta de un sistema centralizado que
permita a los estudiantes explorar vacantes
disponibles y al gestor de prácticas conocer
las áreas ofrecidas por cada empresa al
momento de realizar asignaciones.
E4.1.  Los  estudiantes  contactan  una  a  una  a
las empresas para obtener información sobre
las vacantes disponibles.
E4.2    El    gestor    asigna    estudiantes    sin
considerar    su    perfil    académico    ni    sus
intereses,    generando    asignaciones    poco
relevantes para su formación.


C5. Subestimación de las habilidades del
practicante.
E5.1    Asignación    de    actividades    poco
relacionadas a su carrera.
E5.2 Desmotivación sobre sus oportunidades
laborales.


C6.  Presión  institucional  para  cumplir  con  el
número de horas exigidas.

E6. Estudiantes que solo buscan cumplir las
horas de práctica sin importar el aprendizaje.


Nota: Esta tabla refleja el análisis causal que se realizó en base a las causas y consecuencias identificadas referentes
a la problemática. Elaborado por: Galarza Bryan, Anchundia Naldo.


## 29
Formulación del problema
En  los  últimos  años  la  cantidad  de  convenios  entre  la Universidad  y  las  empresas  para  el
proceso de prácticas preprofesionales ha estado en aumento, así como la cantidad de estudiantes
de  la  Carrera  de  Software que  requieren cumplir  con este  proceso. Sin  embargo,  no  existe  un
proceso de asignación sistematizado por lo que la gestión manual suele ser poco eficiente tanto
para el gestor de prácticas como para los estudiantes al tener que basarse en información limitada
desde  el listado  de  convenios  manteniendo  una  baja  correspondencia  entre los perfiles  y  los
requerimientos  de  las  empresas  por  lo  cual muchas  veces los  practicantes  terminan  realizando
actividades que no guardan relación con su carrera.
En base a esto se plantea la siguiente interrogante:
¿De  qué  manera  un sistema  de  recomendación basado en  técnicas  NLP  y  modelos  de
similitud semántica mejoraría la compatibilidad entre el perfil académico de los estudiantes y las
vacantes ofrecidas por las empresas en el proceso de prácticas preprofesionales de los estudiantes
de la Carrera de Software?


## 30
Objetivos del proyecto
Objetivo general
Desarrollar un sistema de recomendación web para prácticas preprofesionales de la Carrera
de  Software  mediante  técnicas  NLP  y  modelos  de  similitud  semántica  para  la  optimización  del
proceso de búsqueda y postulación a través de recomendaciones personalizadas.
Objetivos específicos
- Determinar los requisitos funcionales y no funcionales del sistema para la definición
del alcance lógico y las reglas de operación de la plataforma.
- Diseñar la arquitectura de software y los esquemas de base de datos aplicando
patrones de desarrollo web para la estructuración de los módulos de gestión de
usuarios y publicación de vacantes.
- Desarrollar el modelo de matching bidireccional para la generación de porcentajes de
afinidad entre las competencias del postulante y los requisitos de la vacante.
- Desarrollar el prototipo funcional de la plataforma web integrando los componentes
de interfaz y lógica de servidor.
- Validar la operatividad técnica de la plataforma y la precisión del motor de
emparejamiento mediante la ejecución de escenarios de prueba con datos simulados.
Alcance del problema
El proyecto se centra en el diseño y desarrollo de un prototipo de sistema de recomendación
web orientado a optimizar la etapa inicial del proceso de prácticas preprofesionales de la Carrera
de Software de la Facultad de Ciencias Matemáticas y Físicas de la Universidad de Guayaquil. El
prototipo permite a los estudiantes de la Carrera de Software descubrir vacantes compatibles con

## 31
su perfil académico y técnico, a las empresas identificar postulantes afines y al gestor de prácticas
administrar las empresas convenio disponibles, todo mediante un motor de recomendación basado
en  procesamiento  de  lenguaje  natural  y  similitud  semántica. El  proyecto  propuesto  no  busca
reemplazar  ningún  proceso  institucional  existente  ni  integrarse  con  el  sistema  actual  de
seguimiento de prácticas vigente, sino resolver la etapa no sistematizada que ocurre antes de que
el estudiante ingrese formalmente al proceso: la búsqueda, recomendación y postulación inicial.
Para la definición de los requerimientos, el alcance se basa en el estudio del proceso actual
de búsqueda y postulación de prácticas preprofesionales de la Carrera de Software, identificando
la información necesaria para la delimitación lógica del sistema y asegurando que el prototipo se
adapte a la realidad académica de la institución.
El diseño del sistema contempla una arquitectura cliente-servidor, utilizando las siguientes
tecnologías:
- React.js: Para el desarrollo de interfaces dinámicas y la experiencia de usuario.
- Python  y  Flask: Para  la  gestión  de  la  lógica  de  negocio  y  la  seguridad  de  la  API
RESTful.
- Python: Para el procesamiento NLP y los algoritmos de similitud semántica.
- PostgreSQL: Para el almacenamiento relacional e íntegro de la información.
El aplicativo será únicamente en versión web y no móvil integrando los siguientes módulos
funcionales, alineados a cada objetivo específico del proyecto:
- Módulo   de   Gestión   de   Usuarios: Controla   el   acceso   y   la   autenticación
diferenciando  tres  roles:  el  gestor  de  prácticas  de  la  Carrera  de  Software,  los
estudiantes  de  la  Carrera  de  Software  y  las  empresas  de  convenio,  cada  uno  con
permisos y vistas personalizadas.

## 32
- Módulo de Perfil Académico: Permite a los estudiantes de la Carrera de Software
registrar y gestionar su información curricular y habilidades técnicas, estructurando
los datos para facilitar el análisis semántico.
- Módulo  de  Gestión  de  Vacantes: Habilita  a  las  empresas  para  administrar  sus
ofertas  de  prácticas  detallando  requisitos,  áreas  disponibles  y  competencias
requeridas de forma estandarizada.
- Módulo  de  Emparejamiento  (Matching): Ejecuta  el  algoritmo  de  similitud
semántica desarrollado en Python para comparar automáticamente los perfiles de
los estudiantes con las vacantes publicadas, generando un porcentaje de afinidad
que servirá como base para las recomendaciones personalizadas.
- Módulo de Postulación y Seguimiento: Facilita la aplicación a vacantes por parte
de los estudiantes y la visualización del estado de cada solicitud, centralizando el
flujo del proceso inicial de prácticas.
La plataforma está desplegada en un entorno de pruebas para validar la integración de los
servicios y la precisión del algoritmo de emparejamiento utilizando datos simulados que repliquen
la estructura real de perfiles y vacantes.
Justificación e importancia
El presente proyecto surge a partir de la identificación de las deficiencias en el proceso
actual de asignación de prácticas en la Carrera de Software, el cual se caracteriza por ser manual
y desorientado provocando un alta tasa de postulaciones irrelevantes por parte de los estudiantes,
pérdida de tiempo, y una baja alineación entre el perfil del estudiante y las actividades que termina
realizando.
Esta desorientación impide que se maximice el potencial del practicante al no exponerlo

## 33
a  actividades  que  le  permitan  especializarse  y  desarrollar  sus  habilidades  técnicas  y  sociales,
reduciendo sus posibilidades de empleabilidad futura y generando desmotivación y resignación a
únicamente cumplir las horas requeridas por obligación, sin el objetivo de aprender de su entorno.
El sistema de recomendación centralizará la información y filtrará las mejores opciones
mediante  un  proceso  de  match  beneficiando  tanto  a  los  estudiantes de  la  Carrera  de  Software
como  a  las  empresas  al  migrar  de  un  proceso  manual  a  algo  sistematizado,  minimizando  los
niveles de frustración e incertidumbre en los estudiantes al contar con una plataforma en la que
pueden observar las vacantes y postular y además centralizando la información de los postulantes
para las empresas.
Este sistema no busca ser solo un espacio de publicación y postulación, si no que busca
actuar  como  intermediario  para  una  mejor  vinculación  entre  las  empresas  y  los  estudiantes  a
través del uso de técnicas de procesamiento de lenguaje natural, resolviendo las problemáticas
identificadas  al  relacionar  a  ambas  partes  según  su  nivel  de  compatibilidad,  brindado  a  los
estudiantes la oportunidad de participar en un contexto real de su área y llegar a ser contratados
por la empresa en la que realizan las prácticas.
Limitaciones del estudio
El presente estudio muestra las siguientes limitaciones técnicas, operativas y de alcance,
tomando  en  consideración  los  recursos  disponibles,  la  naturaleza  académica  del  proyecto  y  la
privacidad de la información:
- Uso  de datos simulados: Debido  a  las  políticas  de  privacidad  y  protección  de  datos
personales, el entrenamiento y validación del modelo de NLP se realizará exclusivamente
con datos ficticios (simulados) que repliquen la estructura de perfiles y vacantes reales. No
se  hará  uso  de datos  reales  ni  información  sensible  proveniente  de  la  plataforma

## 34
institucional,   como   detalles   de   convenios,   empresas   ni   estudiantes   actuales   de   la
## Universidad.
- Entorno  de despliegue: El  prototipo  será  implementado  y  validado  únicamente  en  un
servidor de pruebas o entorno local. Por consiguiente, no se contempla el despliegue en la
infraestructura  tecnológica  oficial  de  la  Universidad  de  Guayaquil  ni  una  integración
efectiva con el sistema de gestión académica de prácticas vigente (SIUG).
- Alcance  de  la gestión  de prácticas: El  proyecto  se  enfoca  exclusivamente  en  la  etapa
inicial  de  búsqueda  y  recomendación.  No  contempla  la  gestión  del  proceso  de  prácticas
una vez iniciadas, excluyendo funciones como la asignación de tutores, el registro de horas
y la emisión de certificados, ya que dichas actividades corresponden al sistema institucional
actual.
- Alcance del algoritmo NLP: El motor de recomendación se limitará a analizar la similitud
semántica  textual  entre  las  habilidades  declaradas  y  los  requisitos  de  la  vacante.  No
contempla análisis psicométricos, procesos de entrevista automatizada, ni la validación o
verificación de la veracidad de la información ingresada por los estudiantes, como títulos,
certificados o experiencia previa declarada en sus perfiles.
- Comunicación y notificaciones: El diseño del sistema no contempla el desarrollo de un
módulo  de  mensajería  o  chat  interno  para  la  comunicación  directa  entre  estudiantes  y
empresas   dentro   de   la   plataforma.   Asimismo,   no   incluye   la   implementación   de
notificaciones por correo electrónico ni alertas push ante la creación de nuevas vacantes.




## 30

## CAPÍTULO II
## MARCO TEÓRICO
Antecedentes del estudio
En esta sección presentamos una revisión sistemática acerca de artículos científicos, tesis de
grado y proyectos previos realizados en los últimos cinco años a nivel nacional e internacional que
mantienen relación  con nuestro  presente  proyecto  acerca  de  la  aplicación  de  un  sistema  de
recomendación  para  prácticas  preprofesionales en  la  Carrera  de  Software  de  la  Universidad  de
Guayaquil. Esto con el objetivo de contextualizar la importancia de aplicar modelos de similitud
semántica   para   mejorar   la   compatibilidad   entre   estudiantes   y   empresas   promoviendo   la
empleabilidad.
## Antecedentes Internacionales
El trabajo de investigación realizado en Londres por Ajjam y Al-Raweshidy (2026) titulado
“AI-driven semantic similarity-based job matching framework for recruitment systems” consistió
en la evaluación del uso  de técnicas de procesamiento de lenguaje natural  (NLP), vectorización
TF-IDF y cálculo de similitud para el desarrollo de un modelo de reclutamiento inteligente capaz
de  procesar  la  información  de  un  currículum,  evaluar  las  habilidades  y  características de  los
postulantes y  filtrarlos  con  una  vacante especifica  mejorando  así  la  correspondencia  entre
candidatos y puestos de trabajo.

## 31

Entre los resultados de la investigación se evidenció la eficacia de estos modelos semánticos
en  comparación  con  otros  modelos  como  el  de  relación  por  palabras  clave  al  superarlo  en  una
prueba  experimental  de  similitud  con  0.74  de  efectividad  frente  al  0.35  del  método  de  palabras
clave. De la misma manera se  aplicaron otras pruebas más desafiantes que abordaron contextos
reales tales como el análisis en ciencia de datos y el alineamiento de perfiles en el cual se alcanzó
una puntuación máxima de 0.88, mientras que los otros modelos se mantuvieron por debajo del
17% concluyendo la utilidad del modelo propuesto en distintos sectores y sobre todo su eficacia
para el emparejamiento de empleos basado en similitud.
Bajo un contexto similar, la investigación realizada en Arabia Saudita por Alsaif et al. (2022)
titulada “NLP-Based Bi-Directional Recommendation System: Towards Recommending Jobs to
Job Seekers and Resumes to Recruiters” consistió en la propuesta de un sistema de recomendación
bidireccional  cuyo  objetivo  fue  la  optimización  del  proceso  de  contratación  y  mitigación  de  los
niveles de desempleo al relacionar de forma recíproca a solicitantes y reclutadores idóneos entre
sí. Esto a través del uso de técnicas NLP para la transformación de información desestructurada
de perfiles y descripciones de puestos de trabajo permitiendo la comparación de ambas y acorde
al nivel de similitud realizar el filtrado de recomendación.
En la investigación a través del uso de métricas de precisión se logró llegar a la conclusión
de que el modelo bidireccional mejoró la correspondencia entre perfiles y puestos alineando a los
postulantes con áreas donde sus conocimientos serian realmente útiles y separándolos de áreas en
donde su porcentaje de similitud fue notoriamente bajo, así como también hubo una reducción en
el tiempo que les tomaba a los reclutadores evaluar candidatos.
En base a esto podemos reafirmar nuestra postura por aplicar modelos de similitud semántica
al  contexto  de  prácticas  preprofesionales  a  través  de  un sistema  de  recomendación web  que

## 32

optimice  la  búsqueda  de  vacantes  a  través  de  la  vinculación  basada  en  compatibilidad  existente
entre perfiles y los requisitos de la vacante aumentado las posibilidades de inserción laboral.
Antecedentes regionales
En  un  estudio  realizado  en  Colombia  por  Carabali-Sanchez  (2025) con  el  nombre  de
“Procesamiento de Lenguaje Natural Aplicado a la Selección de Personal” se  exploró el uso de
técnicas NLP y la aplicación de modelos Transformers y Word embeddings para la modernización
de los métodos tradicionales de selección de personal a través de la identificación automática entre
relaciones semánticas para distintas partes.
La metodología del estudio requirió de la aplicación de técnicas de scrapping para realizar
la  captura  de  los  datos  de  entrenamiento  directamente  desde  plataformas  web  como LinkedIn,
seguido a esta etapa de recolección se realizó la etapa de limpieza y transformación utilizando los
modelos de transformación y embeddings como Universal Sentence Encoder (USE) convirtiendo
el texto desestructurado en representaciones vectoriales las cuales permitieron la comparación de
perfiles y la clasificación automática.
La investigación concluyó que el modelo Universal Sentence Encoder es uno de los modelos
más eficientes en NLP para comprender el contexto de los currículums y realizan la clasificación
semántica  prestándose  como un  recurso  clave  para  el  modelo  de  selección  al  optimizar la
experiencia de empleadores y postulantes.
En la tesis de maestría titulada “Un enfoque de clasificación no supervisada para un sistema
de recomendación de currículums vitae basado en la similitud semántica” elaborada por Alasino,
A. (2024) en Argentina se propuso la elaboración de un sistema inteligente basado en aprendizaje
no supervisado y técnicas de procesamiento de lenguaje natural para la selección de candidatos y
clasificación de estos en base a curriculums filtrados en plataformas de ATS.

## 33

El  estudio consistió  en  dos  partes,  primero  el  procesamiento  de datos  no  estructurados
provenientes de un corpus de texto con 1,120 currículums y 3,840 vacantes laborales aplicando
métodos  de  limpieza,  etiquetado  por  áreas  y  entrenamiento.  Posteriormente  se  combinaron  los
modelos Lbl2Vec y  Transformers  para  la  clasificación  de  documentos  y  la  generación  de
recomendaciones específicas simulando un escenario de recursos humanos.
Los resultados evidenciaron la utilidad de los modelos semánticos, en especial Lbl2Vec para
el entrenamiento de un sistema de recomendación destacando que el modelo entrenado puede ser
integrado a entornos corporativos que integren ATS facilitando la identificación de cualidades y
mejorando la eficiencia del proceso de selección.
Según lo planteado por los autores se puede confirmar la viabilidad de la implementación de
modelos  semánticos  de  embedding, Lbl2Vec y  vectorización  para un  sistema  inteligente  de
matching  orientado  a  la  selección  y  postulación  de  prácticas  preprofesionales,  reduciendo  los
tiempos de búsqueda a través de filtrado automático basado en contexto y siendo un apoyo para la
toma de decisiones tanto para estudiantes como para el gestor de prácticas.
Antecedentes locales
El trabajo de titulación titulado “Buscador  interno  Web  con  procesamiento  del  lenguaje
natural  y  métricas  de  similitud  de  inteligencia  artificial  tomando  como  caso  de  estudio  un  E-
commerce” realizado por Recalde Morales y Soria Columba (2022) en Quito-Ecuador consistió
en el desarrollo de un buscador interno a través del entrenamiento de un modelo de recomendación
orientado a la mejora de una plataforma de e-commerce.
El  sistema fue  implementado utilizando base  de  datos  NoSQL para  el  corpus  de  texto  y
aplicando métricas de similitud y algoritmos de relación como el coseno de Salton y el coeficiente
de  Jaccard para  la  comparación  de  consultas complejas de  Procesamiento  de  Lenguaje  Natural

## 34

(NLP), concluyendo que la aplicación de técnicas de procesamiento de lenguaje natural mejoran
significativamente  los  resultados recomendados  por  un  sistema  en  base  a  una  consulta  y  por  lo
tanto brindando una mejor experiencia a los usuarios.
Villamar Cahueñas (2024) en su tesis de grado titulada “Plataforma web para asignación de
estudiantes  a  programas  de  prácticas  preprofesionales  en  la  Facultad  de  Ingeniería  en  Sistemas
(FIS)  con  enfoque  ágil  en  el  desarrollo  de  front-end  y  back-end:  Desarrollo  de  front-end” en la
Escuela  Politécnica  Nacional  de  Quito  elaboró  el  diseño  y desarrollo  del  frontend  de una
plataforma web integral a través del uso de la metodología SCRUM y el framework Next.js con el
objetivo  de  optimizar el  proceso  de asignación y  gestión  de  prácticas  preprofesionales  en  la
Facultad de Ingeniería en Sistemas (FIS) en Escuela Politécnica Nacional. El proyecto tuvo como
objetivo  la  sistematización  de  los  procesos  manuales  por  lo  que  mediante  la  elaboración  de
diferentes  módulos  el  sistema  permitió  centralizar la  búsqueda  de  vacantes a  los estudiantes y
facilitar la publicación de ofertas para las empresas.
Posteriormente realizaron la aplicación de cuestionarios SUS para identificar la usabilidad
del  sistema  y  pruebas  de  uso  al  prototipo  utilizando  una  pequeña  población  de  usuarios  para
obtener feedback de estos. Los resultados del estudio indicaron que una plataforma que pueda ser
utilizada tanto por estudiantes como por empresas mejora significativamente la experiencia de los
usuarios, logrando una mayor eficiencia en la gestión de vacantes y postulantes.
Por  otro  lado, Palma  Moreira  (2024) en  su  tesis  de  grado  elaborada  en  Manabí-Ecuador
titulada “Las prácticas preprofesionales y su aporte en la inserción laboral de los graduados de la
carrera  de  Trabajo  Social  de  la  ULEAM,  años  2024-202”  realizó  un  estudio descriptivo  y
documental respecto al aporte que tienen las prácticas preprofesionales en la inserción laboral de
los  graduados en  la  ULEAM. Para  el  desarrollo  de  este  estudio  se aplicó  una  encuesta  a  249

## 35

egresados y se procesaron los datos utilizando la herramienta SPSS con el objetivo de evaluar la
relación   que   existe   entre la   tasa   de   empleabilidad, las habilidades   desarrolladas   y el
acompañamiento tutorial.
De acuerdo con los resultados obtenidos en el estudio se pudo identificar que las habilidades
que más se desarrollan en la realización de las prácticas preprofesionales son las interpersonales y
de  relación  social  con  un  39%,  mientras  que  las  habilidades  técnicas  se  desarrollaron,  pero  de
forma mínima concluyendo que existe una desconexión crítica entre las actividades que se realizan
en las prácticas y las competencias que se exigen en el ámbito profesional. Sin embargo, Palma
Moreira (2024) sostiene que las otras habilidades que desarrollan los estudiantes en las prácticas
son  igual  de  importantes,  pero  que  aun  así  se  deberían  rediseñar los  programas  de  prácticas
preprofesionales para asegurar que las actividades realizadas por el estudiante se vinculen con las
necesidades laborales garantizando una transición profesional menos brusca.
En base a estos antecedentes tanto mundiales como regionales y locales podemos sustentar
la  viabilidad  de  implementar  un  modelo  de  similitud  semántica  y  técnicas  de  procesamiento  de
lenguaje natural para el desarrollo de un sistema de recomendación de prácticas preprofesionales
dirigido  a  la  Carrera  de  Software  de  la  Universidad  de  Guayaquil  optimizando  los  tiempos  de
búsqueda,  postulación  y  filtrado,  resolviendo  problemáticas  como  las  identificadas  por  Palma
garantizando  una  vinculación  más  justa y  fiable que  permita  a  los  estudiantes  desarrollar  sus
habilidades profesionales requeridas en el mundo laboral.


## 36

Fundamentación teórica
Carrera de Software de la Facultad de Ciencias Matemáticas y Físicas de la
Universidad de Guayaquil
## Historia
La Universidad de Guayaquil remonta sus orígenes en el año 1867 con la consolidación de
la cátedra de Jurisprudencia permitiendo cubrir  con la demanda de los estudios superiores de la
época y  tan  solo nueve  meses después creando  oficialmente  la  facultad  de  Jurisprudencia
(Universidad de Guayaquil, 2025).
Desde entonces la Universidad de Guayaquil se ha extendido considerablemente mediante
la  adaptación a  las  necesidades  sociales,  ambientales y  tecnológicas  del  país  formando  a
profesionales de diversas carreras y creando nuevas facultades para las mismas, tal es el caso de
la Facultad de Ciencias  Matemáticas y Físicas a  la que pertenece la Carrera de Software que se
creó en junio del año 1933.
Carrera de Software
La Carrera de Software forma parte de la Facultad de Ciencias Matemáticas y Físicas de la
Universidad de Guayaquil y se ubica en el centro de la ciudad específicamente en la Av. Victor
Manuel Rendon, contando con autoridades a la Ing. Leili Lopez Dominguez Rivas, M. Sc. como
directora de Carrera y al Ing. Douglas Iturburu Salvador, M.Sc. como decano de Facultad.



## 37

## Misión
Por palabras de la Universidad de Guayaquil (2025) su misión es “consolidarse como la
comunidad académica y científica, reconocida como líder nacional por su calidad, innovación y
humanismo,  generando  impacto  positivo  y  trascendente  a  nivel  internacional”. Es  decir, que  el
objetivo de la institución no es solo limitarse con su aporte en formación académica en sus más de
40 carreras ofertadas,  sino también impulsar el  conocimiento  y  la  investigación  científica
complementando   la   formación   de   los   profesionales   y contribuyendo   en   la   solución   de
problemáticas sociales, tecnológicas o culturales reales.
## Visión
La Universidad de Guayaquil tiene como visión la formación de profesionales con un perfil
integro  sustentado  en  el  conocimiento prospectivo y científico, fomentando la  responsabilidad
social mediante  funciones  de  vinculación  y  gestión  con  la  finalidad  de  promover el  desarrollo
sostenible del país (Universidad de Guayaquil, 2025).
Perfil profesional
El perfil profesional de los egresados en la Carrera de Software los sitúa como Ingenieros
en Software con amplias capacidades en diseño y desarrollo de software de calidad a través de la
aplicación  de  principios  de  ética  y  responsabilidad,  permitiendo  el  desarrollo  de  aplicaciones  y
automatizaciones  de  procesos mediante el  diseño  de  soluciones respaldadas  en  estándares  y
metodologías apegadas a las normas de la organización. (Universidad de Guayaquil, 2025).
Los Ingenieros de Software egresados de la Facultad de Ciencias Matemáticas y físicas de
la Universidad de Guayaquil se caracterizan por presentar competencias técnicas y blandas tales

## 38

como son: el conocimiento de diversos lenguajes de programación, la gestión de base de datos, el
diseño de soluciones, la documentación y presentación de datos y el trabajo en equipo.
Prácticas Preprofesionales de la Carrera de Software de la Facultad de Ciencias
Matemáticas y Físicas de la Universidad de Guayaquil
## Definición
Las prácticas preprofesionales constituyen actividades académicas obligatorias que buscan
la convergencia entre los conocimientos adquiridos en el aula y la práctica requerida en el mundo
real, por lo que estás actividades se pueden definir como un proceso de formación crítico para los
estudiantes a través del cual podrán entender la realidad profesional, confrontar retos y elaborar
soluciones a problemáticas sociales o laborales (Varguillas et al., 2020).
De acuerdo con el Consejo de Educación Superior (2022), las prácticas preprofesionales se
definen como un conjunto estructurado de actividades destinadas a la aplicación de conocimientos
y al desarrollo de competencias profesionales acercando a los estudiantes al contexto laboral. Sin
embargo, las prácticas no solo promueven este acercamiento, sino que también son consideradas
como  un  instrumento  de  innovación  social  el  cual  promueve  la  generación  de  vínculos  entre  la
universidad y la empresas (Seller, 2022).
Para  Cabrera  González  et  al.  (2024)  las  prácticas  preprofesionales  se  definen  como  un
medio exploratorio en donde profesionales en formación tienen la oportunidad de familiarizarse
de  forma  directa  con  su  futuro  contexto  laboral  mediante  la  observación,  participación  e
interacción constante con profesionales del área. Por otro lado, Carranza Guevara et al. (2025) las

## 39

define como un espacio para la aplicación de los conocimientos teóricos adquiridos en el aula y
orientados al desarrollo de competencias y habilidades necesarias para el ejercicio profesional.
En  base  a  estas  definiciones  podemos  describir  a  las  prácticas  como  un  puente  diseñado
para la transición de un entorno académico al contexto laboral, complementando la formación de
los estudiantes a través de la participación activa, el cumplimiento de reglamentos, la ampliación
de perspectivas y el desarrollo de valores.
## Reglamentos
Las prácticas preprofesionales constituyen una parte elemental en el currículo universitario
de  los  estudiantes  de  la  Carrera  de  Software,  siendo  un  requisito  para  la  obtención  del  título
profesional. Para esto el  CES menciona en el artículo 44 del reglamento de régimen  académico
que las prácticas deberán ser monitoreadas y coordinadas por el personal académico garantizando
que  el  estudiante  aplique  sus  competencias  en  la  institución  receptora.  Es  debido  a  esto  que  la
institución  educativa  deberá  establecer convenios  o  cartas  de  compromiso  con  las  contrapartes
públicas o privadas para permitir el seguimiento de los practicantes a través de tutores.
En  cuanto  a  la  cantidad  de  horas,  esta  dependerá  de  la  carrera  que  este  cursando  el
estudiante  por  lo  que  en  el  caso  de  la  Carrera  de  Software  son  un  total  de  240  horas.  Según  el
reglamento   del   Consejo   de   Educación   Superior   (2022)   la   cantidad   mínima   de   horas
correspondiente a prácticas preprofesionales para un estudiante de tercer nivel deberá ser de 240
horas las cuales se pueden distribuir entre 144 y 96, estimando que el cumplimiento de estas horas
refleje la aplicación de conocimientos y destrezas adquiridos por los estudiantes.

## 40

A pesar de esto el cumplimiento de las horas para la obtención del certificado va más allá
de ser un simple requisito para la posterior titulación del estudiante por lo que solo cumplirlas no
debe ser el objetivo de los estudiantes universitarios y por ello es primordial el apoyo y seguimiento
de la de las instituciones involucradas enfocando las actividades de los practicantes en base a la
resolución de problemas profesionales reales (Rodríguez Díaz et al., 2022).
Las  normativas  y  directrices  que  regulan  las  prácticas  preprofesionales  en  Ecuador  son
indispensables  para  la  vinculación  de  los  estudiantes  con  el  sector  productivo  manteniendo  sus
derechos  y  evitando  que  este  componente  formativo  se  convierta  en  una  relación  laboral  sin
beneficios. Es por este motivo que la carga diaria de horas no debe ser mayor a seis y la cantidad
de horas máximas puede ser distribuida por semestres, sin embargo, cada institución universitaria
mantiene su propio reglamento, aunque este se debe basar con lo decretado por el CES.
Importancia laboral
Las   prácticas   preprofesionales   son   un   componente   esencial   en   la   integración   de
conocimientos y el desarrollo de habilidades profesionales siendo a su vez la puerta de entrada al
mundo laboral de los practicantes debido a que por medio de estas los estudiantes pueden crear
una  red  de  contactos,  adquirir  experiencia,  mejorar  su  toma  de  decisiones  y  aumentar  sus
posibilidades  de  una  futura  inserción  laboral.  Arévalo  Cordovilla,  Campoverde  Pico  y  Andaluz
León.  (2024)  indican  que  el  mercado  laboral  exige  profesionales  flexibles  que  mantengan
conocimientos técnicos, pero también la capacidad de adaptarse a diversas situaciones, las cuales
son destrezas que deberían maximizarse en la formación de los practicantes.
Las prácticas preprofesionales influyen en el aprendizaje integral juntando los dos pilares
del  saber,  el  saber  ser  y  el  saber  hacer,  conocimientos  esenciales  para  la  formación  óptima  del

## 41

profesional  (Rodríguez  Díaz  et  al.,  2022).  En  la  investigación  de  Guim  &  Marreno  (2022)  se
menciona  que  además  de  los  conocimientos  técnicos  la  experiencia  de  prácticas  favorece  al
desarrollo de competencias clave que son requeridas por las organizaciones como lo son la visión
interdisciplinaria,  la  creatividad,  la  innovación  y  el  trabajo  en  equipo,  habilidades  blandas  que
incrementan las posibilidades de inserción de los estudiantes en el mercado laboral.
La  investigación  de  Quilumba  (2023)  refuerza  esta  postura  al  estudiar  el  impacto  de  las
prácticas  en  la  formación  de  los  estudiantes  y  llegando  a  la  conclusión  de  que  estas  no  solo
complementan  los  conocimientos  teóricos  adquiridos  en  el  aula,  sino  que  también  mejoraron
habilidades sociales de los practicantes tales como la responsabilidad y la escucha activa, lo que
demuestra la importancia de las prácticas en la formación de los futuros profesionales.
Por otro lado, un reciente estudio realizado por Macas Padilla et al. (2025) determina que
la  formación  basada  en  competencias  en  la  que  se  basan  las  practicas  preprofesionales  no  solo
genera aprendizajes significativos en valores y capacidades técnicas al exponer a los estudiantes
de  la  Carrera  de  Software  a  escenarios  reales,  sino  que  también  impulsa  a  la  socialización
profesional facilitando la transición de los estudiantes hacia las oportunidades laborales.
Esta formación basada en competencias es fundamental ya que ofrece a los estudiantes la
oportunidad de fortalecer sus habilidades blandas, desarrollar técnicas de trabajo, comprender una
estructura organizacional, aprender el uso de herramientas y consolidar su propia identidad como
profesional, incrementando su experiencia y sus posibilidades de empleabilidad.



## 42

Desafíos en prácticas preprofesionales
Los ingenieros en formación presentan múltiples desafíos en sus prácticas preprofesionales
que se presentan desde el momento de elegir el lugar de prácticas hasta la realización de estas ya
sea por el desconocimiento de lugares o la existencia de una cantidad limitada de vacantes para su
área.  En  el  desarrollo  de  prácticas  el  desafío  que  más  suelen  enfrentar  los  estudiantes  es  el
desconocimiento   previo   con   el   que   llegan   a   sus   puestos   presentando   incertidumbre   y
desmotivación por la asignación de actividades que no se relacionan a su carrera.
Villamar  Cahueñas  (2024)  menciona  que  son  muy  pocos  los  estudiantes  que  logran
encontrar un buen lugar para la realización de prácticas preprofesionales por cuenta propia y que
las empresas suelen filtrar a los candidatos según sus niveles de experiencia y proactividad en base
a  los  requerimientos  del  área  y  no  aceptándolos únicamente por  ser  parte  de  la  institución  de
convenio. Además de esto, la adaptación a situaciones inesperadas de forma frecuente es otro de
los desafíos que los estudiantes de la Carrera de Software deben enfrentar para su formación como
ingenieros,  que,  si  bien  muchos  estudiantes  si  suelen  desarrollar  habilidades  de  resiliencia  y
adaptarse  a  las  situaciones  presentadas  en  los  proyectos,  otros  no  lo  logran  y  se  estancan
requiriendo de acompañamiento institucional (Arévalo Cordovilla et al., 2024).
El autoaprendizaje es otro de los desafíos que deberán enfrentar los fututos profesionales
puesto que se ha evidenciado que los alumnos realizan las actividades que su tutor o responsable
a cargo les ordena, aunque no necesariamente estén relacionadas a su carrera. Esto se debe a que
varias empresas ven a los estudiantes como mano de obra adicional y a pesar de que les brindan la
oportunidad de involucrarse en un ambiente organizacional real, los inducen con conocimientos
básicos,  es  decir  que  no  existe  una guía  o  acompañamiento  diario  con  el  paso  a  paso  de  lo  que

## 43

deben  realizar  por  lo  que  los  estudiantes  deben  ser  autodidactas,  proactivos  y  observadores,
investigando y practicando fuera del horario de prácticas (Naranjo y Ávila, 2024).
Otro de los desafíos que enfrentan los estudiantes de Software en prácticas preprofesionales
es el brusco cambio de panorama pasando de un ambiente académico a un ambiente laboral real
en el que un error puede desencadenar varios fallos en los sistemas. No obstante, los desafíos no
deben ser un factor de desmotivación ya que a través del enfrentamiento de estos con resiliencia y
proactividad  los  estudiantes  lograrán  aprender  nuevos  conocimientos  y  desarrollar  nuevas
destrezas y habilidades.
## Relaciones
El proceso de prácticas preprofesionales relaciona tres actores principales: los estudiantes,
las  empresas  y  la  universidad,  por  lo  que  para  el  cumplimiento  de  sus  horas  de  prácticas  los
estudiantes  tendrán  que  vincularse  con  una  empresa  de  convenio  vigente  sea  pública  o  privada
para  el  desarrollo  de  sus  actividades.  Además,  esta  vinculación  también  contribuye  a  la
consolidación  de  relaciones  entre  la  institución  y  la  empresa,  así  como  la  fomentación  de
competencias profesionales (Caamaño López et al., 2023).
Sin embargo, una relación no implica que todos los estudiantes de la Carrera de Software
pasen por la misma experiencia puesto que las labores que desarrollarán en la empresa dependerán
de cada entidad y no serán las mismas para cada estudiante, debido a que cada empresa maneja
distintos  tipos  de  herramientas,  tecnologías  y  proyectos  a  desarrollar,  así  como  también  un
reglamento  interno  al  cual  el  estudiante  tendrá  que  adaptarse  por  el  periodo  de  tiempo  que
permanezca en la empresa.

## 44

Por palabras de Ruiz Ducase (2024), el vínculo que se crea entre universidades y empresas
en  el  proceso  de  prácticas  preprofesionales  es  un  componente  estratégico  que  no  solo  garantiza
una mejor formación en  el estudiante al adaptarlo a exigencias reales en  el entorno profesional,
sino que también funciona como un promotor para su permanencia en las empresas poniendo en
alto el nombre de la institución.
La relación entre la universidad y el sector empresarial crea un modelo de beneficio mutuo
que  va  más  allá  del  cumplimiento  de  un  requisito  académico  para  los  estudiantes  debido  a  la
formación de acuerdos de cooperación como los convenios en donde ambas entidades promueven
un  intercambio  estratégico  de  recursos  y  capacidades.  Es  por  esta  razón  que  se  definen  a  las
prácticas preprofesionales como un medio de conexión reciproco en donde instituciones educativas
ofrecen a las empresas soporte y apoyo para sus proyectos, recibiendo como beneficio espacios
laborales para que sus estudiantes puedan desarrollar sus labores y experimentar un entorno real
(Fernández Medina et al., 2023).
El  éxito  y  aprovechamiento  de  las  prácticas  preprofesionales  para  los  estudiantes  de  la
Carrera de Software dependerá de varios factores siendo uno de ellos la compatibilidad entre lo
que  realiza  el  estudiante  y  lo  que  estudia,  por  lo  que  fomentar  una  buena  relación  estudiante-
empresa  debe  ser  algo  crucial  y  responsabilidad  de  todos  los  involucrados  ya  sean  estudiantes,
empresas, tutores y el departamento de prácticas preprofesionales de la propia carrera debido a que
en este convenio de formación todos se involucran por igual.


## 45

## Inteligencia Artificial
## Historia
El  concepto  de  inteligencia  artificial surgió  en  el  año  1950  con  la  interrogante  de  Alan
Turing de si una maquina puede llegar a tener capacidad de pensamiento tal y como la tienen los
humanos, tema propuesto en el artículo “Computing Machinery and Intelligence”. Sin embargo,
el término “inteligencia artificial” fue mencionado en 1956 en el seminario realizado en Dartmouth
College lo cual fue el inicio a la definición de IA que conocemos en la actualidad (Lan, 2022).
Toosi et al. (2021) nos mencionan que a partir de esta fecha se propusieron nuevos avances
de éxito en inteligencia  artificial contemplados en una etapa  conocida como verano de la  IA en
donde  surgió  la  idea  de  las  redes  neuronales  con  el  termino  de  perceptrón propuesto  por Frank
Rosenblatt en 1957. Sin embargo, las altas expectativas provocaron un descenso conocido como
invierno de la IA en la década de los 70 en donde decayó el interés por el desarrollo de nuevos
sistemas expertos y se quitó el financiamiento a la investigación sobre inteligencia artificial que
en conjunto con las limitaciones en tecnología frenaron el crecimiento de la IA por varios años.
No obstante, en 1977 con el triunfo de Deep Blue se recuperó el interés en la inteligencia
artificial y el aprendizaje automático refinanciando la investigación y dando paso a la era de Deep
learning en el 2012 con las pruebas en sistemas para tareas de visión y reconocimiento hasta llegar
a la IA generativa que conocemos hoy en día.



## 46

## Definición
La Inteligencia artificial o IA es una disciplina que tiene como objetivo la simulación de
los  aspectos  del  pensamiento  humano  aplicados  a  un  computador  lo cual incluye características
como el aprendizaje automático o machine learning, el procesamiento de lenguaje natural, la visión
por computadora, los sistemas experto y el razonamiento automatizado. Cada una de estas ramas
abordando  diferentes  aspectos  que  conllevan  al  desarrollo  del  objetivo  general  de  la  IA  que  es
dotar  a  los  sistemas  computacionales  con  capacidades  inteligentes  para  interpretar,  aprender  y
actuar autónomamente en entornos complejos. (Instituto Data Science Argentina, 2025).
Paredes et al. (2025) complementa esta definición recalcando que la inteligencia artificial
se trata de una disciplina científica que ofrece a los sistemas informáticos la capacidad de realizar
actividades que usualmente requerirían de la inteligencia humana tales como son la percepción del
entorno, la interacción, el razonamiento y el aprendizaje.
## Ramas
La inteligencia artificial se divide en diversas ramas orientadas a un distinto tipo de enfoque
como  el  simbólico,  conexionista  o  probabilístico,  enfoques  que  permiten  al  sistema  emular  la
inteligencia humana (Paredes et al., 2025).
Barrere et al. (2024) divide a la IA en las siguientes ramas:
- Machine  learning: Se  define como  la  rama  de  la  inteligencia  artificial  orientada  al
aprendizaje  de  patrones  a  partir  de  un  gran  volumen  de  datos.  Esta  rama se  divide  en
subramas y se encarga del uso de métodos estadísticos para el entrenamiento de algoritmos
mejorando la precisión en los resultados brindados (Latorre et al., 2024).

## 47

- Redes  neuronales: Son  parte  del  enfoque  conexionista  y  se  inspiran  en  la  relación  y
conexiones   de   las   neuronas   del   cerebro   humano para   simularlas   mediante   nodos
interconectados (Barrere et al., 2024). Debido a esto son esenciales en el procesamiento de
lenguaje natural y en actividades de reconocimiento.
- Deep learning:  Esta rama integra los beneficios de las redes neuronales multicapa con el
machine learning permitiendo el aprendizaje y reconocimiento de datos complejos como
imágenes o voz. Latorre et al. (2024) lo diferencia del aprendizaje automático tradicional
debido a su capacidad para el aprovechamiento de datos no estructurados al no requerir de
un previo etiquetado y preprocesamiento a la data.
- NLP: Latorre et al. (2024) define al procesamiento de lenguaje natural como una rama de
la IA probabilística que se dedica a la comprensión y ejecución del lenguaje humano por
medio  de  una  máquina.  Esta  área  de  la  inteligencia  artificial  nos  permite  ofrecerle  a  un
sistema la capacidad de  entendimiento mediante  un entrenamiento con un gran volumen
de  datos  permitiendo  comprensión  y  generación  de  texto  y  voz,  por  lo  que  será
implementado en nuestro sistema de recomendación para el análisis de los perfiles.
- Aprendizaje por refuerzo: Es una rama del machine learning no supervisado que permite
al sistema aprender en base a la exploración de posibilidades en forma de prueba y error
de una forma similar a como se obtiene el aprendizaje en humanos (Latorre et al., 2024).
Estas  ramas  y  campos  en  los  que  se  aplica  de  alguna  manera  la  inteligencia  artificial  se
presentan en la figura 1.



## 48

## Figura 1
Esquema de intersección de las tecnologías que componen la IA

Nota. Representación gráfica de las ramas de la IA y sus intersecciones con otras áreas como la robótica. Elaborado
por Barrere et al. (2024)
## Aplicaciones
- Minería de datos y Data Analytics: El análisis y minería de datos son una rama de la
ciencia de datos que, aunque no se consideran una rama directa de IA si están relacionadas
a esta, siendo una aplicación muy utilizada en las organizaciones debido a su enfoque en
la extracción de información valiosa mediante técnicas de machine learning aplicada a un
gran conjunto de datos (Latorre et al., 2024).
- Motores  de  recomendación: Latorre  et  al.  (2024)  menciona  que  estos  motores  se
encargan   de   extraer   patrones   en   los   datos   analizando   similitudes   y   entregando
recomendaciones  personalizadas  tal  y  como  es  el  caso  de  Netflix  con  su  sistema  de
sugerencia en base a gustos identificados.
En  nuestro  sistema  de  recomendaciones  para  prácticas  profesionales  en  la  Carrera  de
Software  este  enfoque  será  el  que  estaremos utilizando acompañado  de técnicas  de

## 49

procesamiento de lenguaje natural para facilitar esa identificación de semejanzas entre la
descripción de perfiles y vacantes ofrecidas por las empresas asegurando una relación más
fiable en beneficio de ambas partes.
Metodología CRISP-DM
La  metodología  Cross-Industry  Standard  Process  for  Data  Mining  o  CRISP-DM es una
metodología  estándar utilizada  en  el  área  de ciencia  de  datos  e  inteligencia  de  negocios para  el
desarrollo de un proyecto de minería de datos actuando como un modelo de referencia dividido
por  etapas. Para Sánchez  Trujillo  &  Pérez  Hernández (2021) esta  metodología  consiste  en una
forma  de  estructurar todo el  ciclo  de  vida  de un proyecto a  través  de  seis fases específicas  que
tienen como objetivo la extracción de información desde un gran conjunto de datos.
Herrera  Cardozo (2025) coincide  en  esta  postura  definiendo  a CRISP-DM como un
estándar  para  el  modelamiento  de  información  y  análisis  de  datos  en  las  empresas  de  cualquier
tipo, siendo una guía para proyectos generales al orientar al equipo de trabajo desde la comprensión
del negocio hasta la implementación de la solución.
CRISP-DM consiste en una metodología iterativa que permite regresar a una fase previa
según sea necesario lo cual es ideal en proyectos como el propuesto de un modelo para un sistema
de recomendación. Las fases se presentan a continuación con la figura 2.




## 50

## Figura 2
Metodología CRISP-DM

Nota: Flujo de trabajo general de la metodología CRISP-DM. Elaboración propia basada en el esquema presentado
por Rianti et al. (2023)


Fases de CRISP-DM:
- Comprensión del Negocio
Esta fase es indispensable para el éxito del proyecto debido a que determina la base para
las siguientes etapas. La comprensión del negocio es la fase inicial del ciclo del proyecto que se
encarga de la evaluación completa del negocio, identificando la situación actual, la problemática,
los  requisitos  y  los  objetivos con  la  finalidad  de  plasmarlos  en  un  plan  de  proyecto (Sánchez
## Trujillo & Pérez Hernández, 2021).

## 51

- Comprensión de los datos
Esta  fase es esencial para el  posterior  tratamiento de  los  datos descomponiéndose  en
subactividades como la recolección de los datos a partir de una fuente confiable, la descripción del
significado de estos, la exploración de estos identificando relaciones entre ellos y la aplicación de
pruebas estadísticas para la verificación de la calidad de la data recopilada logrando identificar los
atributos y deficiencias existentes en esa data (Schröer et al., 2021).
- Preparación de los datos
En esta fase se determinan los datos que serán utilizados para el modelo preparándolos para
su uso por lo cual se realiza la selección de estos acorde al objetivo del proyecto. Schröer et al.
(2021) menciona  que  la  selección  debe  realizarse  mediante el  uso  de criterios  de  inclusión  y
exclusión siendo el siguiente paso la limpieza y la estructuración de los datos con el fin de mejorar
su  calidad  para  proseguir  con  la  integración  de  estos  y  el  formateo  dependiendo  del  modelo  a
utilizar.
## 4. Modelado
Consiste en la construcción de uno o varios modelos de machine learning mediante el uso
de algoritmos y técnicas de minería aplicadas a los datos previamente preparados con la finalidad
de abordar la problemática identificada en la primera fase obteniendo el modelo mejor entrenado.
De acuerdo con Rianti et al. (2023) en esta fase se realiza la selección de la técnica de modelado,
la definición  de  las  herramientas que  serán  utilizadas para pruebas  y  entrenamiento  y  la
configuración adecuada de los parámetros en función del objetivo del modelo.


## 52

## 5. Evaluación
La  fase  de  evaluación  se  trata  de  una  fase  determinante  que  nos  permite analizar  los
resultados  obtenidos  concluyendo si  se  debe continuar con  la  implementación  del  modelo
construido o iterar en las fases anteriores para cumplir con los objetivos establecidos en la primera
fase.  En  esta  fase  se  realiza  la  evaluación  de  los  modelos  entrenados  mediante  la  aplicación  de
métricas y gráficos como la matriz de confusión y el árbol de decisión comparando los resultados
obtenidos con los objetivos establecidos (Schröer et al., 2021).
## 6. Despliegue
Es  la última fase  de  la  metodología y  su  complejidad  es  variable  dependiendo  de  cada
negocio puesto que el despliegue no es obligatorio y se puede finalizar esta etapa elaborando un
informe de la planificación para el despliegue, monitoreo y mantenimiento del modelo, aunque si
se  requiere  de  la  implementación  del  modelo  en  un  sistema  tendrá  que  realizarse  (Rianti  et  al.,
## 2023).
Procesamiento de Lenguaje Natural (PLN)
## Definición
El  procesamiento  de  lenguaje  natural  (PLN)  es  considerado  un  pilar  fundamental  en  la
interacción  hombre-máquina.  Delso  Vicente  et  al.  (2024)  definen  esta  tecnología  como  la
capacidad  que  permite  a  las  computadoras  no  solo  leer  texto,  sino  comprender,  interpretar  y
generar lenguaje humano con un valor práctico.

## 53

Estos   autores   señalan   que   esta   evolución   está   revolucionando   nuestra   forma   de
comunicarnos  con  las  máquinas ya  que  facilita tareas  complejas  para  el  ser  humano  como el
análisis de grandes volúmenes de información no estructurada, un factor que resulta esencial para
aplicaciones   modernas   como   la   clasificación   de   datos   y   el   desarrollo   de   sistemas   de
recomendación.
La  aplicación  de  técnicas  de  PLN en  un  sistema  de  recomendación  para  prácticas
preprofesionales es  necesaria  debido  a  que  la  información  no  está  estructurada puesto  que  las
vacantes  de  empresas  y  los  perfiles  de  los  estudiantes  son  un texto  libre  y  no  categorizados.  Es
decir  que sin  el  uso  de  técnicas  PLN el  sistema  no  podría  diferenciar que "Manejo  de  React"  y
"Desarrollo Frontend con librerías JS" son habilidades relacionadas y el no diferenciarlas terminará
en una pérdida de oportunidad en la obtención de prácticas.
## Historia
La  evolución  del  procesamiento  de  lenguaje  natural  (PLN)  ha  tenido  un  cambio  en  los
últimos años. Giraldo Forero & Orozco Duque (2023) explican que en sus inicios los algoritmos
PLN estaban basados en reglas gramaticales hechas de forma manual, lo que limitaba su capacidad
de  adaptación.  Los  autores  señalan  que  con  el  avance  de  la  inteligencia  artificial  se  ha  logrado
pasar  a  modelos  de  clasificación  supervisada  como  la  regresión  lingüística  y  las  máquinas  de
soporte vectorial.
El  procesamiento  del  lenguaje  natural  a  finales  de  los  ochenta  tuvo  un  cambio  muy
importante. Los investigadores dejaron de depender de las reglas escritas a mano y se transitó a
modelos  estadísticos  que  aprenden  directamente  de  grandes  colecciones  de  textos  reales.  Un
ejemplo de esto son las cadenas de Markov que calculan la probabilidad de cada palabra nueva en

## 54

base  a  las  anteriores,  y  el  de  Naive  Bayes,  que  utiliza  el  teorema  de  Bayes  para  clasificar
documentos  o  analizar  sentimientos  de  manera  sencilla.  Gracias  a  estos  métodos,  los  sistemas
dejaron de ser tan rígidos y comenzaron a generar resultados más naturales, lo que permitió avanzar
en el desarrollo de esta área (Gómez-Rodríguez, 2025).
Desde el 2010 el procesamiento de lenguaje natural cambió con el deep learning, las redes
neuronales  que  durante  mucho  tiempo  habían  estado  olvidadas  volvieron  a  tomar  importancia,
gracias  al  aumento  de  la  capacidad  computacional  tanto  como  la  disponibilidad  de  más  datos  y
mejores  métodos  de  entrenamiento.  Uno  de  los  momentos  más  importantes  fue  la  llegada  de
Word2Vec, que transformaba cada palabra en un vector numérico, siendo capaz de captar si dos
términos  tenían  significados  parecidos,  aunque  no  se  parecieran  en  su  forma  escrita.  (Gómez-
## Rodríguez, 2025).
El procesamiento de lenguaje natural en 2017 tuvo un gran impacto con la introducción de
la  arquitectura  Transformers,  que,  a  diferencia  de  otros  modelos  anteriores  basados  en  redes
neuronales  recurrentes  (RNN)  que  procesaban  las  palabras  de  forma  secuencial,  usaba  un
mecanismo de atención que procesaba todo el texto de manera simultánea y capturaba relaciones
complejas a larga distancia.
Esta  innovación  tuvo  un  gran  impacto  en  el  campo  del  PLN  ya  que  este  facilitó
entrenamientos  de  modelos  con  grandes  volúmenes  de  datos  y  mejoró  su  capacidad  de
comprensión y generación de texto. Gracias a esta arquitectura nacieron los large language models
(LLM), ya que están construidos sobre Transformers y hoy son la base de sistemas como ChatGPT.
(García Herrera, 2025).


## 55

Aplicaciones PLN
En  la  actualidad  el  procesamiento  de  lenguaje  natural o  PLN es  empleado  en  varias
industrias. Algunos sistemas se centran en la extracción de información desde una cantidad muy
amplia  de  textos  estructurados  o  no  estructurados  para  la  realización  de  tareas  específicas.  Los
sistemas de traducción automática son capaces de traducir diferentes idiomas, también el análisis
de  sentimientos  ayuda  a  la  toma  de  decisiones  del  cliente  interpretando  sus  emociones  o
intenciones.  Otra  aplicación  del  PLN  son  los  asistentes  virtuales  o  los  chatbots  que  imitan  la
interacción con un humano mediante conversaciones en un chat automático, brindando respuestas
a los usuarios en temas de soporte. (Delso Vicente et al., 2024).
Además, el estudio del procesamiento de lenguaje natural es relevante debido a su impacto
significativo en diversas industrias, como la salud, los servicios legales o el entretenimiento. Estos
avances están redefiniendo cómo se gestionan y procesan los datos textuales, impulsados por la
necesidad  de  analizar  y  generar  lenguaje  natural  de  manera  más  efectiva.  (Delso  Vicente  et  al.,
## 2024).
La adopción de técnicas de PLN no es una elección arbitraria, sino una respuesta técnica a
la naturaleza desestructurada de los procesos actuales en la Carrera de Software de la UG. Dado
que  la  problemática  central  identificada  en  el  Capítulo  I  es  la  ineficiencia  de  las  búsquedas
manuales en archivos de Excel, el PLN actúa como el habilitador tecnológico que permite convertir
las narrativas de los estudiantes y las descripciones empresariales en datos comparables. Sin esta
capacidad de procesamiento, el sistema se vería limitado a una búsqueda de palabras clave exactas,
ignorando  la  riqueza  semántica  de  los  perfiles  profesionales  y  perpetuando  el  problema  de  las
postulaciones irrelevantes.

## 56

## Pipeline
El  desarrollo  de  modelos  basados  en procesamiento  de lenguaje natural  (PLN)  exige  un
diseño metodológico estructurado, conocido como pipeline, que organiza la resolución de la tarea
en fases progresivas. Según Elov et al. (2023) la planificación y el procesamiento secuencial del
texto constituyen un punto de partida crítico en la creación de cualquier proyecto de PLN, ya que
evitan la propagación de errores al transformar el lenguaje no estructurado en datos computables.
Adaptando estos principios al contexto de la recomendación de prácticas preprofesionales,
el flujo de trabajo diseñado se estructura en seis etapas fundamentales:
- Selección de los datos.
- Preprocesamiento del texto crudo.
- Transformación a vectores densos.
- Entrenamiento del motor de inferencia.
- Evaluación de similitud.
- Despliegue en la plataforma web.
La interconexión de estas etapas se detalla visualmente en la Figura 3.


## 57

## Figura 3
Implementación del Pipeline de Preprocesamiento
Nota: flujo  de  trabajo  secuencial  implementado  para  el  procesamiento  de  lenguaje  natural  en  el  motor  de
emparejamiento. Elaboración propia basada en los esquemas metodológicos propuestos por Elov et al. (2023)

Técnicas de procesamiento de texto
La eficacia de cualquier modelo de similitud semántica depende en gran medida de la
calidad de los datos de entrada. Siino et al. (2024) comentan que a pesar del gran avance de los
modelos Transformers preentrenados, el preprocesamiento de texto sigue teniendo un impacto
significativo en el rendimiento de los modelos de clasificación en tareas de procesamiento de

## 58

lenguaje natural. Ya que en esta etapa un preprocesamiento deficiente puede llevar a resultados
subóptimos usando incluso arquitecturas modernas.
A continuación, se describen las técnicas de procesamiento de texto implementadas en el
sistema:
- Tokenización: Esta etapa es fundamental para el proceso de análisis textual. Varela-
Tapia et al. (2023) señalan que tokenizar significa fragmentar una frase en sus palabras
individuales. Como resultado de este recorte, el bloque de texto original deja de ser una
sola cadena y se transforma en un arreglo ordenado de elementos, estructurado como
[texto1, texto2, texto3].
## Ejemplo:
- Entrada: "Desarrollo de aplicaciones móviles"
- Salida: ["Desarrollo", "de", "aplicaciones", "móviles"]
- Stopwords: Una vez separado el texto, el siguiente paso es limpiar aquellas palabras
que usamos constantemente pero que no aportan un valor real al contenido, como es el
caso  de  los  artículos,  pronombres  o  preposiciones. Arengas  Acosta  et  al.  (2025)
mencionan  que  hacer  esta  limpieza  resulta  clave  para  quitarle  "ruido"  al  análisis
computacional.  Básicamente,  al  descartar  términos  que  se  repiten mucho, pero
informan  poco nos  aseguramos  de que  el  diccionario  de  datos  sea  más  pequeño
permitiendo que el sistema trabaje de una manera más ágil y eficiente.
## Ejemplo:
- Antes del filtro: ["El", "estudiante", "maneja", "la", "librería", "React"]
- Después del filtro: ["estudiante", "maneja", "librería", "React"]

## 59

- Lematización: Otra fase clave en la preparación del texto es la lematización. Lovera
& Cardinale (2023) detallan que este método busca agrupar las diferentes formas en las
que puede aparecer una palabra y reducirlas a su versión original o de diccionario
denominada lema, que, al eliminar las conjugaciones o inflexiones, el algoritmo deja
de  tratar  cada  variante  morfológica  como  si  fuera  un  dato  distinto,  simplificando
enormemente la estructura del vocabulario y agiliza las etapas posteriores del análisis
computacional.
## Ejemplo:
- Original: "Programando", "Programas", "Programó"
- Lema: "Programar"
Dentro del flujo de trabajo el procesamiento de texto es el paso que nivela el terreno antes
de hacer el emparejamiento. Al revisar cómo escriben los estudiantes frente a cómo publican las
empresas, notamos mucha diferencia en los términos. Unos usan un lenguaje más académico y
otros  uno  más  comercial. Al  aplicar  lematización  y  quitar  las  palabras  vacías  (stopwords),
obligamos  al  sistema  a  ignorar  cómo  está  conjugado  el  verbo  o  qué  artículos  se  usaron,
enfocándose solo en la habilidad técnica real. Esta limpieza hace que el motor de recomendación
trabaje más rápido para que genere la afinidad entre estudiante y empresa.
Técnicas de representación de texto
- Embeddings: Para lograr que un algoritmo logre interpretar el lenguaje humano, se
recurre a las representaciones vectoriales. De acuerdo con Szymański et al. (2024) esta
técnica permite superar las limitaciones de los análisis clásicos al otorgarle a cada
término una ubicación específica en un espacio matemático complejo. Gracias a esta

## 60

arquitectura dimensional, el sistema puede medir la distancia entre distintos puntos; así,
mientras más emparentados estén los significados de dos palabras en la vida real, mayor
será la proximidad numérica entre sus respectivos vectores.
## Ejemplo:
- Concepto: "Especialista en bases de datos"
- Representación vectorial: [0.213, -0.567, 0.890, ...]
- Sentence-BERT: A  diferencia  de  los  métodos  tradicionales  que  evalúan  términos
aislados,  Sentence-BERT  está  diseñado  para  analizar  oraciones  completas.  Según
Berdejo-Espinola et al. (2025) se trata de una adaptación del modelo original BERT
que incorpora redes siamesas para generar representaciones numéricas de alta calidad.
En lugar de procesar el texto palabra por palabra, esta herramienta logra comprender el
contexto global del mensaje. De este modo, captura el sentido profundo de las frases
(incluso en escenarios con múltiples idiomas) y traduce ideas complejas a un formato
matemático ideal para calcular similitudes semánticas.
## Ejemplo:
- Contexto A: "Estudiante con dominio en desarrollo de interfaces de usuario"
- Contexto B: "Se busca practicante para diseño de frontend"
- Resultado: El  modelo  determina  una  similitud  alta  (ej.  0.92)  debido  a  la
relación contextual de los términos.
Por último, decidimos implementar Sentence-BERT (SBERT) porque necesitábamos que
la plataforma entienda el contexto de toda la oración y no se limite a comparar palabras aisladas
ya  que  ese  es  un  fallo  de  los  modelos clásicos que  no  encuentran  relación cuando  no  hay
coincidencias exactas en el texto. Sin embargo, SBERT logra captar matemáticamente que si

## 61

alguien  sabe  'React' su  perfil  estará directamente  relacionado  con  una  vacante  de  'Desarrollo
## Frontend'.
Lograr que el sistema "comprenda" el texto de esta manera es lo que nos ayuda a resolver
el problema del arranque en frío, por lo que la aplicación podrá recomendar vacantes desde el día
uno, sin tener que esperar a que los usuarios generen un historial de clics o postulaciones.
Sistema de recomendación
## Definición
La  mayoría  de  los  algoritmos  tradicionales  se  dedican  a  sugerir  productos  u  objetos,
midiendo su eficacia únicamente en función de si al consumidor le agrada la opción. Palomares et
al. (2021) señalan que los sistemas de recomendación recíproca (RRS) cambian por completo esta
dinámica puesto que, en estos entornos, las recomendaciones no son objetos inanimados, sino otras
personas. Para que un emparejamiento se considere verdaderamente exitoso bajo este modelo, es
un requisito indispensable que ambas partes acepten la sugerencia mutua.
Este principio de aceptación mutua se refleja directamente en el flujo operativo del sistema
propuesto  ya  que,  en  primer  lugar,  el  estudiante  revisa  las  vacantes  recomendadas  según  su
porcentaje de afinidad y decide postularse. A continuación, la empresa accede desde su panel a las
postulaciones recibidas, visualiza el score de compatibilidad de cada candidato y determina si lo
acepta.
Una vez confirmada esa aceptación, el gestor de prácticas interviene desde su dashboard
para formalizar la vinculación entre ambas partes por lo que solo cuando las tres partes cumplen
su  rol  dentro  del  flujo  el  proceso  de  matching apoyado  por  el  sistema  de  recomendación se

## 62

considera  completado,  lo  que  posiciona  al  sistema  dentro  del  modelo  recíproco  definido  por
Palomares et al. (2021).
## Características
Para  garantizar  su  utilidad  práctica,  un  modelo  de  filtrado  debe  cumplir  con  ciertos
atributos fundamentales que aseguren su calidad técnica.
- Personalización orientada a la decisión: El propósito central del sistema es facilitar las
elecciones  de  las  personas. Chavarría-Báez  &  Ruiz-Ledesma  (2025) señalan  que  el
algoritmo logra este objetivo al examinar los datos históricos frente a los atributos del
catálogo, entregando así sugerencias hechas a la medida de cada individuo.
- Escalabilidad operativa: Consiste en la aptitud del modelo para sostener su rendimiento
ante exigencias crecientes. De acuerdo con Chavarría-Báez & Ruiz-Ledesma (2025) un
sistema escalable logra mantener tiempos de respuesta óptimos y no sacrifica su calidad
técnica, incluso si la plataforma experimenta un aumento masivo de usuarios o de volumen
de contenido.
- Adaptabilidad ante el inicio en frío (Cold Start): Es la capacidad del algoritmo para
sobreponerse a la falta de información inicial. Chavarría-Báez & Ruiz-Ledesma (2025)
destacan que esta característica resulta crítica para operar con éxito ante dos escenarios:
cuando un nuevo sujeto ingresa sin historial de navegación previo, o cuando se añaden
artículos recientes que aún carecen de interacciones en la base de datos.
Integrar estas características es una respuesta técnica directa a las deficiencias del proceso
actual en la Carrera de Software. En primer lugar, la personalización permite que el sistema analice

## 63

el perfil único de cada alumno, eliminando la asignación manual a ciegas para ubicarlo en una
vacante  que  realmente  requiera  sus  habilidades.  En  segundo  lugar,  el  modelo  asegura  la
escalabilidad  para  procesar  todas  las  solicitudes  del  semestre  simultáneamente  sin  colapsar
resolviendo  el  inicio  en  frío  al  generar  estas  recomendaciones  exactas  desde  el  primer  día,
analizando únicamente el texto del currículo sin necesidad de historiales previos.
Arquitectura y componentes de sistemas de recomendación
El diseño del motor de emparejamiento del sistema exige una arquitectura modular capaz
de procesar grandes volúmenes de texto de forma estructurada y dado que el sistema opera bajo
un esquema de recomendación recíproca, esta arquitectura no solo calcula la afinidad semántica
entre perfiles y vacantes, sino que también soporta el flujo de aceptación entre ambas partes. A
continuación, se describen los cuatro componentes lógicos que integran el sistema:
- Módulo de Captura de Datos: Constituye la capa inicial del sistema y se encarga de
adquirir la información. Según Vanetik & Kogan (2023), esta fase comprende la extracción
de datos desde bases externas y plataformas (como APIs de distribución de empleos) para
estructurar los textos de currículos y descripciones de vacantes en formatos procesables.
- Motor  de  Procesamiento  (Pipeline  NLP): Ejecuta  una  secuencia  de  técnicas  de
preprocesamiento,  como  la  conversión  a  minúsculas  y  la  eliminación  de  caracteres
numéricos. Posteriormente se aplica modelos de lenguaje como BERT para la extracción
de resúmenes y generación de embeddings contextuales a nivel de oración permitiendo
capturar  el  significado  semántico  profundo  de  las  habilidades  y  requisitos (Vanetik  y
## Kogan, 2023).

## 64

- Capa del Motor de Similitud: Representa el núcleo computacional donde se calculan las
medidas de afinidad. En esta capa se cuantifica la cercanía semántica entre los vectores de
habilidades  mediante  métricas  matemáticas  directas,  tales  como  la  distancia  L1  o  la
similitud del coseno, produciendo un puntaje final de compatibilidad (Khelkhal y Lanasri,
## 2025).
- Interfaz  de  Recomendación  (Visualización): Genera  una  lista  clasificada  de
recomendaciones ordenadas por su puntaje de similitud. Para generar confianza, incorpora
una capa de explicabilidad que enfatiza visualmente los factores determinantes del match,
tales como las palabras clave coincidentes y las habilidades superpuestas (Khelkhal &
Lanasri, 2025). Esta lista no representa el resultado final del proceso, sino el punto de
partida  para  que  la  empresa  evalúe  las  postulaciones  recibidas  y  decida  si  acepta  al
candidato, completando así el ciclo recíproco del modelo.
Para nuestro proyecto el implementar esta arquitectura estructurada resulta idóneo para la
Carrera de Software de la Universidad de Guayaquil.
Como  se  aprecia  en  la figura 4 al  separar  el  motor  de  NLP  de  la  interfaz  gráfica
garantizamos que el cálculo matemático no colapse el sistema cuando los usuarios interactúen
simultáneamente lo que se traduce para el estudiante como una plataforma donde las sugerencias
de  prácticas  están respaldadas  por  un  motor  lógico  que  prioriza  y  explica  sus  verdaderas
competencias, eliminando la ambigüedad del proceso manual.



## 65

## Figura 4
Arquitectura lógica y flujo de datos del motor de emparejamiento semántico.
Nota. Representación del flujo secuencial de la información, desde la captura de datos crudos hasta la generación de
recomendaciones. Elaboración propia basada en las arquitecturas propuestas por Vanetik y Kogan (2023) y Khelkhal
y Lanasri (2025).
Evaluación de los sistemas de recomendación
Para asegurar la eficacia del motor de del sistema de recomendación es necesario evaluar
matemáticamente atributos como la distancia o proximidad entre los perfiles de los estudiantes y
las ofertas empresariales. Debido a esto dentro del procesamiento de lenguaje natural existen
diversas métricas que cuantifican numéricamente ese grado de similitud.
A continuación, se detallan las tres principales evaluadas para este proyecto:
Coeficiente de Jaccard
El coeficiente de Jaccard compara conjuntos calculando la proporción de la intersección
sobre la unión de sus elementos, esto permite cuantificar la semejanza léxica exacta entre palabras,
frases o documentos (Núñez-Prado et al., 2024).
## Fórmula:
## 퐽
## (
## 퐴,퐵
## )
## =
## |
## 퐴∩퐵
## |
## |
## 퐴∪퐵
## |
## =
## |퐴∩퐵|
## |
## 퐴
## |
## +
## |
## 퐵
## |
## −
## |
## 퐴∩퐵
## |


## 66



## Distancia Euclidiana
Esta métrica mide la separación geométrica entre vectores en un espacio multidimensional.
Se calcula mediante la raíz cuadrada de la suma de las diferencias al cuadrado de sus componentes,
sirviendo como un indicador clásico de disimilitud matemática en las representaciones de texto.
(Núñez-Prado et al., 2024).
## Fórmula:
## 푑
## (
## 푦
## )
## =
## √∑
## (
## 푦
## 푖1
## −푦
## 푖2
## )
## 2
## 푛
## 푖=1

Similitud del Coseno
A  diferencia  de  las  métricas  anteriores,  esta  técnica  evalúa  la  similitud  examinando
directamente el ángulo entre dos vectores en el espacio vectorial. Cuando los vectores forman un
ángulo cercano a 0 grados, se indica una alta similitud semántica, lo cual es ideal en el filtrado de
currículos y ofertas de empleo (Vicent Caravaca Rostoll, 2024).
## Fórmula:
## 푐표푠
## (
## 휃
## )
## =
## 퐴⋅퐵
## ‖
## 퐴
## ‖‖
## 퐵
## ‖
## =
## ∑
## 퐴
## 푖
## 푁
## 푖=1
## 퐵
## 푖
## √
## ∑
## 퐴
## 푖
## 2
## 푁
## 푖=1

## √
## ∑
## 퐵
## 푖
## 2
## 푁
## 푖=1


## 67

La elección de la similitud del Coseno como eje central de la evaluación responde a una
necesidad de justicia algorítmica. Como se detalla en la Tabla 3 se evidenció que métricas léxicas
como  Jaccard  fallaban  al  no  relacionar  tecnologías  equivalentes,  mientras  que  la  Distancia
Euclidiana generaba sesgos por la cantidad de palabras ingresadas. Implementar el Coseno permite
que la postulación del estudiante sea evaluada por el fondo de sus conocimientos y no por la
extensión de su redacción.
## Tabla 3
Comparativa técnica de métricas de similitud en sistemas de recomendación.
## Métrica Principio
## Matemático
## Ventaja Principal Desventaja Crítica
en Reclutamiento
Coeficiente de
## Jaccard
Intersección de
## Conjuntos
Eficiente para
listas de etiquetas
simples o datos
binarios.
Ignora   el   contexto
semántico y no
detecta sinónimos
(ej: 'React' vs 'JS') ni
relaciones
conceptuales.
## Distancia
## Euclidiana
## Distancia Lineal
Recta (L_2)

Intuitiva y fácil de
calcular en
espacios de baja
dimensión.
Muy sensible   a   la
longitud del
documento, penaliza
textos cortos
(estudiantes)   frente
a largos (empresas).

Similitud del
## Coseno
Ángulo entre
## Vectores
Agnóstico a la
longitud. Se enfoca
en la orientación
semántica.
A nivel
computacional es
más costosa    que
Jaccard,   pero   más
precisa   para   textos
descriptivos.
Nota. Comparativa general de los algoritmos de similitud más utilizados en el procesamiento de lenguaje natural.
Elaboración propia.


## 68

## Aplicación Web
## Definición
Una plataforma web se define como un conjunto de tecnologías, herramientas y servicios
que permiten la creación, gestión y funcionamiento de aplicaciones y servicios a través de internet;
en  otros  términos,  es  un  entorno  en  línea  donde  los  usuarios  pueden acceder  y  utilizar  diversas
funcionalidades, contenidos o servicios a través de un navegador web, sin depender de un sistema
operativo específico (Villacreses Chong, 2024).
Se  entiende  por  aplicación  web  a  aquella  solución  de  software  que  trasciende  la  simple
publicación de contenidos estáticos para integrar una lógica de negocio dinámica y una gestión de
datos centralizada. A diferencia del software de escritorio, su arquitectura delega el procesamiento
pesado y la seguridad de la información a servidores remotos, permitiendo que la interacción del
usuario  ocurra  de  manera  ubicua  a  través  de  un  navegador  estándar,  independientemente  del
hardware utilizado (Márquez Coca et al., 2023).
En  base  a  las  definiciones  presentadas,  se  puede  establecer  que  las  plataformas  web
constituyen una solución tecnológica que elimina las barreras de acceso tradicionales al no requerir
de  una instalación  local,  permitiendo  a  los  usuarios  interactuar  con  el  sistema  desde  cualquier
ubicación  geográfica.  Esta  característica  resulta  especialmente  relevante  en  el  contexto  del
presente proyecto, donde tanto estudiantes como empresas necesitan acceder a la plataforma desde
diferentes dispositivos y ubicaciones para el proceso de prácticas preprofesionales.


## 69

Características de las aplicaciones web
Según Márquez Coca et al. (2023) el desarrollo web moderno se distingue por una serie de
ventajas   operativas   frente   al   software   tradicional   de   escritorio,   destacando   cuatro   pilares
fundamentales:
- Ubicuidad  y  Accesibilidad:  La  naturaleza  distribuida  de  la  web  permite  que  el  software
esté  disponible  24/7  desde  cualquier  ubicación  geográfica,  requiriendo  únicamente  un
navegador y conexión a internet.
- Centralización del Mantenimiento: Al residir la lógica en el servidor, las actualizaciones y
correcciones  de  errores  se  despliegan  instantáneamente  para  todos  los  usuarios  sin
necesidad de intervenir en sus equipos.
- Escalabilidad: Estas plataformas pueden adaptarse al crecimiento de la demanda (aumento
de tráfico o datos) mediante la asignación dinámica de recursos en el servidor.
- Independencia  de  la  Plataforma  (Reducción  de  costos):  Al  ser  agnósticas  al  sistema
operativo  del  cliente  (Windows,  Linux,  macOS,  Android),  eliminan  la  necesidad  de
desarrollar  múltiples  versiones  nativas,  reduciendo  significativamente  los  costos  de
desarrollo y soporte.
Estas  características  validan  a  la  aplicación  web  como  la  alternativa  tecnológica  idónea
para  el  sistema  propuesto.  La  accesibilidad  universal  garantizará  que  tanto  estudiantes  como
empresas puedan interactuar con el sistema de recomendación sin barreras de hardware, mientras
que el mantenimiento centralizado facilitará la gestión ágil de perfiles y vacantes, asegurando que
la información crítica esté siempre sincronizada y actualizada para todos los actores involucrados.

## 70

Arquitectura Cliente-Servidor
La  arquitectura  cliente-servidor  tradicional  constituye  la  base  de  las  aplicaciones  web
modernas.  Según  Llamuca-Quinaloa,  Vera-Vincent  y  Tapia-Cerda.  (2021)  en  este  modelo
arquitectónico  el  sistema  se  divide  estrictamente  en  dos  roles:  el  cliente,  que  opera  desde  el
navegador web y realiza peticiones de recursos, y el servidor, que centraliza el procesamiento y la
lógica de negocio. Esta separación permite que el servidor gestione la carga computacional pesada
y la seguridad de los datos, enviando al cliente únicamente la información necesaria (generalmente
en formato HTML o JSON) para su visualización.
La adopción de esta arquitectura es indispensable para la plataforma propuesta ya que de
la  misma  manera  como se  describe  en  el  estudio  de  Llamuca-Quinaloa et  al., (2021) el  sistema
requiere del  desacoplamiento  del  Frontend y  del  Backend  para  optimizar  el  rendimiento.  Esta
separación garantiza que el servidor pueda dedicar sus recursos a la ejecución de los algoritmos de
Inteligencia Artificial sin verse ralentizado por la gestión de la interfaz gráfica, asegurando así que
los  estudiantes  reciban  recomendaciones  de  vacantes  en  tiempo  real  sin  latencia  perceptible
observándose en la Figura 5.
## Figura 5
Arquitectura Cliente-Servidor propuesta para el sistema de recomendación web
Nota. El  esquema  ilustra  la  separación  de  responsabilidades  en  el  sistema.  El  Cliente  Web  (Frontend)  gestiona  la
interfaz y solicita datos vía HTTP, mientras que el Servidor de Aplicaciones (Backend) centraliza la lógica de negocio
y los algoritmos NLP, siendo el único punto de acceso seguro a la Base de Datos PostgreSQL. Fuente: Elaboración
propia.


## 71

Modelo de aplicación web (SPA)
La arquitectura de Página Única (SPA) es un modelo de desarrollo web donde la aplicación
carga  un  único  documento  HTML  al  inicio  y  actualiza  dinámicamente  el  contenido  mediante
JavaScript, eliminando la necesidad de recargas completas de página. Según Phan Khoi (2024), a
diferencia de las Aplicaciones de Múltiples Páginas (MPA) tradicionales que solicitan al servidor
un nuevo código HTML por cada interacción del usuario, las SPA operan solicitando únicamente
los  datos  necesarios  (usualmente  en  formato  JSON) y  renderizándolos  en  el  navegador.  Esta
técnica  reduce  drásticamente  la  latencia  y  el  consumo  de  ancho  de  banda,  permitiendo  una
navegación fluida similar a la de una aplicación de escritorio nativa, lo cual es crítico en sistemas
modernos que requieren alta interactividad.
Para  este  proyecto  de  sistema  de  recomendación  se  adopta  el  modelo  SPA  utilizando
React.js debido a su capacidad para desacoplar la interfaz de usuario del procesamiento lógico del
servidor.  Al  integrar  módulos  de  Inteligencia  Artificial  (NLP)  en  el  backend,  es  vital  que  el
frontend no se bloquee mientras se procesan los algoritmos de similitud; tal como se fundamenta
en la Tabla 4, la arquitectura SPA permite que el usuario siga interactuando con la plataforma de
forma  asíncrona,  evitando  el  "parpadeo"  de recarga  y  garantizando  que  la  visualización  de  las
vacantes  recomendadas  sea  instantánea  en  cuanto  el  motor  de  IA  devuelve  los  resultados
vectorizados.


## 72

## Tabla 4
Diferencias Estructurales Clave: SPA vs. MPA
Aspecto Diferencial Single Page Application (SPA) Multi Page Application (MPA)
Experiencia de Navegación Fluida: Actualiza el contenido
dinámicamente sin recargar la
página (cero parpadeos).
Interrumpida: Recarga la
página completa y sus recursos
en cada clic del usuario.
Intercambio de Datos Eficiente (JSON): Consume solo
datos puros desde la API, ideal
para respuestas de IA.
Redundante (HTML): El
servidor reenvía la estructura
visual completa
constantemente.
Arquitectura de Software Desacoplada: Frontend y Backend
funcionan independientemente
(cliente-servidor puro).
Acoplada: La lógica del
servidor y la interfaz visual son
interdependientes.
Nota. Elaboración propia basada en la comparativa de rendimiento de Phan Khoi (2024).
Herramientas de desarrollo
La   selección   de   herramientas   y   tecnologías   para   el   desarrollo   de   un   sistema   de
recomendación web implica no solo elegir librerías y servicios populares, sino fundamentar esas
elecciones  en  criterios  técnicos  replicables:  rendimiento  (latencia,  throughput), mantenibilidad
(modularidad,   pruebas),   escalabilidad   (horizontal/vertical),   disponibilidad   de   ecosistema
(paquetes, soporte) y compatibilidad con los requisitos no funcionales del proyecto (privacidad,
despliegue,  acceso  concurrente).  En  proyectos  que  integran  modelos  de  Procesamiento  de
Lenguaje  Natural  y  cálculos  de  similitud  semántica,  la  tecnología  debe  además  facilitar  el
procesamiento  vectorial  y  el  tratamiento  eficiente  de  textos  no  estructurados  en  producción
(Gabriel Amaya, 2021).



## 73

## Tecnologías Frontend - React
Es  una  biblioteca  de  código  abierto  basada  en  JavaScript,  desarrollada  y  mantenida  por
Meta que  se  ha  consolidado  como  el  estándar para  la  construcción  de  interfaces  de  usuario
dinámicas poseyendo una  arquitectura  que  fomenta el  flujo  de  datos  unidireccional o One-Way
Data Binding. De acuerdo con el análisis de Paucar Mayanquer (2023) la innovación disruptiva de
React radica en su implementación del virtual DOM (modelo de objetos del documento virtual),
una representación ligera y en memoria de la estructura del documento HTML.
Es  por  esto  por  lo  que  a diferencia  de  la  manipulación  tradicional  del  DOM  que  es
computacionalmente costosa y  lenta  debido  a  los  repintados  constantes  del  navegador,  React
emplea  un  algoritmo  de  reconciliación  (Diffing  Algorithm)  que  compara  el  estado  anterior  y  el
nuevo del virtual DOM para calcular la diferencia mínima necesaria y aplicar solo esos cambios
específicos al DOM real.
La elección de React para este proyecto es estratégica y técnica puesto que el sistema web
requiere de interfaces complejas con múltiples filtros dinámicos que deben actualizarse en tiempo
real sin la necesidad de recargar la página. Debido a esto React ofrece el rendimiento necesario
para mantener la fluidez con componentes reutilizables permitiendo la aceleración en el desarrollo
con elementos como las "tarjetas de vacante" o los "formularios de perfil" se programaron una sola
vez y se instanciaron en múltiples vistas, garantizando consistencia visual y reduciendo la deuda
técnica, una eficiencia que respalda su liderazgo en la industria tal como se ve reflejada en la Figura
6 y Figura 7.


## 74

## Figura 6

Análisis comparativo Global: React vs Angular vs Vue

Nota. La gráfica evidencia la hegemonía de React (línea azul) sobre sus competidores, validando su elección por
soporte y comunidad. Fuente: Google Trends (2025).
## Figura 7
Análisis comparativo Ecuador: React vs Angular vs Vue

Nota. El uso de React en Ecuador muestra picos de interés superiores, lo que garantiza la disponibilidad de talento
técnico. Fuente: Google Trends (2025).


## 75

Para la selección del framework de desarrollo frontend se realizó un análisis comparativo
entre las tres opciones de mayor uso en la industria, tal como se evidencia en la Tabla 5.
## Tabla 5
Comparativa técnica de frameworks Frontend: React vs Angular vs VueEs
## Aspecto React Angular Vue
Tipo Biblioteca UI basada en
componentes reutilizables.
Framework MVC
completo y
opinionado
## Framework
progresivo basado en
componentes.
Consumo de APIs
asíncronas
Óptimo, actualiza UI sin
recargar mientras el
backend NLP procesa.
Funcional, mayor
boilerplate en
peticiones HTTP.
Funcional, buena
integración con APIs
## REST
## Renderizado
dinámico de
resultados
Alto, Virtual DOM
actualiza solo los
componentes afectados
Alto, pero con
mayor overhead
Alto, Virtual DOM
optimizado
Nota. Elaboración propia basada en Google Trends (2025) y Phan Khoi (2024).

Tecnologias backend - Python
Python se define como un lenguaje de programación de alto nivel que se ha posicionado
como  el  "núcleo  tecnológico"  indiscutible  para  la  innovación  empresarial  y  científica  moderna.
Según  una  investigación  reciente  presentada  en  Medina  Condori  et  al.  (2024)  su  arquitectura
robusta y versátil facilita la integración de múltiples funcionalidades críticas, desde la gestión de
bases de datos hasta la automatización de tareas complejas.
Su  dominio  en  el  mercado  se  debe  a  su  capacidad  para  simplificar  el  desarrollo  de
algoritmos lógicos mediante bibliotecas especializadas, permitiendo a los ingenieros centrarse en
la resolución del problema de negocio más que en la sintaxis del código.
Este  lenguaje  también cuenta  micro  frameworks  como  Flask  que  a  diferencia  de  las
arquitecturas  monolíticas  no  impone  dependencias  rígidas  ni  herramientas  predefinidas.  Pinto

## 76

Demera & Morejón López (2025) mencionan que python dispone de un diseño minimalista que
permite  a  los  desarrolladores  construir  aplicaciones  web  escalables  integrando  únicamente  las
librerías necesarias para el proyecto.
Esta característica es crítica para el desarrollo ágil del sistema de recomendación ya que
facilita la creación de APIs y microservicios sin la sobrecarga de código que generan frameworks
más pesados como Django, optimizando así el rendimiento en el intercambio de datos.
El NLP es el campo de la Inteligencia Artificial que permite a las máquinas interpretar el
lenguaje  humano.  Según  una  revisión  sistemática  de  Delso  Vicente  et  al.  (2024),  Python  es  el
lenguaje estándar para esta disciplina debido a su ecosistema de librerías avanzadas que permiten
analizar  grandes  volúmenes  de  texto  en  tiempo  real  facilitando  la  tokenización,  el  análisis
semántico y la vectorización de documentos, procesos esenciales para transformar descripciones
textuales como perfiles profesionales en datos numéricos comparables.
La arquitectura del sistema de un sistema de recomendación requiere de un backend capaz
de procesar operaciones matemáticas complejas sin sacrificar el rendimiento web es por esta razón
que se ha seleccionado Python como el núcleo del sistema ya que es la única tecnología que ofrece
soporte  nativo  para  las  librerías  de  NLP  necesarias  para  calcular  la  similitud  semántica  entre
vacantes y estudiantes.
Para  plasmar  nuestra  solución  utilizamos  Flask  ya  que  su  ligereza  permite  procesar  las
peticiones de recomendación con menor latencia que un framework monolítico. Esta elección no
solo  es  técnica,  sino  estratégica:  su  popularidad  en  la  comunidad  de  desarrollo  demuestra  su
utilidad y adaptabilidad y se ve reflejada en la Figura 8 y Figura 9, donde se confirma que Python

## 77

lidera  las  tendencias  de  búsqueda  tanto  a  nivel  global  como  en  Ecuador  garantizando  que  el
proyecto se construye sobre una tecnología sostenible y en constante evolución.
## Figura 8
Análisis comparativo Global: Python vs PHP vs Java (2024-2025)

Nota: La gráfica mundial ratifica el dominio de Python, impulsado por el auge de la IA, superando ampliamente a
lenguajes tradicionales. Fuente: Google Trends (2025).


## Figura 9
Análisis comparativo Ecuador: Python vs PHP vs Java (2024-2025)


Nota: A nivel nacional, la tendencia muestra un interés creciente y sostenido por Python, validando su pertinencia
en el mercado laboral ecuatoriano. Fuente: Google Trends (2025).


## 78

Para  la  selección  de Python  como lenguaje  backend  se  evaluaron  las  tres  tecnologías  de
mayor  relevancia  en  el  mercado,  priorizando  el  soporte  nativo  para  procesamiento  de  lenguaje
natural, como se detalla en la Tabla 6.
## Tabla 6
Comparativa técnica de lenguajes Backend: Python vs PHP vs Java
Aspecto Python PHP Java
Soporte nativo
para NLP
Sí, spaCy, NLTK, sentence-
transformers, SBERT
No, sin librerías
NLP consolidadas
## Limitado,
bibliotecas poco
mantenidas
## Procesamiento
vectorial
Alto, NumPy y SciPy
optimizados para
operaciones matriciales
No orientado a
cálculo matricial
Alto, sin ventaja
específica en NLP
Integración con
modelos de IA
Nativa, HuggingFace,
scikit-learn, TensorFlow
No dispone de
alternativas
equivalentes
Indirecta, requiere
wrappers
adicionales
Nota. Elaboración propia basada en Delso Vicente et al. (2024) y Medina Condori et al. (2024).

Base de datos PostgreSQL
PostgreSQL  se  ha  establecido  como  el  estándar  de  referencia  en  sistemas  de  gestión  de
bases  de  datos  relacionales  debido  a  su  capacidad  para  manejar  cargas  de  trabajo  concurrentes
complejas.  Según  el  estudio  de  Salunke  &  Ouda (2024)  publicado  en  la  revista Future  Internet,
PostgreSQL demuestra un rendimiento superior en operaciones de selección en comparación con
MySQL, siendo hasta nueve veces más eficiente en escenarios de alta latencia.
Esta  arquitectura  garantiza  que  la  plataforma  pueda  escalar  verticalmente,  procesando
miles de peticiones por segundo generando las recomendaciones sin comprometer la estabilidad
del sistema, un requisito indispensable para la naturaleza transaccional del proyecto.

## 79

PostgreSQL  ha  evolucionado  hacia  un  motor  híbrido  que  combina  el  modelo  relacional
tradicional con soporte avanzado para datos semiestructurados como los almacenados en formato
JSONB lo cual le permite gestionar documentos complejos dentro de un esquema relacional sin
renunciar a las garantías ACID (Atomicidad, Consistencia, Aislamiento y Durabilidad).
El uso de PostgreSQL como estrategia para la gestión de los datos y almacenamiento de
información semántica se ve respaldado en la realidad del mercado tecnológico evidenciándose en
la Figura 10 y Figura 11. PostgreSQL mantiene una hegemonía técnica sobre alternativas como
MySQL y MongoDB garantizando no solo un buen rendimiento, sino también la escalabilidad y
soporte a largo plazo del proyecto en el entorno ecuatoriano y global.
## Figura 10
Análisis comparativo Global: PostgreSQL vs MySQL vs MongoDB (2024-2025)

Nota: El gráfico mundial evidencia cómo PostgreSQL ha superado a sus competidores en interés técnico, gracias a
su capacidad de unificar SQL y NoSQL. Fuente: Google Trends (2025).


## 80

## Figura 11
Análisis comparativo Ecuador: PostgreSQL vs MySQL vs MongoDB (2024-2025)

Nota: En Ecuador, la tendencia confirma la preferencia por PostgreSQL en proyectos de ingeniería de software,
garantizando disponibilidad de soporte local. Fuente: Google Trends (2025).


Para la selección del gestor de base de datos PostgreSQL se compararon las tres alternativas
relacionales más utilizadas en proyectos de software, como se muestra en la Tabla 7.
## Tabla 7
Comparativa técnica de lenguajes Backend: Python vs PHP vs Java
## Aspecto
PostgreSQL ✓
MySQL SQL Server
Rendimiento en
concurrencia
MVCC, sin bloqueos
de lectura en alta
demanda
Bloqueos de tabla en
operaciones masivas
Bueno, pero
requiere licencia
comercial
Soporte para datos
semiestructurados
JSONB nativo dentro
del modelo relacional
JSON sin índice
nativo eficiente
Parcial, soporte
JSON limitado
Costo Gratuito y open-source Gratuito y open-
source
Licencia comercial
requerida
Nota. Elaboración propia basada en Salunke & Ouda (2024).



## 81

Preguntas científicas a contestarse
¿La implementación de un sistema de recomendación basado en técnicas de NLP y modelos
de  similitud  semántica,  permitirá  la  optimización  de  los  tiempos  de  búsqueda  y  selección  en  el
proceso  de  prácticas  preprofesionales  de  la  Carrera  de  Software,  asegurando  una  mayor
compatibilidad entre los perfiles de los estudiantes y los requerimientos de las empresas?
¿La implementación de un sistema de recomendación para prácticas preprofesionales en la
Carrera  de  Software,  basado en  técnicas  de  NLP  y  modelos  de  similitud  semántica permitirá
aumentar  la compatibilidad  entre  los  perfiles  de  los  estudiantes  y  los  requerimientos  de  las
empresas?
Definiciones conceptuales
Aplicación  web: Se  trata  de  un  sistema  informático  al  que  los  usuarios  pueden  acceder
mediante el uso de un navegador web, evitando la necesidad de instalarlo de forma local en móvil
o  desktop.  La  aplicación  está  compuesta  por  un  conjunto  de  tecnologías  y  herramientas  que
permiten este funcionamiento en línea (Villacreses Chong, 2024).
Backend: Es conocido técnicamente como desarrollo del lado del servidor contemplando
la estructura lógica y funcional que va a operar en segundo plano permaneciendo invisible para el
usuario final, pero siendo indispensable para la operatividad del frontend del sistema. Se define al
backend como la parte responsable de la administración de la base de datos, el procesamiento de
las peticiones del cliente mediante  APIs y la ejecución de la lógica de negocio que garantiza la
seguridad, integridad y persistencia de la información en el aplicativo (Celí Párraga et al., 2023).
Frontend: Se define como la parte visual y funcional de una aplicación web, es decir la
parte con la que el usuario interactuará directamente, por lo que también se denomina desarrollo

## 82

del lado del cliente.  A diferencia de los procesos ocultos del servidor, el frontend se encarga de la
presentación de contenidos, la estructura de la interfaz gráfica y la captura de eventos en tiempo
real utilizando lenguajes estándar como HTML, CSS y JavaScript garantizando la responsividad
en distintos dispositivos y navegadores (Celí Párraga et al., 2023).
Inteligencia artificial: De acuerdo con Latorre et al. (2024) se trata de un amplio campo
de  estudio  que  integra  la  computación  y  la  ciencia  de  datos  para  brindarles  a  las  maquinas  la
capacidad  de  realizar  actividades  que  requerirían  de  la  inteligencia  humana. En  otras  palabras,
consiste en el desarrollo de una inteligencia propia para los computadores permitiéndoles obtener
capacidades de comprensión, aprendizaje y razonamiento.
Matching bidireccional: Se define como un sistema reciproco en el cual se satisfacen las
preferencias de ambos lados de la relación, siendo la contraparte de los sistema tradicionales que
evalúan las preferencias de una sola dirección (Yang et al., 2024).
Matching  learning: Se  trata  de  una  rama  de  la inteligencia  artificial enfocada  en  el
aprendizaje de los maquinas mediante el uso de algoritmos que se alimentan de datos. Dicho de
otra manera, tienen como objetivo emular en los sistemas la forma de aprender de los humanos a
través del uso de algoritmos que mejoran en cada iteración (Latorre et al., 2024).
NLP: El procesamiento de lenguaje natural es una de las ramas de la inteligencia artificial
y el maching learning, la cual permite a los sistemas computacionales procesar, entender y generar
información   en   lenguaje   humano   mediante   la   aplicación   de   técnicas   avanzadas   como
transformación, vectorización y normalización de palabras. Siendo estos aspectos útiles para los
modelos  de  clasificación,  análisis  semántico  y  extracción  de  información  aplicable  a  múltiples
dominios. (Gardazi, Daud et al., 2025)

## 83

Prácticas  preprofesionales: Son  un  componente  de  formación  obligatorio  para  los
estudiantes  universitarios  ofreciéndoles  la  oportunidad  de  explorar  y  aprender  de  su  futura  área
laboral  mediante  actividades  designadas.  Además  de  esto,  las  prácticas  son  un  medio  para  el
desarrollo de competencias y habilidades requeridas en el ejercicio profesional (Carranza Guevara
et al., 2025).
Similitud semántica: Es una métrica de medida que determina la relación o similitud entre
el significado de dos términos y no solamente realizando la comparación en base a su escritura.
Núñez Torres y Pérez Cabello de Alba (2024) nos mencionan que los criterios para realizar esta
comparación son los atributos propios que comparte cada termino tal y como el ejemplo de una
bicicleta y un auto que se asocian a un medio de transporte.
Sistema de recomendación: Es un conjunto de algoritmos de aprendizaje que tienen como
propósito  la  generación  de  recomendaciones  automáticas  en  base  al  interés  del  usuario.  Estos
también  se  definen  como  técnicas  de  filtrado  que  asisten  al  usuario  en  la  toma  de  decisiones  al
sintetizar toda la información en información relevante (Bron Fonseca y Mar Cornelio, 2022).







## 31

## CAPÍTULO III
## PROPUESTA TECNOLÓGICA
El porcentaje de compatibilidad entre un practicante y sus labores de prácticas es esencial
para una adecuada formación profesional ya que además de adquirir experiencia esto le permite
desarrollar sus habilidades y mostrar su potencial a la empresa aumentando sus probabilidades de
inserción laboral en la misma empresa que realiza sus prácticas.
En base a esto y como se ha detallado en los capítulos I y II, el presente proyecto consiste
en el desarrollo de un sistema de recomendación web para el proceso de postulación de prácticas
preprofesionales en la Carrera de Software de la Universidad de Guayaquil mediante la aplicación
de  técnicas  de  IA  como  el  procesamiento  de  lenguaje  natural  y  los  modelos  de  aprendizaje
automático  teniendo como objetivo la optimización del proceso de búsqueda y postulación a través
de  recomendaciones  personalizadas que  permiten  la  reducción  de los tiempos  de  búsqueda  y el
aumento del nivel de afinidad entre los practicantes y sus actividades.
En el presente capitulo III evaluamos la viabilidad de nuestra propuesta tecnológica sobre
el  sistema  de  recomendación de  prácticas  preprofesionales mediante  un  análisis  de  factibilidad,
describiendo a su vez las metodologías aplicadas durante el desarrollo del proyecto.
Análisis de factibilidad
En esta sección justificamos nuestra propuesta tecnológica sobre el sistema de
recomendación de prácticas preprofesionales para la Carrera de Software desde un punto de vista
analítico mediante el análisis de factibilidad a nivel operacional, tecnológico, legal y económico
con el objetivo de fundamentar la viabilidad del proyecto frente a los procesos actuales de
búsqueda y asignación de prácticas.

## 32

Factibilidad operacional
El proyecto está dirigido a la sistematización del proceso actual de búsqueda y vinculación
de prácticas preprofesionales que atraviesan los estudiantes de la Carrera de Software de la
Universidad de Guayaquil mediante un sistema de recomendación web que elimine el problema
de desorientación inicial y contando con el respaldo del gestor de la Carrera mediante una carta de
autorización evidenciada en el anexo 3 y su participación con reuniones de seguimiento.
Respecto a los actores del sistema tendremos a los estudiantes que son los más interesados
en un sistema que les presente vacantes recomendadas a sus perfiles, a las empresas que podrán
publicar las vacantes, al gestor de prácticas que podrá obtener las vinculaciones y generar listados
de correspondencia entre estudiantes y empresas según sus niveles de compatibilidad y al
administrador que se encargará de la gestión de los usuarios.
El proceso actual de búsqueda y solicitud de prácticas se evidencia con el diagrama de flujo
de la figura 12 y 13, en comparación del flujo mejorado definido en la figura 14 y 15.


## 33

## Figura 12
Diagrama de flujo: Proceso actual de asignación de prácticas preprofesionales


Nota: El flujo representa el caso de una solicitud pasiva por parte del estudiante que espera a ser asignado y la
gestión recae sobre el gestor de prácticas. Elaborado por: Anchundia Naldo y Galarza Bryan

## Figura 13
Diagrama de flujo: Proceso actual de búsqueda autónoma de prácticas preprofesionales


Nota: En este flujo el actor principal es el estudiante que realiza una búsqueda autónoma en beneficio de su
aprendizaje y el gestor es quien recibe los datos finales para realizar el registro formal en el sistema. Elaborado por:
Anchundia Naldo y Galarza Bryan

## 34

## Figura 14
Diagrama de flujo: Proceso mejorado para asignación de prácticas

Nota: En este nuevo flujo se estandariza el proceso de asignación evitando que el gestor deba contactar a cada
empresa consultando información sobre vacantes ya que las tendrá a la mano en todo momento. Además, el sistema
de recomendación actúa como apoyo para la toma de decisiones del gestor generando un listado match entre
estudiantes y empresas según su nivel de afinidad, aunque la decisión final sigue siendo parte del gestor. Elaborado
por: Anchundia Naldo y Galarza Bryan



## 35

## Figura 15
Diagrama de flujo: Proceso mejorado de búsqueda autónoma de prácticas preprofesionales

Nota: A comparación del flujo actual, en el flujo mejorado el estudiante tendrá centralizada toda la información de
vacantes e internamente el sistema trabajará para la generación de recomendaciones en base a sus habilidades y
conocimientos evitando el contacto desorganizado por mensajes a empresas y brindando toda la información
requerida al gestor. Elaborado por: Anchundia Naldo y Galarza Bryan




## 36


Factibilidad técnica
En el desarrollo del sistema de recomendación web para la optimización de prácticas
preprofesionales en la Carrera de Software se determinó el uso de recursos tecnológicos idóneos
para garantizar el rendimiento del prototipo. Respecto a la infraestructura física el proyecto resulta
factible al requerir únicamente equipos de cómputo locales con la capacidad de procesamiento
suficiente para soportar el entrenamiento de los modelos semánticos asegurando la disponibilidad
del entorno de pruebas sin incurrir en gastos de servidores externos cumpliendo con el alcance
establecido de validar el motor de emparejamiento utilizando datos simulados.
Por la parte lógica se optó por tecnologías modernas de código abierto que facilitan la
construcción de una arquitectura cliente-servidor eficiente. El backend se programará con Python
junto al micro framework Flask para ejecutar nativamente los algoritmos de Procesamiento de
Lenguaje Natural mediante Sentence-BERT, mientras que el frontend utilizará la librería React.js
para ofrecer una interfaz fluida y la gestión de la información operará sobre la base de datos
PostgreSQL, consolidando una alternativa viable que cumple con todos los requerimientos
funcionales del sistema de recomendación.
A continuación, en la Tabla 8 se presentan de manera detallada las herramientas de
hardware utilizadas para el entorno local.


## 37

## Tabla 8

Herramientas de hardware utilizadas en el presente proyecto de titulación
## Hardware Características
Laptop 1 Intel(R) Core  (TM)  i5-1135G7 2.40GHz
(2.42 GHz) 16 GB de RAM SSD 466 GB
Laptop 2 Intel(R) Core (TM) i5-10210U
@1.60GHz (2.11 GHz) 32 GB de RAM
## SSD 466 GB
Nota: En  esta  tabla  se  muestran  las  herramientas  hardware  empleadas  para  el  desarrollo  y
validación  en   entorno   local  del  prototipo  web  destinado  al   emparejamiento  de  prácticas
preprofesionales. Elaborado por: Anchundia Naldo, Galarza Bryan.

En la Tabla 9 se detallan las herramientas de software que se utilizaron.
## Tabla 9
Herramientas de software utilizadas en el presente proyecto de titulación
## Tecnología Versión
Framework frontend React.js
Framework backend Python, Flask
Base de datos PostgreSQL
Modelo PLN Python
Sistema operativo Windows 11 pro
Entorno de desarrollo Visual Studio Code
## Hosting Localhost
Nota: En esta tabla se muestran los diferentes softwares de código abierto utilizados para la
elaboración del sistema de recomendación web de la Carrera de Software. Elaborado por:
## Anchundia Naldo, Galarza Bryan.

Factibilidad legal
Se revisaron las normativas referentes a la Constitución de la República, la Ley Orgánica
de Educación Superior, el Código Orgánico de la Economía Social de los Conocimientos y la Ley
Orgánica de Protección de Datos Personales para verificar que la propuesta no infringe ninguna
disposición legal, por lo que se puede concluir que el presente proyecto se encuentra alineado al
marco normativo vigente en Ecuador.

## 38

El Art. 87 de la LOES respalda directamente la relevancia del proyecto al establecer las
prácticas preprofesionales como requisito previo a la titulación, mientras que los Arts. 104 y 131
del INGENIOS protegen el software desarrollado como obra literaria dentro del marco
institucional educativo.
Al revisar estas normativas se puede verificar que la propuesta tecnológica no vulnera
ninguna ley vigente, además en lo que respecta a la privacidad el sistema operará con datos
simulados durante su fase de validación tal y como se estableció en el alcance del proyecto, lo que
garantiza el cumplimiento de la Ley Orgánica de Protección de Datos Personales sin comprometer
información real de estudiantes o empresas.
El detalle completo de los artículos jurídicos aplicables se encuentra en el Anexo 4 y los
criterios éticos del estudio en el Anexo 5.
Factibilidad económica
En el análisis de la factibilidad económica se determinó la inversión necesaria para el
desarrollo de este sistema verificando así los beneficios institucionales justificando gastos
realizados. En este proyecto la inversión financiera fue mínima dado a que se utilizan herramientas
de código abierto como Python y React que no requieren pagos por licencia reduciendo
significativamente los costos ya que el mayor aporte económico se concentra en el tiempo dedicado
por el equipo de desarrollo para el desarrollo del sistema de recomendación.
A continuación, los costos se presentan de forma detallada desglosando los valores de
recursos humanos, hardware y software.
En la Tabla 10 se detallan los costos correspondientes a los recursos humanos, los cuales
reflejan el esfuerzo y tiempo invertido en la investigación y programación del modelo.


## 39


## Tabla 10
Costos por recurso humano en el proyecto
## Cargo Costo Cantidad Total
## Desarrollador,
investigador 1
## $500,00 1 $500,00
## Desarrollador,
investigador 2
## $500,00 1 $500,00
## Total $1000,00
Nota: En  esta  tabla  se  presentan  los  principales  recursos  humanos  considerados  para  la  elaboración  del  prototipo.
Elaborado por: Anchundia Naldo, Galarza Bryan.

En la Tabla 11 se exponen los costos de inversión en hardware, considerando los equipos
informáticos personales utilizados.
## Tabla 11
Costos de inversión en hardware en el proyecto
## Equipo Costo Cantidad Total
## Laptop 1 $500,00 1 $500,00
## Laptop 2 $550,00 1 $550,00
## Total $1050,00
Nota: En esta tabla se presenta la inversión referencial en hardware de los equipos de cómputo utilizados. Elaborado
por: Anchundia Naldo, Galarza Bryan.

En la Tabla 12 se detallan los costos de inversión en software, donde se incluye el sistema
operativo, el entorno de desarrollo y lenguajes de programación.


## 40

## Tabla 12
Costos de inversión en software en el proyecto
## Descripción Costos Cantidad Total
## React,js $ 0,00 1 $ 0,00
## Python $ 0,00 1 $ 0,00
PostgreSQL $ 0,00 1 $ 0,00
## Visual Studio Code $ 0,00 1 $ 0,00
## Windows 11 $ 0,00 1 $ 0,00
## Total $ 0,00
Nota: En esta tabla se presenta la inversión en software para el desarrollo del proyecto, la cual es nula gracias al uso
de herramientas gratuitas y licencias preinstaladas. Elaborado por: Anchundia Naldo, Galarza Bryan.

En la Tabla 13 se presenta el resumen de todos los costos de inversión, consolidando el
presupuesto general destinado para el desarrollo del sistema.
## Tabla 13
Resumen de costos de inversión en el proyecto
## Tecnología Valor
## Recurso Humano $1000,00
## Hardware $1050,00
## Software $ 0
## Total $2050,00
Nota: En esta tabla se presenta el resumen final del presupuesto estimado para el desarrollo del proyecto. Elaborado
por: Anchundia Naldo, Galarza Bryan.

Metodologías del proyecto
Para   el   desarrollo   del   presente   proyecto   de   integración   curricular   se   aplican   dos
metodologías complementarias orientadas a cubrir los requerimientos analíticos y de software. Por
un lado, se aplicó la metodología estándar CRISP-DM para estructurar el modelo de inteligencia
artificial, gestionando el ciclo de vida de los datos desde su preprocesamiento hasta la evaluación
del algoritmo de procesamiento de lenguaje natural.

## 41

En cuanto al desarrollo del prototipo web se utilizó el marco de trabajo ágil Scrum, lo que
permitió organizar la construcción de los módulos e integrar el motor de emparejamiento mediante
iteraciones progresivas, garantizando el cumplimiento de los objetivos planteados.
Metodología de investigación
Para  el  desarrollo  del  presente  proyecto  se  emplearon  las  metodologías  de  investigación
exploratoria,  descriptiva  y  aplicada como  guías desde la  evaluación  del  problema hasta  el
desarrollo de la solución propuesta.
## Investigación Exploratoria
La investigación exploratoria se realiza al inicio de un proyecto teniendo como objetivo la
familiarización sobre un tema poco conocido a través del uso de métodos cualitativos como la
revisión literaria de fuentes primarias y secundarias para la exploración de información y
recopilación de datos (Lösch et al., 2023).
En el desarrollo del presente proyecto se utilizó la investigación exploratoria en la
recopilación de información a partir de tesis y artículos científicos nacionales e internacionales
para los antecedentes consultando información respecto a los sistemas de recomendación y su
impacto en la optimización de los procesos de vinculación entre postulantes y vacantes. Por otro
lado, en la fundamentación teórica se consultaron libros, artículos y fuentes institucionales para
detallar conceptos claves sobre definición, importancia y normativas de prácticas preprofesionales
en la Carrera de Software y temas tecnológicos como la inteligencia artificial, el procesamiento de
lenguaje natural, las métricas de precisión y las tecnologías utilizadas en plataformas web.
Investigación descriptiva
Deckert y Wilson (2023) definen a la investigación descriptiva como la identificación y
descripción de las características actuales de una situación determinada tal y como están

## 42

sucediendo, apoyándose en la observación o en técnicas de recopilación como encuestas o
entrevistas. Es decir que permiten visualizar el contexto actual exacto de una situación específica
mediante una representación clara como lo son los diagramas.
En el proyecto se aplicó esta metodología para el diseño de los diagramas de flujo
elaborados previamente en la sección de factibilidad operacional describiendo las actividades
realizadas en el proceso actual de búsqueda y postulación de prácticas preprofesionales en la
Carrera de Software en la figura 12 y figura 13, frente al flujo mejorado y estandarizado observable
en la figura 14 y figura 15.
## Investigación Aplicada
Por palabras de Castro-Maldonado et al. (2023) la investigación aplicada consiste en la
aplicación de todo el conocimiento existente sobre un área específica para la resolución de un
problema concreto. En otras palabras, se trata de la metodología que tiene como objetivo usar la
información recopilada para resolver el problema identificado.
Para abordar la problemática actual de la falta de sistematización de una vista de consulta
de vacantes de prácticas y el bajo nivel de compatibilidad entre el perfil del estudiante y las
actividades designadas se aplicó el desarrollo de un sistema de recomendación web utilizando
técnicas de inteligencia artificial como el procesamiento de lenguaje natural y los modelos de
similitud semántica para ofrecer un feed de recomendaciones de vacantes automático basado en la
compatibilidad de los perfiles de los estudiantes y la descripción de las vacantes.



## 43

Para una propuesta tecnológica, se recomienda aplicar una metodología de investigación
que permita explorar o diagnosticar el problema de estudio.
En esta sección puede incluir la metodología de investigación (diagnóstica o exploratoria),
población y muestra, técnicas e instrumentos de recolección de datos.
Se recomienda aprovechar los instrumentos de recolección de datos agregando preguntas
que permitan evidenciar/justificar los siguientes aspectos: problemática, factibilidad y
requerimientos (estos últimos depende de si son necesarios según la temática de proyecto).
Población y muestra
## Población.
Defina  la  población  en  la  que  realizará  la  investigación;  describa  algunas  características
que   le   tipifican   a   la   población.   (Indique   qué docentes o   especialistas,   consideró   en   su
investigación).  Si  la  investigación  corresponde  a  un  diseño  no  experimental  (documental  o
bibliográfico) determine las unidades de análisis utilizadas.
## Muestra.
Exprese cómo determinó el subconjunto de la población, a quiénes aplicará los
instrumentos para la obtención de la información o datos empíricos, especifique cuál será su
población objetivo. Especifique los procedimientos de selección de la muestra si utilizó alguna
fórmula y cuáles fueron los resultados.
Presente el análisis estadístico en cuadros estadísticos (Diagrama de barras, Análisis
estadístico descriptivo, prueba de hipótesis). (Indique específicamente quiénes y cuántos
especialistas o docentes fueron consultados o entrevistados).
Para el cálculo de la muestra puede utilizar alguna de las dos fórmulas siguientes:

## 44

## Primer Método
## UNIVERSIDAD CATÓLICA DE CHILE CIENES
## 푛=
## 푃푥푄푥푁
## (
## 푁−1
## )
## 퐸
## 2
## /퐾
## 2
## +푃푥푄

P = Probabilidad de éxito (0.50)
Q = Probabilidad de fracaso (0.50)
N = Tamaño de la población (750)
E = Error de estimación (6 %)
K = # de desviación típica “Z” (1:68 %, 2:95,5%, 3:99.7 %)

n = Tamaño de la muestra (203)

## 푛=
## 0.50 푥 0.50 푥 750
## (
## 750−1
## )
## 0.06
## 2
## /2
## 2
## +0.50 푥 0.50

## 푛=
## 187.50
## (
## 749
## )
## (0.0036)/4+0.25

## 푛=
## 187.50
## (
## 749
## )
## (0.009)+0.25

## 푛=
## 187.50
## (0.6741)+0.25

## 푛=
## 187.50
## 0.9241

## 푛= 203
## Segundo Método
## UNIVERSIDAD LIBERTADOR DE VENEZUELA CIRTERPLAN
## 푛=
## 푚
## 푒
## 2
## (
## 푚−1
## )
## +1


## 45

m = Tamaño de la población (750)
E = Error de estimación (6 %)

n = Tamaño de la muestra (203)

## 푛=
## 750
## (0.06)
## 2
## (
## 750−1
## )
## +1

## 푛=
## 750
## (
## 0.0036
## )(
## 749
## )
## +1

## 푛=
## 750
## 2.6964+1

## 푛=
## 750
## 3.6964

## 푛= 203
Cálculo de la fracción muestral
## 푓=
## 푛
## 푁

## 푓=
## 203
## 750
## =0.2707

## Tabla 8
Cálculo de la muestra
## Estrato Población Muestra
## Alto 120 32
## Medio 250 68
## Bajo 380 103
## Total 750 203
Nota: Colocar una descripción de los estratos, población y muestra, según aplique. Es posible mencionar las fuentes
de información y critérios que se aplicaron.


## 46




Procesamiento y análisis
Describa los mecanismos que empleará para el procesamiento de la información sea este
manual o mecánico y además los criterios para el análisis de los datos.
Para análisis estadístico, se utilizará la minería de datos o exploración de datos que permite
identificar varios grupos en los datos, que luego pueden ser utilizados para obtener resultados más
precisos de predicción por un sistema de soporte de toma de decisiones.
Los términos relacionados con la obtención de datos se refieren a la utilización de métodos
de minería de datos a las partes de la muestra de un conjunto de datos de población más grandes
establecidas que son (o pueden ser) demasiado pequeñas para las inferencias estadísticas fiables
que se hizo acerca de la validez de cualquier patrón descubierto. Estos métodos pueden, sin
embargo, ser utilizados en la creación de nuevas hipótesis que se prueban contra poblaciones de
datos más grandes.
Análisis por porcentajes, por cuadros (gráficas según objetivos).
Técnicas de recolección de datos.
Se describen las técnicas y los instrumentos, que se utilizarán para la obtención de la
información, así como los procedimientos de comprobación de su validez y confiabilidad, según
corresponda y si fuese necesario. Los instrumentos empleados se colocarán como anexos.
Extensión estimada: Hasta 1 página.

## 47

Técnicas estadísticas para el procesamiento de la información.
Se describen las técnicas estadísticas que se utilizarán para procesar la información que se
obtenga de la aplicación de los instrumentos. Extensión estimada: Hasta 1 página.
Técnicas para el Procesamiento y Análisis de Datos. Minería de datos o
exploración de datos es un campo de la estadística y las ciencias de la computación referido
al proceso que intenta descubrir patrones en grandes volúmenes de conjuntos de datos.
De la estadística. Ciertamente, la minería de datos de la estadística toma las
siguientes técnicas:
o Análisis de varianza: mediante el cual se evalúa la existencia de
diferencias significativas entre las medias de una o más variables
continuas en poblaciones distintas.
o Regresión: define la relación entre una o más variables y un conjunto
de variables predictoras de las primeras.
o Prueba chi-cuadrado: por medio de la cual se realiza el contraste de la
hipótesis de dependencia entre variables.
o Análisis de agrupamiento o clustering: permite la clasificación de una
población de individuos caracterizados por múltiples atributos (binarios,
cualitativos o cuantitativos) en un número determinado de grupos, con
base en las semejanzas o diferencias de los individuos.
o Análisis discriminante: permite la clasificación de individuos en
grupos que previamente se han establecido, permite encontrar la regla
de clasificación de los elementos de estos grupos, y por tanto una mejor

## 48

identificación de cuáles son las variables que definan la pertenencia al
grupo.
o Series de tiempo: permite el estudio de la evolución de una variable a
través del tiempo para poder realizar predicciones, a partir de ese
conocimiento y bajo el supuesto de que no van a producirse cambios
estructurales.
De la informática. La minería de datos de la informática toma las siguientes
técnicas:
o Algoritmos genéticos: Son métodos numéricos de optimización, en los
que aquella variable o variables que se pretenden optimizar junto con las
variables de estudio constituyen un segmento de información. Aquellas
configuraciones de las variables de análisis que obtengan mejores
valores para la variable de respuesta corresponderán a segmentos con
mayor capacidad reproductiva. A través de la reproducción, los mejores
segmentos perduran y su proporción crece de generación en generación.
Se puede además introducir elementos aleatorios para la modificación
de las variables (mutaciones). Al cabo de cierto número de iteraciones,
la población estará constituida por buenas soluciones al problema de
optimización, pues las malas soluciones han ido descartándose, iteración
tras iteración.
o Inteligencia Artificial: Mediante un sistema informático que simula un
sistema inteligente, se procede al análisis de los datos disponibles. Entre

## 49

los sistemas de Inteligencia Artificial se encuadrarían los Sistemas
Expertos y las Redes Neuronales.
o Sistemas Expertos: Son sistemas que han sido creados a partir de reglas
prácticas extraídas del conocimiento de expertos. Principalmente a base
de inferencias o de causa-efecto.
o Sistemas Inteligentes: Son similares a los sistemas expertos, pero con
mayor ventaja ante nuevas situaciones desconocidas para el experto.
o Redes neuronales: Genéricamente, son métodos de proceso numérico
en paralelo, en el que las variables interactúan mediante
transformaciones lineales o no lineales, hasta obtener unas salidas. Estas
salidas se contrastan con los que tenían que haber salido, basándose en
unos datos de prueba, dando lugar a un proceso de retroalimentación
mediante el cual la red se reconfigura, hasta obtener un modelo
adecuado.
Procesar datos significa describir las distintas operaciones a las que serán sometidas los
datos recogidos en la investigación.
- Analizar los resultados significa describir, interpretar y discutir los datos numéricos o
gráficos que se disponen en los cuadros estadísticos resultantes del procesamiento de
datos, para esto debe utilizar paquetes de software libre como lo es R o Python.
- El análisis e interpretación debe realizarlo considerando los contenidos del marco
teórico y en relación con los objetivos, las variables e indicadores y frecuencias
directrices de la investigación.

## 50

- El producto del análisis constituirá las conclusiones parciales que servirán de insumo
para elaborar las conclusiones y las recomendaciones.
Dependiendo de la profundidad que requiera su proyecto el proceso a seguir es:
- Revisión de los instrumentos aplicados.
- Tabulación de datos con relación a cada una de las variables previamente identificadas
para su análisis estadístico.
- Determinación de las frecuencias absolutas, frecuencias relativas.
- Diseño y elaboración de cuadros estadísticos con los resultados anteriores, análisis
descriptivos de los datos, en caso continúo el cálculo de estadísticos de centralización.
- Elaboración de gráficos: Histogramas, polígono de frecuencias, ojivas en caso
continuo, gráficos de barras en caso discreto.
- Analizar los resultados significa describir, interpretar y discutir los datos numéricos o
gráficos que se disponen en los cuadros estadísticos resultantes del procesamiento de
datos, para esto debe utilizar un paquete estadístico, recomendable SPSS.
- El análisis e interpretación debe realizarlo considerando los contenidos del marco
teórico y en relación con los objetivos, las variables e indicadores y frecuencias
directrices de la investigación.
- El producto del análisis constituirá las conclusiones parciales que servirán de insumo
para elaborar las conclusiones y las recomendaciones.
Se sugiere manejar en una hoja la pregunta, tabla, figura estadística y el análisis respectivo.
Como  ejemplo se  presenta el  análisis  de  la  pregunta  4  de  una  encuesta  realizada para  recopilar
información en un proyecto que consiste en el diseño y desarrollo de un prototipo de aplicación

## 51

móvil para agilizar el proceso de adopción de mascotas en las distintas fundaciones que existen
dentro de la cuidad de Guayaquil.
Se sugiere manejar en una hoja la pregunta, tabla, figura estadística y el análisis respectivo.
Como ejemplo se muestra la pregunta 4 de la encuesta realizada para recopilar información del
proyecto que consiste en el diseño y desarrollo de un prototipo de aplicación móvil para agilizar
el proceso de adopción de mascotas en las distintas fundaciones que existen dentro de la cuidad de
## Guayaquil.

Pregunta 4: ¿Tiene mascotas en casa actualmente?
## Tabla 8
Pregunta 4: ¿Tiene mascotas en casa actualmente?
Opciones de respuesta Frecuencia Absoluta Frecuencia Relativa
## Si 261 67,80%
## No 124 32,20%
## TOTAL 385 100,00%
Nota: En  esta  tabla  se  muestran los  valores  absolutos  y  relativos  correspondientes al  proceso  de tabulación  de  la
Pregunta 4 aplicada en la encuesta a los 385 individuos seleccionados para la investigación.


## Figura 4
Pregunta 4: Análisis gráfico de la pregunta número 4 de la encuesta.

Nota: De un total de 385 encuestados se observa que el 67,80% indica que dispone de mascotas en casa, mientras que
el  32,20%  no  las  tiene.  Se  puede  mencionar  la  elaboración  de  la  figura  colocando  el o  los nombres de los
investigadores.  En  el  caso  de la  fuente se  puede  mencionar  el nombre  de  la  institución, base  de  datos  de  donde  se
obtuvo la información, datos propios de la investigación, referencia a otro autor, entre otros.
Comentado [AOYM1]: Utilizar esta hoja de haber gráficos en el
desarrollo del proyecto, de lo contrario puede omitirlo.

## 52



Análisis: Los  resultados  de  este  gráfico  muestran  un  67,80%  de  personas  que  ya  poseen  una
mascota en casa, las cuales no podrían aplicar a un proceso de adopción al tener ya una mascota
en  casa.  Por  ello, las  fundaciones  utilizan  su  formulario  de  adopción  para  conocer  uno  de  estos
aspectos del adoptante que es situación económica al estar estable la fundación de rescate animal
permite bajo ese aspecto la adopción, caso contrario los resultados del 32,20% de personas que no
poseen una mascota son totalmente actos bajo este aspecto para realizar el proceso de adopción.


Metodología de gestión del proyecto (opcional)
La Metodología de Marco Lógico (en adelante, MML) es una herramienta para facilitar el
proceso de conceptualización, diseño, ejecución y evaluación de proyectos. Su énfasis está
centrado en la orientación por objetivos, la orientación hacia grupos beneficiarios y el facilitar la
participación y la comunicación entre las partes interesadas. Es un recurso relevante al momento
de la formulación de proyectos. Las fases de la MML son:
- Definición del problema central.
- Análisis de involucrados.
- Análisis de problemas.
- Análisis de objetivos.
- Análisis de Alternativas.
- Diseño de estrategia.
- Matriz de marco lógico.
Etapas de la metodología del proyecto
Describa las etapas de su proyecto de acuerdo con la metodología de gestión de proyecto
utilizada (PMI, CMMI, ITIL, AGILE, entre otras).

## 53

Metodología de desarrollo del proyecto
En esta sección deberá argumentar la metodología de desarrollo de software seleccionada,
evidenciando  la  aplicación  de esta dentro  del  proyecto.  Recuerde  que  cada  metodología  tiene
entregables  claros  que  demostrar. Por  ejemplo,  para  propuestas  de  desarrollo  de software  es
necesario  seguir  una  metodología  de  desarrollo  (cascada, espiral,  prototipado,  SCRUM, entre
otras). Es  importante  que  se  desarrollen  las  etapas  de  la  metodología considerando  aquella  que
haya sido seleccionada.
Para el modelo en cascada se deben identificar claramente las etapas en este capítulo con
sus artefactos:
- Requerimientos: Documentación formal de requerimientos.
- Diseño: Diagrama de clases, diagrama de arquitectura, diagrama de estados, casos de
uso, diagrama de casos de uso.
## • Implementación: Código.
- Verificación: Casos de pruebas con resultados de las pruebas.
- El cronograma debe mostrar las etapas desarrolladas.
Para el modelo prototipo se deben identificar claramente las etapas en este capítulo con sus
artefactos:
- Requerimientos: Documentación formal de requerimientos finales.
## • Diseño: Prototipado.
## • Implementación: Código.
- Verificación: Evaluación de los prototipos.
En  el  caso  de  la metodología  SCRUM (marco  de  trabajo),  la  cual  es  frecuentemente
utilizada  en  los  proyectos, se  deben  identificar  claramente  las etapas  en  este  capítulo  con  sus

## 54

artefactos:
- Product Backlog (Historias de usuario completas).
## • Sprint Backlog.
- Incremento/Sprints.
## • Burndown Chart.
- Sprint Planning, gráficas de progreso y demás.
Ahora   bien,   comenzar   un   proyecto   tecnológico   trae   consigo   varias   interrogantes
relacionadas  con  la metodología  que seguirá.  Partiendo  de  esta  premisa,  se  ha  diseñado  una
metodología  para  la  implementación  de  proyectos  tecnológicos,  dividida  en  fases  o  etapas  y
comprende desde el estudio de viabilidad (económica, infraestructura tecnológica), elementos del
proyecto (recurso humano, formas de aprendizaje), diseño, evaluación y desarrollo de contenidos,
hasta su aplicación.  Recuerde que son aspectos relevantes: Metodología de desarrollo propia del
proyecto, supuestos y restricciones, plan de Calidad (Pruebas a realizar).
Todos  estos  elementos  se  deberán  manejar  e  integrar  en  el  proyecto,  bajo  criterios  de
desarrollo y puesta en marcha señalando el orden de intervención y actuación de cada uno. Cabe
destacar que para el diseño de la metodología se consideraron los tres ambientes fundamentales
que   soportan   los   procesos   educativos:   laboratorio   (investigación   y   desarrollo),   biblioteca
(almacenamiento), aula.
Beneficiarios directos e indirectos del proyecto
Los beneficiarios, involucrados o stakeholders de un proyecto son las personas u
organizaciones que obtendrán algún tipo de beneficio de la implementación de este. Se pueden
identificar dos tipos de beneficiarios: Directos e indirectos.

## 55

Beneficiarios directos: Los beneficiarios directos son aquéllos que participarán
directamente en el proyecto y, por consiguiente, se beneficiarán de su implementación. Así, las
personas que estarán empleadas en el proyecto, que los suplen con materia prima u otros bienes y
servicios, o que usarán de alguna manera el producto del proyecto se pueden categorizar como
beneficiarios directos. Los pacientes potenciales de una clínica o los niños que posiblemente
asistirán a la escuela local (y sus familias) se clasificarían como beneficiarios directos; también, la
enfermera o el maestro/maestra que trabajen en la clínica y en la escuela. Los beneficiarios directos
de una vía de acceso pueden incluir a las personas que se prevé que la transitarán (conductores y
pasajeros), así como a los agricultores y otras personas que empleen camiones para transportar
bienes por la carretera.
Beneficiarios indirectos: Los beneficiarios indirectos son, con frecuencia, pero no siempre,
las personas que viven al interior de la zona de influencia del proyecto. Por consiguiente, aunque
una clínica puede prever que tratará únicamente a 1 500 pacientes, los beneficiarios indirectos
pueden incluir a las personas que vivan a una distancia de 5, 8 o incluso 10 kilómetros de la clínica
(dependiendo de la facilidad de acceso a la misma), pues beneficiará no solamente a los pacientes
locales tratados en ese momento sino también a los pacientes potenciales que en un futuro
requerirán de tratamiento. Los beneficiarios indirectos de una vía de acceso pueden incluir a todos
los habitantes de las comunidades ubicadas en un área cercana a la misma, así como aquéllos que
viven a pocos kilómetros a cada lado de la vía.
En esta sección se recomienda complementarlo con la Fase 2 de la Metodología de Marco
Lógica denominada “Análisis de Involucrados” empleando para ello la identificación,
categorización de involucrados, matriz de involucrados, mapa de actores, entre otros.

## 56

Entregables del proyecto
Describa  los  entregables  de  su  proyecto de  acuerdo  con la  metodología  de proyecto
utilizada (PMI, CMMI, ITIL, AGILE, ETC.). Como ejemplo de entregables se mencionan: código
fuente, código ejecutable, script de base de datos, diagramas de procesos, casos de usos, manual
técnico, manual de usuario, hardware, manual de instalación y operación, microcontrolador, robot,
dispositivo  electrónico, acta  de  entrega/recepción,  entre  otros. Para  la  presentación  gráfica y
jerárquica de los entregables del proyecto puede hacer uso de la EDT (Estructura de desglose de
trabajo).
## Propuesta
En esta sección deberá describir su propuesta o solución. Es posible que incluya el diseño
arquitectónico de su proyecto, modelo construido, prototipo, ajuste esta sección de acuerdo con su
producto.
Criterios de validación de la propuesta
Describa el criterio y estrategia que utilizará para validar el módulo o propuesta (Juicio de
Expertos  o  experimentación,  entre  otros). Para  Proyectos  Tecnológicos  utilizar:  Informe  de
Pruebas y Encuesta de Satisfacción del proyecto. No olvide exponer los resultados de la encuesta.
Además, incluir formatos que respalden su validación siguiendo los criterios éticos mostrados en
el Anexo 5; por ejemplo, anexo de juicio de expertos.
Se  recomienda  realizar  juicio  de  expertos  incluyendo  criterios  que permitan  validar  lo
realizado en el desarrollo del proyecto. Para el caso de propuestas de desarrollo de software estos
criterios  deberían  evidencias, entre  otros  posibles,  el  cumplimiento  de  los  requerimientos
especificados.

## 57

Para este caso se debe tener claro que los resultados obtenidos de la entrevista, será en base
al  juicio  de  los  expertos,  para  esto  se  debe  hacer  uso  de  técnicas  que  me  ayuden  a  validar  las
respuestas  de  cada  uno  de  los  expertos,  para  lo  cual  seguirá los  siguientes  pasos  para  validar  el
cuestionario:
- Selección de los expertos, con un mínimo de 12 a 15 expertos.
- Validación del contenido, en este caso el objetivo es que queden de los 12 expertos
una cierta cantidad que cumplan todos los criterios, asegúrese de que después del
análisis le queden como mínimo 5 expertos, para esto se utiliza el Método Delphi y
la prueba de concordancia de Kendall.
Para  el  criterio  de  la  toma  de  decisiones,  el  estadístico  de  prueba  (Chi-cuadrado),  debe
aplicar  contraste de hipótesis, este es  el caso cuando se aplica el Método  Delphi y la prueba de
concordancia de Kendall.
Criterio de toma de decisión en el caso que se utilice el criterio de expertos:
- Si  p   0.05  entonces  se  rechaza  H
## 0
y  se  acepta  H
## 1
y  se  dice  significativo  (Si  la
probabilidad  correspondiente  al  valor  calculado  por  la  prueba  estadística  es  menor  o
igual que su respectivo valor crítico al nivel de 0.05, entonces se rechaza H
## 0
y se dice
significativo).
- Si  p  >  0.05  entonces  se  acepta  H
## 0
y  se  dice  no  significativo  (Si  la  probabilidad
correspondiente al valor calculado por la prueba estadística es mayor que su respectivo
valor crítico al nivel de 0.05, entonces se acepta H
## 0
y se dice no significativo).
## Resultados
Los  datos  mostrados  en  la  sección  resultados  deben  estar dispuestos de  forma  clara  y
sencilla. Los datos mostrados en el texto permiten que el lector capte la información en forma más

## 58

eficiente y rápida. Las tablas son ideales para presentar datos precisos y repetitivos. Los gráficos
son ideales para presentar datos que muestran tendencias o patrones importantes.
En esta sección se muestran los hallazgos encontrados en el estudio. Solo se deben mostrar
los datos más relevantes. No se interpretan ni comentan los hallazgos. Lo que se coloca dentro del
texto,  no  se  debe  repetir  en  las  tablas  y gráficos. Estos  hallazgos  deben  estar  redactados  y
expresados de manera clara y sencilla, para facilitar la lectura por parte de los lectores ya que es
un aporte nuevo para el conocimiento. El autor no necesita incluir los datos obtenidos durante el
proceso  de  investigación,  es  necesario  que  escoja  lo  más significativo,  como  lo  señaló  Wesley
Powell  (1888): “el necio colecciona hechos; el sabio los selecciona”. Si  hay  variables  que  no
afectan el resultado o influyen de forma negativa, también se deben colocar, no solo es cuestión
de colocar los resultados positivos.
Como ejemplo de un resultado se menciona: “33 1/3% de los ratones utilizados en este
experimento  curaron con  el  medicamento  ensayado;  33  1/3%  de  la  población experimental  no
resultó afectada por el fármaco y persistió en estado agónico; el tercer ratón escapó” (Erwin Neter,
Editor Jefe de Infection and Immunity).
















## 59







## 49

## CAPÍTULO IV
## CONCLUSIONES Y RECOMENDACIONES
Criterios de aceptación del producto o servicio
Consiste  en  medir  y  decidir  si  la  calidad  y  el  rendimiento  de  un  producto  o  servicio  es
aceptable o no. Los criterios utilizados pueden ser las especificaciones técnicas (como el nivel de
tolerancia admitida en las partes), cláusulas y condiciones contractuales, o el rendimiento de un
proceso o servicio. La idea implícita es que todos los procesos, productos y acciones deben tener
asignado un nivel de rendimiento aceptable que se pueda medir. Se entiende que esos criterios se
extraen  de  las  propias  capacidades  del  proceso,  los  técnicos  deben  medir  periódicamente  la
aceptabilidad para averiguar en qué medida un proceso o un producto cumple las especificaciones.
Los criterios de aceptación son evaluados por el cliente o posible cliente de la propuesta
realizada. Determinan las circunstancias específicas bajo las cuales el cliente aceptará el resultado
final del proyecto. Es importante incluir en los criterios de aceptación tanto cuestiones funcionales
como no funcionales. Es posible agregar, por ejemplo, un tiempo máximo de respuesta, la facilidad
de eso, entre otros. Es necesario que se produzca un documento que evidencia la aceptación del
cliente, el cual debe incluir firma y sello (en caso de ser posible).
Elaborar  una  matriz  completa  con  los  criterios  de  aceptación  por  cada  uno  de  los
requerimientos indicados en el alcance de su proyecto.

## 49

- Informe de aceptación y aprobación para productos de software/hardware.
- Informe de aseguramiento de la calidad para productos de software/hardware.
a) Establecer mecanismos de control.
b) Definir métodos para corrección.
c) Medidas, métricas e indicadores.
## Conclusiones
Una  vez  realizado  el  análisis  de  cada  una  de  las  respuestas  del instrumento  aplicado,  se
enuncian las conclusiones. Las conclusiones constituyen una sección independiente y presentan,
en forma lógica, los resultados del trabajo. Las conclusiones deben ser la respuesta a los objetivos
específicos o propósitos planteados. Se debe dar respuesta a todos los objetivos específicos y debe
quedar claro  de  qué  manera  se  evidencia  su  cumplimiento.  Adicionalmente, pueden  agregarse
otras conclusiones acerca de los resultados obtenidos.
Se recomienda que cada conclusión se maneje en un párrafo independiente, para ello utilice
viñetas. Por ejemplo:
- Detalle la conclusión 1.
- Detalle la conclusión 2.
- Entre otras.
## Recomendaciones
Se presentan como una serie de aspectos que se podría realizar en un futuro en la aplicación,
mejora en los procesos administrativos, entre otros. Se incluyen recomendaciones de aspectos que
no estuvieron en el alcance pero que se sugieren agregar.
Comentado [AOYM2]: En los criterios de aceptación se debe
tener en cuenta:
1.Criterios de aceptación para aplicación móvil, aplicación web,
aplicación de escritorio; según en caso.
- Carta de aceptación del software por parte de un directivo como
gerente de sistema o similar.

## 50

Se sugiere que cada recomendación se maneje en un párrafo independiente, para ello utilice
viñetas. Por ejemplo:
- Detalle la recomendación 1.
- Detalle la recomendación 2.
- Entre otras.
Trabajos futuros
En esta sección se presentarán las futuras líneas de investigación y/o desarrollo que fueron
identificadas durante el período de tiempo que llevó realizar el presente trabajo.
Se sugiere que cada idea de trabajo futuro se maneje en un párrafo independiente, para ello
utilice viñetas. Por ejemplo:
- Detalle el trabajo futuro 1.
- Detalle el trabajo futuro 2.
- Entre otras.








## 51

## REFERENCIAS BIBLIOGRÁFICAS
Las  referencias  bibliográficas  se  asocian  a  la  inclusión  de  obras  o  recursos  de  todos  los
autores  que  han  sido  citados  en  su trabajo  de  integración  curricular. Puede  incluir artículos  de
revistas científicas, tesis de grado y/o maestría, libros físicos, libros virtuales, entre otros.
Su inclusión es obligatoria en todo trabajo de investigación. Cada referencia bibliográfica
se inicia contra el margen izquierdo. Se recomienda el uso de gestores bibliográficos (Mendeley,
Zotero, EndNote, entre otros) para su facilidad o gestión.
El trabajo de integración curricular deberá contener al menos 30 referencias bibliográficas
correctas. Se recomienda que el 20% de las referencias sean en idioma inglés.
Utilice la norma APA7; por ejemplo, considere las siguientes citas: Kumar y cols. (2018),
Zambrano y Senti (2016).
## Ejemplo
Kumar, D., Wu, H., Rajasegarar, S., Leckie, C., Krishnaswamy, S., & Palaniswami, M. (2018).
Fast  and  scalable  big  data  trajectory  clustering  for  understanding  urban  mobility.  IEEE
Transactions on Intelligent Transportation Systems, 19(11), 3709-3722.
Zambrano, G. R., & Senti, V. E. (2016). Marco de trabajo para el diseño de una arquitectura ITS
en Ecuador que mejore la interoperabilidad y el despliegue de los sistemas de control de
tráfico vehicular/ [Framework for designing an ITS architecture in Ecuador that improves
the  interoperability  and  deployment  of  vehicular  trac  control  systems]. International
Journal of Innovation and Applied Studies, 14(4), 886.


## 52

## BIBLIOGRAFÍA
La bibliografía es la relación de las fuentes documentales consultadas por el investigador
para sustentar sus trabajos. Su inclusión es obligatoria en su trabajo de integración curricular. Cada
referencia  bibliográfica  se  inicia  contra  el  margen  izquierdo. Recuerde  que solo  se  refiere  a  los
autores o recursos que se utilizaron, pero que no se citaron en el documento. Puede incluir artículos
de revistas científicas, tesis de grado y/o maestría, libros físicos, libros virtuales, entre otros. Utilice
la norma APA7.
## Ejemplo
Duan, M., Qi, G., Guan, W., & Guo, R. (2020). Comprehending and Analyzing Multiday Trip-
Chaining  Patterns  of  Freight  Vehicles  Using  a  Multiscale  Method  with  Prolonged
Trajectory Data. Journal   of   Transportation   Engineering,   Part   A:   Systems,   146(8),
## 04020070.
















## 53

## ANEXOS
Los anexos son todos los contenidos que se agregan al final de un trabajo de integración
curricular para  ampliar  la  información  presentada,  pero  sin  resultar  imprescindibles  para  la
comprensión del fenómeno estudiado. A continuación, se presenta una lista de los anexos que se
sugiere incluir en su proyecto:
- Anexo 1. Planificación de actividades del proyecto. Se recomienda utilizar Microsoft
Project, Gantt Project, TeamGantt, Trello o un software equivalente.
- Anexo 2. Geolocalización del problema.
- Anexo 3. Carta de autorización del proyecto.
- Anexo 4. Fundamentación legal.
- Anexo 5. Criterios éticos a utilizarse en el desarrollo del proyecto
Se  incluye  la  gestión  de  permisos  a  las  distintas  organizaciones  a  las  cuales  se
orientan  los  proyectos  para  el  uso  futuro  de  los  datos. Extensión estimada:  Hasta  1
página.
- Anexo  6.  Formato  de  técnicas  de  recolección  de  datos  aplicadas  para  variables
cuantitativas o cualitativas.
- Anexo 7. Validación de expertos.
- Anexo 8. Bases de datos para análisis estadístico (Opcional)
- Anexo 9. Diagramas de casos de uso (Dependiendo de la metodología que aplique en
el proyecto).
- Anexo 10. Acta de entrega y recepción definitiva.
- Anexo 11. Carta de uso de software (Aplica según se requiera).
- Anexo 12. Evidencias fotográficas adicional (Opcional).
Comentado [AOYM3]: Incluir en los anexos el manual de
usuario y el manual técnico de acuerdo a lo indicado.
Cada anexo debe incluir elaboración y fuente como mínimo.
El instrumento deberá ser validado por lo menos, 3 docentes del área.

## 54

- Anexo 13. Manual técnico.
El manual incluirá la tabla de contenidos correspondiente.
- Anexo 14. Manual de usuario.
El manual incluirá la tabla de contenidos correspondiente.
Considere que si los manuales técnicos y de usuario no superan las 30 páginas pueden ser
considerados como anexo, caso contrario deben ser un segundo tomo de su trabajo de integración
curricular. Adicionalmente, recuerde que la cantidad de páginas que suman sus cuatro capítulos
no debe ser inferior a 80 páginas.
Comentado [AOYM4]: Nota: El manual incluirá la tabla de
contenidos correspondiente. No colocar esta nota en su documento
final.

Comentado [AOYM5]: Nota: El manual incluirá la tabla de
contenidos correspondiente. No colocar esta nota en su documento
final.


## 55

Anexo 1.  Planificación de actividades del proyecto

## Elaboración: Investigadores.
## Fuente: Propia.

## 56


Anexo 2.  Geolocalización del problema


Elaborado por: Anchundia Naldo, Galarza Bryan
## Fuente: Google Maps






## 57

Anexo 3.  Carta de autorización del proyecto


## 58

## Anexo 4.  Fundamentación Legal
## CONSTITUCIÓN DE LA REPÚBLICA DEL ECUADOR
## TÍTULO II
## DERECHOS
## CAPITULO II
## DERECHOS DEL BUEN VIVIR
Art. 26.- La educación es un derecho de las personas a lo largo de su vida y un deber ineludible e
inexcusable del Estado. Constituye un área prioritaria de la política pública y de la inversión
estatal, garantía de la igualdad e inclusión social y condición indispensable para el buen vivir.
Las personas, las familias y la sociedad tienen el derecho y la responsabilidad de participar en el
proceso educativo.
Art. 27.- La educación se centrará en el ser humano y garantizará su desarrollo holístico, en el
marco del respeto a los derechos humanos, al medio ambiente sustentable y a la democracia; será
participativa, obligatoria, intercultural, democrática, incluyente y diversa, de calidad y calidez;
impulsará la equidad de género, la justicia, la solidaridad y la paz; estimulará el sentido crítico, el
arte y la cultura física, la iniciativa individual y comunitaria, y el desarrollo de competencias y
capacidades para crear y trabajar. La educación es indispensable para el conocimiento, el
ejercicio de los derechos y la construcción de un país soberano, y constituye un eje estratégico
para el desarrollo nacional.
Art. 28.- La educación responderá al interés público y no estará al servicio de intereses
individuales y corporativos. Se garantizará el acceso universal, permanencia, movilidad y egreso
sin discriminación alguna y la obligatoriedad en el nivel inicial, básico y bachillerato o su
equivalente. Es derecho de toda persona y comunidad interactuar entre culturas y participar en
una sociedad que aprende. El Estado promoverá el diálogo intercultural en sus múltiples
dimensiones. El aprendizaje se desarrollará de forma escolarizada y no escolarizada. La
educación pública será universal y laica en todos sus niveles, y gratuita hasta el tercer nivel de
educación superior inclusive.

## TÍTULO VII
## RÉGIMEN DEL BUEN VIVIR
## CAPÍTULO I
Art. 350.- El sistema de educación superior tiene como finalidad la formación académica y
profesional con visión científica y humanista; la investigación científica y tecnológica; la
innovación, promoción, desarrollo y difusión de los saberes y las culturas; la construcción de
soluciones para los problemas del país, en relación con los objetivos del régimen de desarrollo.
Art. 385.- El sistema nacional de ciencia, tecnología, innovación y saberes ancestrales, en el
marco del respeto al ambiente, la naturaleza, la vida, las culturas y la soberanía, tendrá como
finalidad:
- Generar, adaptar y difundir conocimientos científicos y tecnológicos.

## 59

- Recuperar, fortalecer y potenciar los saberes ancestrales.
- Desarrollar tecnologías e innovaciones que impulsen la producción nacional, eleven la
eficiencia y productividad, mejoren la calidad de vida y contribuyan a la realización del
buen vivir.
Art. 387.- Será responsabilidad del Estado:
- Facilitar e impulsar la incorporación a la sociedad del conocimiento para alcanzar los
objetivos del régimen de desarrollo.
- Promover la generación y producción de conocimiento, fomentar la investigación
científica y tecnológica, y potenciar los saberes ancestrales, para así contribuir a la
realización del buen vivir, al sumak kawsay.
- Asegurar la difusión y el acceso a los conocimientos científicos y tecnológicos, el
usufructo de sus descubrimientos y hallazgos en el marco de lo establecido en la
Constitución y la Ley.
- Garantizar la libertad de creación e investigación en el marco del respeto a la ética, la
naturaleza, el ambiente, y el rescate de los conocimientos ancestrales.
- Reconocer la condición de investigador de acuerdo con la Ley.
## LEY ORGÁNICA DE EDUCACIÓN SUPERIOR (LOES)
## TÍTULO IV
## IGUALDAD DE OPORTUNIDADES
## CAPÍTULO I
Art. 87.- Requisitos previos a la obtención del grado académico. - Como requisito previo a la
obtención del grado académico, los y las estudiantes deberán acreditar servicios a la comunidad
mediante programas, proyectos de vinculación con la sociedad, prácticas o pasantías
preprofesionales con el debido acompañamiento pedagógico, en los campos de su especialidad.
En el caso de las y los egresados de las facultades de jurisprudencia, derecho y ciencias jurídicas
se estará a lo dispuesto en el Código Orgánico de la Función Judicial.
Art. 144.- Trabajos de Titulación en formato digital. - Todas las instituciones de educación
superior estarán obligadas a entregar los trabajos de titulación que se elaboren para la obtención
de títulos académicos de grado y posgrado en formato digital para ser integradas al Sistema
Nacional de Información de la Educación Superior del Ecuador para su difusión pública
respetando los derechos de autor.
## CÓDIGO ORGÁNICO DE LA ECONOMÍA SOCIAL DE LOS CONOCIMIENTOS,
## CREATIVIDAD E INNOVACIÓN (INGENIOS)
## LIBRO III
## RÉGIMEN DE LA PROPIEDAD INTELECTUAL
## TÍTULO I
## DERECHOS DE AUTOR Y DERECHOS CONEXOS
## CAPÍTULO I
## DISPOSICIONES GENERALES

## 60

Art. 104.- Obras susceptibles de protección. - La protección reconocida por el presente Título
recae sobre todas las obras literarias, artísticas y científicas, que sean originales y que puedan
reproducirse o divulgarse por cualquier forma o medio conocido o por conocerse.
Art. 131.- Protección de software. - El software se protege como obra literaria. Dicha protección
se otorga independientemente de que hayan sido incorporados en un ordenador y cualquiera sea
la forma en que estén expresados, ya sea como código fuente; es decir, en forma legible por el
ser humano; o como código objeto; es decir, en forma legible por máquina, ya sea sistemas
operativos o sistemas aplicativos, incluyendo diagramas de flujo, planos, manuales de uso, y en
general, aquellos elementos que conformen la estructura, secuencia y organización del programa.
Se excluye de esta protección las formas estándar de desarrollo de software. En este sentido, los
documentos y textos producidos en las Instituciones de Educación Superior desarrollados con el
objeto de obtener sus grados académicos y/o trabajos de facultad, son autores intelectuales con el
patrocinio de cada institución, por lo tanto, son acreedores a los derechos de protección
intelectual dispuestos en la normativa vigente.

## LEY ORGÁNICA DE PROTECCIÓN DE DATOS PERSONALES (LOPDP)
Art. 1.- Objeto y finalidad. - El objeto y finalidad de la presente ley es garantizar el ejercicio del
derecho a la protección de datos personales, que incluye el acceso y decisión sobre información y
datos de este carácter, así como su correspondiente protección. Para dicho efecto se regula, prevé
y desarrolla lo relativo a la recopilación, procesamiento, almacenamiento, uso y cualquier otra
operación que se realice sobre datos personales de personas naturales.
Art. 7.- Tratamiento legítimo de datos personales. - El tratamiento será legítimo y lícito si se
cumple con alguna de las siguientes condiciones:
- Por consentimiento del titular para el tratamiento de sus datos personales, para una o
varias finalidades específicas.
- Por el cumplimiento de una obligación legal o una orden judicial o administrativa
emanada de autoridad competente.
- Por el cumplimiento de una misión realizada en interés público o en el ejercicio de
poderes públicos conferidos al responsable del tratamiento.
- Por la protección de intereses vitales del titular o de otras personas naturales.
- Por la ejecución de medidas precontractuales a petición del titular o por la ejecución de
un contrato en el que el titular es parte.
- Por la satisfacción de intereses legítimos del responsable o de un tercero, siempre que
sobre dichos intereses no prevalezcan los intereses o derechos y libertades fundamentales
del titular.
Art. 13.- Derecho de acceso. - El titular tiene derecho a conocer y a obtener, gratuitamente, del
responsable de tratamiento acceso a todos sus datos personales y a la información detallada en el
artículo precedente, sin necesidad de presentar justificación alguna. El responsable del
tratamiento de datos personales deberá establecer métodos razonables que permitan el ejercicio
de este derecho, el cual deberá ser atendido dentro del plazo de quince (15) días. El derecho de
acceso no podrá ejercerse de forma tal que constituya abuso del derecho.

## 61

Anexo 5.  Criterios éticos a utilizarse en el desarrollo del proyecto

## Elaboración: Investigadores.
## Fuente: Propia.


## 62

Anexo 6.  Formatos de técnicas de recolección de datos aplicadas para variables
cuantitativas o cualitativas.
Ejemplo de Formato de Encuesta



## Elaboración: Investigadores.
## Fuente: Propia.


## 63

Ejemplo de Formato de Entrevista

## Elaboración: Investigadores.
## Fuente: Propia.


## 64

Ejemplo de Formato de Ficha de Experimentación


## Elaboración: Investigadores.
## Fuente: Propia.


## 65

Ejemplo de Formato de Ficha de Observación

## Elaboración: Investigadores.
## Fuente: Propia.

## 66

Anexo 7.  Validación de expertos.
Juicios de expertos

Para la validación del proyecto se utilizó el instrumento de juicio de expertos con la finalidad de
realizar  las  pruebas  de  funcionalidad  y  porcentaje  de  validación  del  software  desarrollado,
adicional los expertos que realicen la validación correspondiente pueda ofrecer valorización para
este proyecto y que las técnicas implementadas sean las adecuadas. (Véase Anexo 7).

Considere de 3 a 5 validación de expertos.




## 67

## ANEXO 7. VALIDACIÓN DE EXPERTOS
## DATOS GENERALES
## APELLIDOS Y NOMBRES
## DEL EXPERTO
## TITULO PROFESIONAL DEL
## EXPERTO
## AUTOR(ES)

## TÍTULO DEL PROYECTO
## INDICADOR CRITERIO
## DEFICIENTE
## 0-20
## REGULAR
## 21-40
## BUENA
## 41- 60
## MUY BUENA
## 61- 80
## EXCELENTE
## 81 - 100
## 5 10 15 20 25 30 35 40 45 50 55 60 65 70 75 80 85 90 95 100
CLARIDAD Se  utiliza  el  lenguaje  de
programación apropiado
que facilita la comprensión.

OBJETIVIDAD Está expresado en
conductas    observables    y
medibles.

ACTUALIDAD Esta  acorde  a  los  aportes
recientes en la disciplina de
estudio.

SUFICIENCIA Son  suficientes  la  cantidad
y calidad de ítems
presentados en el
instrumento.

INTENCIONALIDAD Es adecuado para valorar la
variable seleccionada.

CONSISTENCIA Está   basado   en   aspectos
teóricos y científicos.

METODOLOGÍA El instrumento se relaciona
con el método planteado en
el proyecto.

APLICABILIDAD El  instrumento  es  de  fácil
aplicación.


## 68


## CONSTANCIA DE JUICIO DE EXPERTO


## Estimado(a) Ingeniero(a)
Nombres y apellidos del tutor(a)
## DOCENTE TUTOR(A) DEL TRABAJO DE INTEGRACIÓN CURRICULAR
## Ciudad. -

El  presente  instrumento  certifica  que  se  realizó  la  revisión  del Proyecto  de  Integración
Curricular “NOMBRE DEL PROYECTO” cuyos criterios e indicadores empleados permitieron
articular   el   trabajo   según   se   muestra   en   el Anexo   7,   por   tanto,   _______________   y
______________  estudiante(s)  no  titulados  de  la  Carrera  de Software de  la  Universidad  de
Guayaquil,  (NO)  pueden  continuar  con  el  proceso  de integración  curricular en  vista  que  (no)
existen observaciones.
## ______________________________________________________________________
## ______________________________________________________________________
## ______________________________________________________________________
## ______________________________________________________________________

Por lo actuado en el Anexo 7, se procede a validar el trabajo de integración curricular.

Sin otro particular.



## _________________________________
Nombres y apellidos del experto
## C.I. N° 9999999999



## Elaboración: Investigadores.
## Fuente: Propia.

## 69


## INSTRUMENTO DE VALIDACIÓN

## _________________________________
Nombres y apellidos
## C.I. N° 9999999999

## Elaboración: Investigadores.
## Fuente: Propia.
Comentado [AOYM6]: El instrumento deberá ser validado por lo
menos, 3 docentes del área.

## 70


Anexo 8.  Bases de datos para análisis estadístico (Opcional)
## BASE DE DATOS DE LAS VARIABLES DE ESTUDIO











## CODIFICACIÓN DE LAS VARIABLES EN SPSS










Definición de Variables (Un concepto básico de lo que hace cada variable)


## 71


## Variables Cuantitativas
▪ Edad: Esta variable discreta nos indica la edad de los estudiantes encuestados.
▪ Semestre: Indica si la mayor cantidad de estudiantes encuestados
## Variables Cualitativas
▪ Sexo: Indica si el estudiante encuestado es del sexo masculino o femenino.
▪ Estado civil: Indica si el estudiante encuestado es: casado, soltero o unión libre.
▪ Dispositivo_Conexion_WIFI: Nos indica si están de acuerdo en un dispositivo capacitado
(Hotspot) para conectarse a la red WIFI.
▪ Frecuencia_Uso: Indica la frecuencia que le da un estudiante promedio a la red para uso
de investigaciones respecto a la carrera.
▪ Red_Apta: Indica  la  opinión  del  estudiante  encuestado  si  se  encuentra  totalmente  de
acuerdo o en desacuerdo sobre si la conectividad es la suficiente para realizar sus trabajos.
▪ Frecuencia_Problemas_SIUG: Indica que tan frecuente ha sido las molestias al tratar de
ingresar al sitio web del SIUG.
▪ Ingreso_Bibliotecas: Indica si el estudiante ha ingresado al menos una vez a una biblioteca
de la carrera.
▪ Problemas_Bibliotecas: Indica si al ingresar a las bibliotecas ha tenido siempre o nunca
problemas en la conexión.
▪ Velocidad_Laboratorios: Indica   la   opinión   del   estudiante   encuestado   sobre   si la
velocidad de navegación en los laboratorios de la carrera es óptima para la realización de
trabajos.
▪ Uso_Exclusivo: Indica la opinión del estudiante si se encuentra de acuerdo o no en que se
implemente  más  puntos  de  conexión  en  la  CINT  solo  para  estudiantes  y  otro  solo  para

## 72


docentes  para  que  de  esta  manera  mejore  la  velocidad  de  navegación  y  con  ella  la
efectividad de esta.
▪ Puntos_conexion_Suficientes: Indica la opinión del estudiante si está conforme o no con
la cantidad de puntos de acceso a la red WIFI en la CINT.
▪ Red_Optima: Indica la opinión si el estudiante sobre que si la red es óptima para su uso
académico.
▪ Conocimiento_Previo: Indica  si  el  estudiante  tenía  conocimiento  de  las  bibliotecas
virtuales de la CINT antes de esta encuesta.
Codificación de las variables cualitativas
Tabla de codificación la variable SEXO
## CODIFICACIÓN
## ETIQUETA VALOR
## MASCULINO 1
## FEMENINO 2

Tabla de codificación la variable ESTADO CIVIL
## CODIFICACIÓN
## ETIQUETA VALOR
## CASADO/A 1
## SOLTERO/A 2

Tabla de codificación la variable DISPOSITIVO_CONEXION_WIFI
## CODIFICACIÓN
## ETIQUETA
## VALOR
## TOTAL ACUERDO 5
## PARCIAL ACUERDO 4
## INDIFERENTE 3
## PARCIAL DESACUERDO 2
## TOTAL DESACUERDO 1



## 73


Tabla de codificación la variable FRECUENCIA_USO
## CODIFICACIÓN
## ETIQUETA
## VALOR
## SIEMPRE 5
## CASI SIEMPRE 4
## A VECES 3
## CASI NUNCA 2
## NUNCA 1

Tabla de codificación la variable FRECUENCIA_PROBLEMAS_SIUG
## CODIFICACIÓN
## ETIQUETA
## VALOR
## TOTAL ACUERDO 5
## PARCIAL ACUERDO 4
## INDIFERENTE 3
## PARCIAL DESACUERDO 2
## TOTAL DESACUERDO 1

Tabla de codificación la variable INGRESO_BIBLIOTECAS
## CODIFICACIÓN
## ETIQUETA
## VALOR
## SIEMPRE 5
## CASI SIEMPRE 4
## A VECES 3
## CASI NUNCA 2
## NUNCA 1

Tabla de codificación la variable PROBLEMAS_BIBLIOTECAS
## CODIFICACIÓN
## ETIQUETA
## VALOR
## SIEMPRE 5
## CASI SIEMPRE 4
## A VECES 3
## CASI NUNCA 2
## NUNCA 1

Tabla de codificación la variable VELOCIDAD_LABORATORIOS

## 74


## CODIFICACIÓN
## ETIQUETA
## VALOR
## SIEMPRE 5
## CASI SIEMPRE 4
## A VECES 3
## CASI NUNCA 2
## NUNCA 1

Tabla de codificación la variable USO_EXCLUSIVO

## CODIFICACIÓN
## ETIQUETA
## VALOR
## TOTAL ACUERDO 5
## PARCIAL ACUERDO 4
## INDIFERENTE 3
## PARCIAL DESACUERDO 2
## TOTAL DESACUERDO 1

Tabla de codificación la variable PUNTOS_CONEXION_SUFICIENTES
## CODIFICACIÓN
## ETIQUETA
## VALOR
## TOTAL ACUERDO 5
## PARCIAL ACUERDO 4
## INDIFERENTE 3
## PARCIAL DESACUERDO 2
## TOTAL DESACUERDO 1

Tabla de codificación la variable RED_OPTIMA
## CODIFICACIÓN
## ETIQUETA VALOR
## SI 1
## NO 2


Tabla de codificación la variable CONOCIMIENTO_PREVIO

## CODIFICACIÓN
## ETIQUETA VALOR
## SI 1
## NO 2
## Elaboración: Investigadores.
## Fuente: Propia.

## 75


## EJEMPLO DE FORMATO DE TABLA DE META-ANÁLISIS


## Elaboración: Investigadores.
## Fuente: Propia.


## 76


Anexo 9. Diagramas de casos de uso (Dependiendo de la metodología que aplique en el
proyecto)






















## 77


Anexo 10. Acta de entrega y recepción definitiva
La  legislación  vigente  en  materia  de  propiedad  intelectual  no  reconoce  ni  niega  la
existencia de una obligación cierta de entrega de los códigos fuente de páginas web. En cambio,
en materia  contractual civil y mercantil sí se reconoce esta obligación en  determinados casos, a
saber:
- Cuando se haya acordado expresamente la entrega de los códigos fuente.
- Cuando  no  se  haya  acordado,  únicamente  en  los  casos  que  reúnan  las  condiciones
siguientes:
- La página web debe haber sido personalizada a petición del cliente y para cumplir
los fines requeridos por éste.
- El comprador queda dependiente del programador para la realización de todo tipo
de actualizaciones.
- El  cliente  debe  haber  corrido  con  los  gastos  de  investigación  y  desarrollo  de  la
página web.
Fuente: https://www.pablofb.com/2008/11/debo-dar-al-cliente-el-codigo-fuente/




Comentado [AOYM7]: Las definiciones que se adjuntan deberá
borrarlas del anexo, dejar solo el formato de acta.

## 78


En la ciudad de Guayaquil, a ___días del mes de_________ de _____
Por el presente documento.
Los estudiantes no titulados de la Carrera de Software_________________ con cédula de
identidad  N° __________  y  ___________________  con  cédula  de identidad N° __________
hacemos la entrega del código fuente del Proyecto de Integración Curricular a la Dirección de la
Carrera de Software en un medio magnético.
Los códigos del programa/producto que se encargaron por compromiso al estar inserto en
el proceso de integración curricular desde fecha __ de ______.
Para efectos de dar cumplimiento a la entrega del código fuente, cedo todos los derechos
de  explotación  sobre  el  programa  y,  en  concreto,  los  de  transformación,  comunicación  pública,
distribución y reproducción, de forma exclusiva, con un ámbito territorial nacional.

Apellidos y nombres del estudiante                                        Cédula de identidad N°

Apellidos y nombres del estudiante                                        Cédula de identidad N°




## Elaboración: Investigadores.
## Fuente: Propia.


Comentado [AOYM8]: En el caso de que el Proyecto de
Titulación tenga la participación de dos estudiantes, se deberá generar
la sección resaltada de rojo.
Una vez personalizada la información del segundo participante
colocar color negro a la fuente.

## 79


Anexo 11.  Carta de uso de software (Aplica según se requiera)
Guayaquil, ___ de ________ de ______


## Señores
## UNIVERSIDAD DE GUAYAQUIL
## Ciudad. -


Como es de vuestro conocimiento, los estudiantes no titulados
__________________________ y  ___________________________, luego de haber realizado su
Proyecto de Integración Curricular cuyo tema es
“______________________________________________________”  en  nuestra  institución
___________________ y dado que para estos fines, se proporcionó información de nuestra base
de  datos y  procesos,  además  de  otros  requerimientos  que  demandaron  los  estudiantes,  creemos
pertinente   solicitar   a   ustedes,   como Institución de Educación Superior Universidad   de
Guayaquil, se nos permita hacer uso de una licencia del módulo o sistema desarrollado por los
estudiantes,  en  retribución  al  trabajo  realizado  y  tiempo  invertido  de  ambas  partes,  dejando  en
claro  que  las  puertas  de  la  empresa  ________________  están  abiertas  para  impulsar  nuevos
desafíos, con miras de hacer innovación tecnológica con sus estudiantes.

Sin  otro  particular,  y  en  espera  de  una  respuesta  favorable  quedamos  de  ustedes  muy
agradecidos.


## Atentamente,



## _____________________________________
Gerente General o Representante Legal
Empresa XYZ
## C.I. N°


## 80


Anexo 12. Evidencias fotográficas adicionales (Opcional)
Las imágenes utilizadas en cualquier trabajo al igual que cualquier otra información, debe ser
citada adecuadamente siguiendo al manual de Estilo APA.
- Evalúe si es necesario la presencia de esa Imagen o foto en su trabajo.
- La imagen debe de ser citada dentro del texto y debe contar con su entrada en las referencias.
- Toda fotografía de menores de edad en cualquier contexto, con cualquier tipo de plano que se
publique en cualquier medio digital debe tener una autorización firmada por los padres o
tutores.
- En caso de que se quiera publicar constantemente fotos de los mismos niños, puedes firmar
un acuerdo abierto con los padres que especifique dónde se van a publicar, durante qué
periodo de tiempo y en qué circunstancias concretas. También podrías agregar algunas
prohibiciones para especificar que no pondrás en riesgo su identidad. Piensa por ejemplo en
la página de Facebook de un centro de cuidado infantil que constantemente sea alimentado
con fotos de los alumnos. Si debes pedir autorización por cada foto seguro tardarás mucho,
pero si puedes pedir a los padres que firmen una carta, a inicio de año cuando inscriban a sus
hijos, en los que aceptan que publicarás fotos únicamente en la página y que solo estarán
relacionadas a las actividades que realizan en el centro.
- Hay que tener mucho cuidado con el tipo de imágenes que se publican porque se trata de una
población vulnerable que puede ser afectada en sus derechos.
- En las leyes de Ecuador se hace referencia a la prohibición de usar imágenes de menores de
edad cuando estos sean víctimas de algún delito.
El Código de la Niñez y Adolescencia y un artículo similar se puede observar en la Ley Orgánica
de Comunicación.

## 81


- Por último, si obligatoriamente necesitas publicar una imagen de la que tienes duda que
puede afectar o no a un niño siempre podrás hacer uso del desenfoque o “blureado” para
ocultar su rostro.
## Ejemplo
## Figura 4
Descripción breve pero completa que explique la imagen o fotografía

Nota: Incluir  una  descripción  de  la  imagen  que  presenta.  Se  puede  enfatizar  el  objetivo que  persigue,  la  fuente  de
donde extrajo la fotografía, la elaboración de la misma citada en formato APA7.





















## 82


Anexo 13. Certificado del Docente-Tutor del Trabajo de Integración Curricular


## 83


Anexo 14. Certificado Porcentaje de Similitud







## 84


Anexo 15. Informe del Docente Revisor



## 85


Anexo 16. Manual técnico










































## 86


Anexo 17. Manual de usuario
























## 87


## NORMAS DE PRESENTACIÓN DEL DOCUMENTO FINAL DEL
## PROYECTO DE INTEGRACIÓN CURRICULAR
La elaboración y presentación del Proyecto de Integración Curricular debe ajustarse a la siguiente
estructura:

## Anexos
## Bibliografía
## Referencias
## Bibliográficas
Capítulo IV
Capítulo III
Capítulo II
## Capítulo I
## Introducción
## Abstract
## Resumen
## Simbología
## Abreviaturas
Índice de Figuras
Índice de Tablas
## Índice General
## Autorización
## Certificado
Cesión de
## Derechos
## Declaración
## Expresa
## Tribunal
## Dedicatoria
Agrad (Opcional)
## Aprob. Tutor(a)
## SENESCYT
## Portada
Comentado [AOYM9]: UG-FCMF-CISC-2020C1-UT-Comisión
"Adaptación de Guías/formatos de Trabajos de Titulación (Tesis) de
## Carrera"
Miembro Responsable de la Comisión: Ing. Ángela Yanza.
Miembros de Comisión: Ing. Alfonso Guijarro, Ing. Lorenzo
## Cevallos.
Contribución del Pasante: Emanuel Santamaría.
Fecha de Creación: 08/Jul/2020.

## 88


El contenido del trabajo de integración curricular deberá considerar imprescindiblemente
las  siguientes  partes:  cuerpo  preliminar,  texto o  capítulos, referencias  bibliográficas  y  anexos,
optativamente  incluirá dedicatoria,  agradecimiento,  bibliografía y  material  complementario.
Además, deberá alinearse a las siguientes disposiciones que norman su formato:
- Adicionalmente, debe entregar 2 ejemplares del Proyecto de Integración Curricular en su
última  versión  en  formato  digitalizado  en  CD,  presentado  de  manera  profesional  con
caratula y portada de disco.
- El CD contendrá los siguientes entregables:
o Trabajo de Titulación (Formatos .docx y .pdf).
o Manual técnico y de usuario (Formatos .docx y .pdf).
o Código Fuente.
o Respaldo de la base de datos (con registros de pruebas).
o Base de datos de análisis (SPSS, Excel, entre otros). Este aspecto aplica de acuerdo con
el proyecto.
o Artículo científico (si aplica).
o Lista de referencias exportadas del gestor bibliográfico (si aplica).
o Instaladores de software de desarrollo del proyecto (Por ejemplo: Frameworks, gestor
de base de datos, entre otros).
- El largo total del Proyecto de Integración Curricular no debe ser inferior a 80 páginas (sin
incluir anexos)
- El Proyecto de Integración Curricular se presentará en 2 ejemplares uno a colores y uno en
blanco y negro.

## 89


- El trabajo debe ser escrito en español, en algunos países es común el uso del papel A4, pero
atención, el tamaño de la hoja recomendado por APA es el tamaño carta; sin embargo, se
utilizará   formato   A4   (210mm   x   297mm)   y   como   regla   general   siempre se
utilizará interlineado doble.
- El tipo de papel Bond de 75 gramos, color blanco, se escribirá en una sola carilla.
- Los títulos de tamaño 14 (centrado) y los subtítulos alineados a la izquierda. Los títulos y
subtítulos ayudan a que los lectores encuentren los puntos clave de un documento. En el
estilo de Normas APA se recomienda el uso de hasta 5 niveles de títulos y subtítulos. Cada
nivel cuenta con un formato propio. (https://normas-apa.org/)
## Atención
- Evite tener solo un subtítulo debajo de un nivel.
- No etiquete los títulos y subtítulos con números o letras.
- Los títulos y subtítulos deben tener interlineado doble.
- No agregue líneas en blanco encima o debajo de los títulos o subtítulos, incluso si cae al
final de una página.
Tipo de Fuentes Recomendadas
Históricamente, las fuentes sin serifa eran utilizadas en trabajos en línea y las fuentes con serifa
para trabajos impresos; sin embargo, hoy día las resoluciones de pantalla modernas acomodan con
nitidez cualquier tipo de fuente. Por lo tanto, en la 7ma (séptima) edición de las Normas APA se
permite una variedad de fuentes en los documentos. Las opciones de fuente incluyen lo siguiente:
Sin serifas
- Calibri de 11 puntos.

## 90


- Arial de 11 puntos.
- Lucida Sans Unicode de 10 puntos.
Con serifas
- Times New Roman de 12 puntos.
- Georgia de 11 puntos.
- Computer Modern normal de 10 puntos (la fuente predeterminada en LaTeX).
Nota: Para el desarrollo de los Trabajos de Titulación de la CISC se utilizará “Times
New Roman de 12 puntos”.
Figuras: Dentro de las imágenes de figuras, es recomendado utilizar una fuente sin serifa con un
tamaño entre 8 y 14 puntos. Para fines del Trabajo de Titulación se empleará Times New Roman
de 10 Puntos.
Código Fuente   (Lenguajes   de Programación): Para   código   fuente,   utilice   una   fuente
monoespaciada como la Lucida Console de 10 puntos o Courier New de 10 puntos.
Notas al Pie de Página: Al insertar notas al pie de página se puede utilizar una fuente más pequeña
que la fuente del texto (y un interlineado diferente).
Ecuaciones Matemáticas: En estos casos es permitido aplicar un interlineado triple o cuádruple.
Ajuste al valor que deje la ecuación visible.
## Márgenes
La  distribución  del  texto  deberá  conservar  los  siguientes  márgenes  en  blanco  de  las  hojas  sin
empastar:
- Margen izquierdo, de 1.5 pulgadas (3.81 cm).
- Lateral derecho, de 2,54 cm.

## 91


- Superior, de 2,54 cm.
- Inferior, de 2,54 cm.
En los inicios de cada capítulo se debe considerar: 3,81 Margen izquierdo, Lateral derecho 2,54,
Superior 3,81, Inferior 2,54 y el resto de la obra (3,81 Margen izquierdo, Lateral Derecho 2,54,
## Superior 2,54, Inferior 2,54).
Todos  las tablas y  figuras,  incluidas  dentro  del  texto  del Proyecto  de  Integración  Curricular
deberán someterse a este formato; es decir, respetando los márgenes aquí señalados. En caso de
requerirse más espacio, las tablas, las figuras y planos en general, deberán incluirse como anexos
al final del Proyecto de Integración Curricular.

El título de cada capítulo se escribirá, centrado, en mayúscula y con negrita y se debe utilizar los
niveles  de  títulos  consecutivamente,  tamaño  14  puntos.  Si su documento  cuenta  con  hasta  tres
niveles  de  títulos,  entonces se utilizará los  tres  primeros  estilos  de  encabezados,  para más
información de los niveles (https://normas-apa.org/formato/titulos-y-subtitulos/)
El primer subtítulo al centro de la página, con letra normal y con negritas, respetando las normas
ortográficas, primero con mayúscula.
El segundo subtítulo, igual que el anterior pero subrayado.
El tercer igual que el anterior, pero el margen izquierdo.

## Nivel Formato
Nivel 1 Centrado • Negrita • Cada Palabra Iniciando en Mayúscula

Texto inicia en nuevo párrafo
## Nivel 2
Alineado a la izquierda • Negrita • Cada Palabra Iniciando en
## Mayúscula

Texto inicia en nuevo párrafo
## Nivel 3
Alineado a la izquierda • Negrita • Cursiva • Cada Palabra
Iniciando en Mayúscula

## 92



Texto inicia en nuevo párrafo
## Nivel 4
Alineado a la izquierda • Negrita • Cada Palabra Iniciando en
Mayúscula • Con sangría de ½ pulgada (1.27 cm) • Con punto
final. Texto inicia en la misma línea
## Nivel 5
Alineado a la izquierda • Negrita • Cursiva • Cada Palabra
Iniciando en Mayúscula • Con sangría de ½ pulgada (1.27 cm)
- Con punto final. Texto inicia en la misma línea


## Numeración
- Los capítulos deben comenzar en una página nueva.
- Las páginas preliminares se numeran con romanos mayúsculas comenzando a contar con
la  página  del  título,  la  misma  que  no  se  numera.  Las  demás  se  numeran  con  símbolos
arábigos.
- El número de la página irá en la derecha inferior, teniendo claro que los números romanos
y arábigos van en la esquina inferior y los arábigos en la parte inferior.
- En  general,  utilice  los  propios  números  para  expresar  los  números  a  partir  de  10,  y  use
palabras para expresar los números del cero al nueve.
Párrafos y Citas
Las citas corresponden a un extracto exacto o parafraseado de ideas o teorías expresadas en otro
documento por otro autor, sea de un libro, artículo, entre otros. Se debe indicar la cita en el texto
de manera que para el lector sea posible recurrir a la fuente principal fácilmente.
Dependiendo del tipo de documento que se esté citando, el formato puede variar, de manera que
se  indican  a  continuación  las  formas  para  hacer  las  citas  dentro  del  cuerpo  del Trabajo de
## Integración Curricular.
Es  importante  que “Toda  cita  que  se  realice  debe  tener  su  correspondiente  referencia
bibliográfica al final del trabajo, caso contrario le marcará plagio su documento”.

## 93


Existen los principales tipos de citas:
- Directa / textuales de las fuentes consultadas.
## • Parafraseadas.
- Indirecta de fuentes secundarias.
La  cita  directa  /  textual, es  cuando  se  toma  la  información textualmente de  forma  directa  del
documento del autor consultado; es decir, usar las mismas palabras originales usadas por el autor
del documento y que usted desea poner en su documento del Proyecto de Integración Curricular.
La cita parafraseada, es cuando se utiliza con palabras propias suyas para expresar la idea del
autor. El texto puede ser igual de extenso que el original y no debe agregarle otras ideas diferentes
a lo que ha tratado de decir el autor del documento.
La cita indirecta, es cuando el autor del documento original que usted ha consultado, este ha
citado  a  otro  autor  en  su  trabajo,  y  se  quiere  tomar  esa  misma  idea  para  el  documento  de  su
Proyecto de Integración Curricular que está redactando. Se debe mencionar la fuente citada por el
otro autor, pero se hace la cita del documento que se está consultando.
Adicionalmente, las citas textuales pueden ser cortas y largas.
Cita corta: No debe exceder de 40 palabras.
Cita larga: Puede exceder más de 40 palabras.
Ejemplo de citas directas / textuales
Hay 4 formas de citas las citas textuales, que se muestran a continuación:
Recuerde que las citas textuales, es el texto con las mismas palabras originales del autor. Las citas
textuales cortas van con “”.
- Cita  textual  de  menos  de  40  palabras  con  énfasis  en  el  autor: Esta  cita  empieza
mencionando al autor, el año, luego el texto del autor y finalmente la página de la fuente.

## 94








Observe como se ve en el ejemplo, al tener una cita de menos de 40 palabras se debe insertar en el
medio del texto. En este caso se tiene una cita con énfasis en el autor, por lo tanto, se lo cita primero
con el apellido y el año del texto citado seguido de una frase o palabra que vincule al autor con la
cita, ejemplo: afirma, concluye, se dice, entre otros. Seguido de la cita textual y finalmente entre
paréntesis el número de la página.
Elementos de la cita:
- Apellido del autor: Solo el primer apellido o el apellido más conocido.
- Año del texto citado: Entre paréntesis va el año en que se publicó el texto citado.
- Cita: Entre comillas dobles se transcribe el texto a citar.
- Página: Al final de la cita, entre paréntesis, se pone la página del libro o artículo que fue
citado. Termina con punto.
## Nota:
(...) esto significa palabras omitidas del texto original del autor y que no considera usted necesario
ponerlo en la cita.
- Cita textual de menos de 40 palabras con énfasis en el texto: Esta cita empieza con el texto
en “”, luego el autor, año y página de la fuente.



## 95















Observe  el  ejemplo,  al  tener  una  cita  de  menos  de  40  palabras  se  debe  insertar  en  el  medio  del
texto. En este caso se tiene una cita con énfasis en el texto; por lo tanto, se lo cita primero el texto
entre  comillas y después de éste, apellido, año y  página separados por  comas y encerrado  entre
paréntesis; se finaliza con un punto seguido.
## Elementos:
- Cita: Entre comillas dobles se escribe el texto original a citar.
- Datos de la cita: Este elemento contiene primero  el apellido del autor (el  primero o más
conocido), segundo el año en que se publicó el texto citado y tercero la página donde se
encuentra el fragmento citado. Estos tres elementos se separan por comas y se encierran
entre paréntesis.
- Cita  textual  con  más  de  40  palabras  con  énfasis  en  el  autor:  Esta  cita  empieza
mencionando al autor, el año, luego el texto del autor y finalmente la página de la fuente.
Con la diferencia que el texto citado no tiene “”.

## 96










Observe como se ve en el ejemplo, al tener una cita de más de 40 palabras se debe insertar aparte
el texto y con sangría (5 espacios o 1,27 cm). En este caso se tiene una cita con énfasis en el Autor;
por lo tanto, antes de comenzar la cita, se coloca el primer apellido del autor o el más conocido,
seguido  del  año  de  la  publicación  entre  paréntesis  y  después  una  frase  o  palabra  que  vincule  al
autor con la cita, ejemplo: afirma, concluye, se dice, entre otros. Finalmente, en un párrafo aparte
se coloca la cita textual sin comillas, terminada con un punto y la página citada.
## Elementos:
- Apellido del autor: Solo el primer apellido o el apellido más conocido.
- Año del texto citado: Entre paréntesis va el año en que se publicó el texto citado.
- Cita:  sin  comillas,  en  un  párrafo  aparte  se  transcribe  el  texto  a  citar,  finaliza  con  punto.
Recuerde la sangría (5 espacios – 1,27 cm) y puede estar justificada.
- Página: Al final de la cita, entre paréntesis, se pone la página del libro o artículo que fue
citado.
## Nota:
En el caso de que no se sepa la fecha en la que se publicó el texto se debe poner “s.f” en vez del
año en la cita en el texto. En la referencia en vez del año se debe poner “Sin fecha”.
Ejemplo: Antes de la cita poner

## 97


Kaku (s.f) afirma que:

Procure que en su Trabajo de Titulación tenga lo más mínimo posible de documentos citados sin
fecha.
- Cita textual de más de 40 palabras con énfasis en el texto: Esta cita empieza mencionando
el texto del autor, luego el apellido, año y página de la fuente.







Como se ve en el ejemplo, al tener una cita de más de 40 palabras se debe insertar aparte de nuestro
texto y con sangría (5 espacios o 1,27 cm). En este caso se tiene una cita con énfasis en el texto,
por lo tanto, primero se pone en un párrafo aparte la cita textual sin comillas, terminada con un
punto y después de éste, apellido, año y página separados por comas y encerrado entre paréntesis.
## Elementos:
- Cita: sin comillas, en un párrafo aparte se transcribe el texto a citar, finaliza con punto.
- Datos de la cita: Este elemento contiene primero  el apellido del autor (el  primero o más
conocido), segundo el año en que se publicó el texto citado y tercero la página donde se
encuentra el fragmento citado. Estos tres elementos se separan por comas y se encierran
entre paréntesis.



## 98


## Nota:
En el caso de que no se sepa la fecha en la que se publicó el texto se debe poner “s.f” en vez del
año en la cita en el texto. En la referencia en vez del año se debe poner “Sin fecha”.
Ejemplo: Al final de la cita poner
(Kaku, s.f)
Procure que en su trabajo de integración curricular tenga lo más mínimo posible de documentos
citados sin fecha.
Ejemplo de citas parafraseadas
Recuerde que estas citas, el texto del autor lo puede expresar usted con sus propias palabras sin
cambiar el sentido del texto que mencionó el autor.
- Basadas  en  el  texto: Empieza  el  texto,  luego  autor  y  termina  con  el  año.  Estas  no  llevan
número de página porque son sus palabras propias que leyó usted del texto original a lo largo
del documento.

- Basadas en el autor: Empieza con el autor, año y termina con el texto parafraseado.

## 99



Reglas según cantidad de autores en las citas.
Las citas deben crearse dependiendo del número de autores como se describe a continuación:
Dos autores
Dependiendo del lenguaje del artículo o documento se debe usar “y” o “&” respectivamente para
unir los nombres de los autores.
Cita textual: Gutiérrez y Rojas (2013).
Cita parafraseada: (Gutiérrez y Rojas, 2013).
Tres a cinco autores
En este caso la primera vez que se hace la cita se debe escribir todos los apellidos de los autores.
Después solo se debe citar al primer autor y se debe agregar “et al.”.
Cita textual: Castiblanco, Gutiérrez y Rojas (2013).
Y la 2da vez que lo cite -> Castiblanco et al. (2013).
Cita parafraseada: (Castiblanco, Gutiérrez y Rojas, 2013).
Y la 2da vez que lo cite -> Castiblanco et al. (2013).
Seis o más autores:
Siempre se cita el apellido del primer autor seguido de “et al.”
Cita textual: Rojas et al. (2013).
Cita parafraseada: (Rojas et al., 2013).

## 100


Ejemplo de citas de fuentes secundarias
Esta cita se basa cuando un autor ha citado a otro en su trabajo, y se quiere tomar esa misma idea
para el documento que se está redactando. Se menciona la fuente citada por el otro autor, pero se
hace la cita del documento que se está consultando, como se muestra a continuación:
Olds (citado en Turkle, 1997) indica que “muchos teóricos de la libido probablemente no sabían
demasiado sobre las máquinas de vapor; realizaron un uso conceptual de las propiedades que les
interesaban” (p.179), considerando esta afirmación...
## Nota:
Al  final  del  trabajo  se  indica  sólo  la  referencia  bibliográfica  del  autor  de  la  fuente  que  se  está
consultando, es decir, la referencia del trabajo de Turkle.
Ejemplo de citas de páginas web: autores corporativos
Es  indispensable,  que  estas  citas  en  su trabajo  de  integración  curricular sean  solo  de  páginas
comerciales de fabricantes de tecnologías informáticas: hardware, software, entre otros.
Más  no  de  blogs  personales  ni  similar  ni  páginas  cualesquiera, eso  le  resta  credibilidad  a  su
Trabajo de Titulación.
La  primera  vez  que  se  cita  se  debe  poner  el  nombre  completo  de  la  institución  o  corporación
seguido de su sigla, en las siguientes referencias basta con citar las siglas.
Cita textual: International Business Machines [IBM] (2013).

Cita parafraseada: (International Boussinesq Machines [IBM], 2013).
Y la 2da vez citada (...) IBM (2013).



## 101


Referencias para la bibliografía
En contraste, una bibliografía funciona como antecedentes de lectura del autor o como
recomendaciones de lecturas adicionales al lector y puede incluir notas descriptivas. Es decir, en
una bibliografía puedes incluir trabajos que de alguna manera influenciarán en el texto que
escribiste.
La lista de referencia debe estar escrita a doble espacio y deben tener una sangría francesa.
Debido a que una lista de referencias incluye solo referencias que tengan datos recuperables, no
debes incluir comunicaciones personales, como cartas, correos electrónicos, etc. En su lugar, cite
las comunicaciones personales solo en texto de tu artículo.
Los datos para redactar la cita se tomarán del documento original al que se refieren, y se
extraerán principalmente de la portada.
Los elementos de una referencia generalmente son: autor, año de publicación, título y datos de la
publicación (lugar y editorial).
Los subtítulos se pueden incluir tras el título, separados por dos puntos y espacio.
Si tienes que referenciar textos del mismo autor se tienen que leer en orden de publicación: de la
más antigua a la más reciente y si tienen la misma fecha de publicación, en orden alfabético
según el título de la obra
La lista de referencias debe ir en orden alfabético, a doble espacio y con sangría en las entradas.
Cada entrada de referencia llevará sangría francesa (la primera línea se orienta hacia la izquierda
y las líneas siguientes poseen sangría).
Consideraciones generales para los Autores
Nombres: se deben anotar los apellidos, se indican sólo las iniciales para el primer y segundo
nombre.

## 102


Cuando hay varios autores, éstos se separan con coma.
Cuando se va a anotar el último autor, se hace con la letra “y” en lugar de la coma. Por ejemplo:
Fuentes, L. R., Ugalde, M. y Ramírez, P.
Consideraciones generales acerca del DOI
¿Qué es el DOI?
DOI (Digital Object Identifier)
Es  el  número  de  identificación  utilizado  en  publicaciones  científicas  para  localizarlas  más
rápidamente en los sistemas de información digitales.
Los documentos con DOI deben estar en la referencia el código respectivo.
Ejemplos de referencias para el Trabajo de Titulación
Artículo de periódico
## Patrón
Autor. (Año, Mes Día). Título del artículo. Título del periódico, pp. xx-xx, Número o nombre de
la Sección.
## Ejemplo
Bodipo-Memba, A. (2007, febrero 21). AT & T, GM se compromete a donar $1000 millones para
el pacto de las telecomunicaciones. Detroit Free Press. p. 7B, Economía, finanzas y negocios.

Ejemplo de referencia
Carreño, L. (9 de febrero de 2020). La disputa gremial por los aranceles a las prendas de
vestir. El Espectador. https://www.elespectador.com/economia/la-disputa-gremial-por-los-
aranceles-las-prendas-de-vestir-articulo-903768

Artículo de periódico en línea
## Patrón
Autor. (Año, Mes Día). Título del artículo. Título del periódico, Recuperado de http://xxxx
## Ejemplo

## 103


Agüero,  M.  (2010,  setiembre  7).  Acceso  a  Internet  es  un  derecho  fundamental. La  Nación.
Recuperado  de  http://www.nacion.com/2010-09-
08/ElPais/NotasSecundarias/ElPais2514038.aspx

Artículo de revista impresa
## Patrón
Autor. (Año de publicación). Título del artículo. Título de la revista, Volumen (Número), Número
de página inicial y final.

## Ejemplo
Silva, L. (2007). Epistemológicas y desafíos teóricos por el poder y la política en el estudio de los
sistemas de información. Información Systems Journal, 17(2), 165183.

Artículo de revista obtenido de bases de datos con DOI
## Patrón
Autor.  (mes,  año  de  publicación).  Título  del  artículo.  Título  de  la  revista, Volumen  (Número),
Número de página inicial y final. DOI:xxxx
## Ejemplo
Vaida,  V.  (2011).  Perspective:  Water  cluster  mediated  atmospheric  chemistry. Journal  of
Chemical Physics, 135(2), 209-221. doi:10.1063/1.3608919


Artículo de revista obtenido de bases de datos sin DOI
## Patrón
Autor. (mes, año de publicación). Título del artículo. Título de la revista,
Volumen (Número), Número de página inicial y final. Recuperado de http://xxx (Número
de acceso) [si la base lo provee]
## Ejemplo
Barcelona, R. y Rockey, D. (abril, 2010). Uso de Tecnologías de Aprendizaje Colaborativo
para facilitar grupo eficaz de trabajo. Journal of Physical Education, Recreation & Dance,
81(4), 12-14. Recuperado de http://web.ebscohost.com/ehost/detail?.... (Número de acceso:
## 2011130951).

Capítulo de libro electrónico, en base de datos
## Patrón

## 104


Autor del capítulo. (Año de publicación). Título del capítulo. En Apellido del autor,
Inicial del nombre, Título del libro (pp. xx-xx). Recuperado de http://xxx

## Ejemplo
Domingo Curto, J. M. (2005). Parte IV: cultura, cognición y autoconsciencia. En Domingo,
Curto, J. M., La cultura en el laberinto de la mente: aproximación filosófica a la “psicología
cultural”    de    Jerome    Bruner (pp. 296-379). Recuperado de
http://site.ebrary.com/lib/sibdilibrosp/docDetail.action?docID=10102380

Capítulo de libro electrónico en línea con DOI
## Patrón
Autor. (Año de publicación). Título del capítulo. En Apellido del autor, Inicial del nombre. Título
del libro (pp. xx-xx). Recuperado de doi: xxx

## Ejemplo
Gray-Davidson,  F.  (1999).  Chapter  7  Dealing  with  difficult  problems.  En  Gray-Davidson, F.,
Alzheimer's Disease: Frequently Asked Questions (pp. 103-138). doi: 10.1036/0737300795

Capítulo de libro electrónico en línea sin DOI
## Patrón
Autor. (Año de publicación). Título del capítulo. En Apellido del autor, Inicial del nombre. Título
del libro (pp. xx-xx). Recuperado de http://xxx
## Ejemplo
Benítez  Burraco,  A.  (2005).  Capítulo  5  Cultivos  transgénicos:  mejora  biotecnológica  de  las
prácticas agrícolas desde el punto de vista medioambiental. En Benítez Burraco, A., Avances
recientes en biotecnología vegetal e ingeniería genética de plantas (pp. 97-140). Recuperado
de http://goo.gl/6iVAEW

Libro impreso
## Patrón
Autor. (Año de publicación). Título del libro. Lugar de publicación: Editorial.

## Ejemplo
Melkman, A. (2006). Planificación estratégica de los clientes. Londres, Reino Unido: Thorogood.

Capítulo de libro impreso

## 105


Libro completo, versión impresa
Herrera Cáceres, C. y Rosillo Peña, M. (2019). Confort y eficiencia energética en el diseño de
edificaciones. Universidad del Valle.
Versión electrónica de la versión impresa
Herrera Cáceres, C. y Rosillo Peña, M. (2019). Confort y eficiencia energética en el diseño de
edificaciones. Universidad del Valle. https://www.reddebibliotecas.org.co/
Libro disponible sólo en formato electrónico
Panza, M. (2019). Números: elementos de matemáticas para filósofos. Universidad Del Valle.
https://www.reddebibliotecas.org.co/.
Tesis o monografía
Manrique Gómez, A. S. (2013). Gentrificación de La Candelaria (Bogotá D.C). Agentes y
estrategias intervinientes [Monografía]. http://bdigital.unal.edu.co/11605/.

Informes técnicos y de investigación
## Patrón
Autor. (Año de publicación). Título del trabajo (Informe No. ##). Lugar: Editorial.

## Ejemplo
Virginio,  E.  (2014). Agroforestería  sostenible  en  la  amazonía  ecuatoriana (Informe  No.  398).
Turrialba, C.R.: CATIE.

Trabajos Finales de Graduación en línea
## Patrón
Autor.  (Año  de  publicación). Título  de  la  tesis (Disertación  de  doctorado o Tesis  de  maestría,
Nombre de la universidad). Recuperado de http://xxx

## Ejemplo
Vital de Almeida, R. (2006). El consentimiento y su relevancia para la teoría jurídica del delito
(Tesis de doctorado, Universidad de Granada). Recuperado de
http://hera.ugr.es/tesisugr/16430190.pdf

Trabajos Finales de Graduación publicada en base de datos
## Patrón

## 106


Autor.  (Año  de  publicación). Título  de  la  tesis (Disertación  de  doctorado o Tesis  de  maestría).
Recuperado de [nombre de la base de datos] (número de acceso).
## Ejemplo
Gutiérrez, J. M. (1984). Isolation, partial characterization, and pathologic effects of a myotoxin
from  bothrops  asper  venom  (snake,  myonecrosis,  regeneration) (Disertación  de  doctorado).
Recuperado de ProQuests Dissertations & Theses
(Publication No. AAT 8427667)

Trabajos Finales de Graduación sin publicar
## Patrón
Autor. (Año de publicación). Título de la tesis (Disertación de doctorado sin publicar o Tesis de
maestría sin publicar). Nombre de la universidad, Lugar.

## Ejemplo
Lomonte Vigliotti, B. (1986). Estudios inmunoquimicos y de neutralizacion sobre una miotoxina
del veneno de bothrops asper de Costa Rica (Tesis de maestría sin publicar). Universidad de Costa
Rica, San José, C.R.

## Notas
Las notas correspondientes, si van como pie de página deberán separarse del texto mediante una
raya  horizontal  de  30  mm.  Desde  el  margen  izquierdo,  dejando  tres  espacios  libres  después  del
último renglón del texto.
Las notas deben escribirse a espacio simple, sin invadir el margen inferior de la página. Entre una
nota y otra, deberá haber doble espacio.
## Ilustraciones
Las  ilustraciones  utilizadas  para  la  comprensión  de  un  texto  pueden  ser  fotografías  y  dibujos,
mapas, cronología y cuadros sinópticos, tablas y gráficos, etc.
Estas ilustraciones estarán encuadradas dentro de los márgenes aquí establecidos, sin pliegues ni
relieves. Deberá evitarse en lo posible, las hojas dobladas y el uso de bolsillo en la contraportada
posterior del Proyecto de Integración Curricular.

## 107


Todas las ilustraciones deberán ir tituladas y numeradas dentro de los márgenes establecidos)
## Mapas
Los  mapas  y  las  tablas  deberán  numerarse  con  números  romanos;  las  demás  ilustraciones  con
números arábigos. Al pie de la ilustración deberá constar siempre la fuente o referencia al original,
de ser el caso.
Bibliografía consultada de la norma APA 7ma edición para el presente documento de la guía
del Proyecto de Integración Curricular.
American   Psychological   Association.   (2010).   Manual   de   publicaciones   de   la   American
Psychological Association (3.ª ed.). México, D. F.: El Manual Moderno.
Biblioteca  de  la  Universidad  de  Alcalá.  (2016).  Referencias  bibliográficas.  Recuperado  de
https://biblioteca.uah.es/investigacion/documentos/Ejemplos-apa-buah.pdf
Biblioteca  de  la  Universidad  de  Sevilla  (2014).  Guías  de  la  BUS:  Herramientas  y  guías  para
encontrar  y  gestionar  la  información.  Recuperado  el  12  abril  2018,  de http://guiasbus.us.es/
bibliografiaycitas/apa
Meléndez, M. E. (2013). Citar fuentes según APA: formas generales. Recuperado de Universidad
Interamericana de Puerto Rico. Recinto de Ponce:
http://ponce.inter.edu/cai/manuales/Citar_fuentes_APA_6ta.pdf
Silva Ramírez, B. (Coord.) y Juárez Aguilar, J. (2013):  Manual del modelo de documentación de
la  Asociación  de  Psicología  Americana  (APA)  en  su  sexta  edición:  México,  Puebla:  Centro  de
Lengua y Pensamiento Crítico UPAEP.
