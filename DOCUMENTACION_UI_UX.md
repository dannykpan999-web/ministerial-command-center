# Plataforma IA Ministerial - Centro de Comando
## Documentación de Interfaz de Usuario (UI/UX)

---

## 1. Resumen Ejecutivo

La **Plataforma IA Ministerial** es un sistema integral de gestión documental diseñado para operaciones gubernamentales y ministeriales. La plataforma ofrece una interfaz moderna, intuitiva y completamente funcional que permite gestionar documentos, expedientes, plazos, firmas electrónicas y más.

### Tecnologías Utilizadas
- **Framework**: React 18 con TypeScript
- **Diseño**: Tailwind CSS + shadcn/ui
- **Construcción**: Vite
- **Iconografía**: Lucide React

### Características Principales
- Diseño responsive (adaptable a móvil, tablet y escritorio)
- Soporte multiidioma (Español, Inglés, Francés, Ruso, Chino)
- Modo oscuro/claro
- Sistema de notificaciones en tiempo real
- Interfaz institucional con paleta de colores profesional

---

## 2. Estructura de Navegación

### 2.1 Barra Lateral (Sidebar)
La navegación principal se organiza en las siguientes secciones:

| Sección | Descripción |
|---------|-------------|
| **Dashboard** | Panel principal con KPIs y acciones rápidas |
| **Bandeja de Entrada** | Documentos recibidos (correspondencia entrante) |
| **Bandeja de Salida** | Documentos enviados (correspondencia saliente) |
| **Expedientes** | Gestión de casos y expedientes |
| **Plazos** | Calendario y alertas de vencimientos |
| **Asistente IA** | Chat con inteligencia artificial |
| **Multimedia** | Procesamiento de archivos (OCR, transcripción) |
| **Firma Digital** | Flujos de firma electrónica |
| **Archivo** | Documentos archivados por entidad |
| **Contenido** | Gestión de artículos y publicaciones |
| **Auditoría** | Registro de actividades del sistema |
| **Configuración** | Ajustes del sistema |

### 2.2 Barra Superior (TopBar)
Incluye las siguientes funcionalidades:
- **Búsqueda global** con atajo de teclado (⌘K)
- **Selector de idioma** (5 idiomas disponibles)
- **Toggle de modo oscuro/claro**
- **Centro de notificaciones** con contador de no leídas
- **Menú de usuario** con perfil y opciones

---

## 3. Páginas Implementadas

### 3.1 Dashboard (Panel Principal)
**Ruta**: `/`

**Funcionalidades:**
- 5 tarjetas KPI mostrando métricas clave:
  - Entradas del día
  - Salidas del día
  - Expedientes abiertos
  - Plazos próximos
  - Firmas pendientes
- Botones de acciones rápidas:
  - Registrar Entrada
  - Registrar Salida
  - Crear Expediente
  - Subir Escaneado
  - Preguntar a IA
- Sección de actividad reciente
- Alertas urgentes con vencimientos próximos
- Estados de carga con skeleton loaders

---

### 3.2 Bandeja de Entrada
**Ruta**: `/inbox`

**Funcionalidades:**
- Tabla de documentos con 6 columnas:
  - Checkbox de selección
  - Número correlativo
  - Título del documento
  - Entidad (con código de color)
  - Estado (badge visual)
  - Fecha de recepción
- Búsqueda por texto
- Filtros por entidad y estado
- Acciones en lote (selección múltiple)
- Menú contextual por documento:
  - Abrir expediente
  - Asignar responsable
  - Crear plazo
  - Enviar a IA
  - Enviar a firma
- Estado vacío con mensaje y acción

---

### 3.3 Bandeja de Salida
**Ruta**: `/outbox`

**Funcionalidades:**
- Tabla de documentos salientes
- Búsqueda y filtro por entidad
- Botón "Generar borrador con IA"
- Estados específicos: Borrador, En Revisión, Enviado, Archivado
- Acciones: Ver, Editar, Enviar a firma

---

### 3.4 Expedientes (Casos)
**Ruta**: `/cases`

**Funcionalidades:**
- Vistas guardadas (Urgentes, Pendientes de Firma)
- Tabla con información:
  - Número de expediente
  - Título
  - Entidad
  - Responsable
  - Estado
  - Prioridad (con colores: Baja, Media, Alta, Urgente)
- Navegación a detalle al hacer clic

---

### 3.5 Detalle de Expediente
**Ruta**: `/cases/:id`

**Funcionalidades:**
- Navegación con botón "Volver"
- 5 pestañas de información:

| Pestaña | Contenido |
|---------|-----------|
| **Resumen** | Información general + Estadísticas |
| **Documentos** | Lista de documentos asociados |
| **Plazos** | Vencimientos relacionados |
| **Firma** | Flujo de firma con firmantes |
| **Historial** | Línea de tiempo de auditoría |

---

### 3.6 Plazos y Vencimientos
**Ruta**: `/deadlines`

**Funcionalidades:**
- Toggle entre vista de Lista y Calendario
- Ordenamiento automático por urgencia (Vencido > Urgente > Próximo)
- Tarjetas de plazo con:
  - Icono de estado
  - Título y expediente relacionado
  - Fecha de vencimiento
  - Responsable asignado
- Vista de calendario mensual interactivo
- Panel de reglas de alerta activas

---

### 3.7 Asistente de IA
**Ruta**: `/ai-assistant`

**Funcionalidades:**
- Interfaz de chat conversacional
- 5 modos de operación:
  - Resumir documento
  - Generar borrador de respuesta
  - Extraer puntos clave
  - Traducir contenido
  - Preparar memorando
- Selector de tono (Formal, Muy Formal, Nota Interna)
- Visualización de fuentes consultadas
- Acciones: Copiar respuesta, Insertar en borrador
- Indicador de carga animado
- Aviso de revisión de contenido IA

---

### 3.8 Multimedia
**Ruta**: `/multimedia`

**Funcionalidades:**
- Área de carga drag-and-drop
- Lista de archivos multimedia con iconos por tipo:
  - Audio (transcripción)
  - Video (transcripción)
  - Imagen (OCR)
- Estados de procesamiento:
  - En cola
  - Procesando (con barra de progreso)
  - Completado
  - Error
- Panel de resultados mostrando:
  - Transcripción para audio/video
  - Texto extraído para imágenes
- Acciones: Descargar, Crear documento

---

### 3.9 Firma Digital
**Ruta**: `/signature`

**Funcionalidades:**
- 3 pestañas con contadores:
  - Pendientes
  - Firmados
  - Rechazados
- Tarjetas de flujo de firma con:
  - Documento relacionado
  - Estado visual
  - Firmante principal y alterno
  - Lista de validadores
- Panel de integridad mostrando:
  - Hash del documento
  - Marca de tiempo
  - Versión
  - Código QR
- Botones de acción: Firmar / Rechazar

---

### 3.10 Archivo Digital
**Ruta**: `/archive`

**Funcionalidades:**
- Vista de carpetas por entidad con:
  - Código de color de la entidad
  - Nombre de la entidad
  - Contador de documentos
- Navegación tipo explorador de archivos
- Breadcrumb de navegación con botón "Volver"
- Búsqueda dentro de carpetas
- Lista de documentos archivados con:
  - Título y número correlativo
  - Fecha de creación
  - Responsable
  - Etiquetas
- **Visor de documentos** (Dialog modal):
  - Pestaña "Vista previa" con contenido del documento
  - Pestaña "Metadatos" con información detallada
  - Botón de descarga PDF
- Estado vacío cuando no hay documentos

---

### 3.11 Gestión de Contenido
**Ruta**: `/content`

**Funcionalidades:**
- Panel de estadísticas:
  - Artículos publicados
  - Pendientes de aprobación
  - Borradores
- Lista de artículos con:
  - Título
  - Sector
  - Estado (Publicado, Pendiente, Borrador)
  - Autor
  - Fecha de actualización
- Acciones: Ver, Editar, Eliminar
- **Vista de detalle de artículo**:
  - Renderizado de Markdown (títulos, listas, citas, negritas)
  - Sección de fuentes
  - Botones de edición y publicación
- **Editor de artículos** (Dialog modal):
  - Barra de herramientas (Negrita, Cursiva, Listas, Enlaces, Imágenes)
  - Campo de título
  - Área de contenido con soporte Markdown
  - Selector de sector
  - Campo de fuentes
  - Acciones: Guardar borrador, Enviar para aprobación

---

### 3.12 Auditoría
**Ruta**: `/audit`

**Funcionalidades:**
- Lista cronológica de eventos
- Búsqueda por texto
- Filtro por tipo de acción
- Tarjetas compactas mostrando:
  - Icono según tipo de acción
  - Nombre de la acción
  - Detalles
  - Usuario que realizó la acción
  - Marca de tiempo
- Botón de exportar reporte

---

### 3.13 Configuración
**Ruta**: `/settings`

**Funcionalidades organizadas en 4 pestañas:**

#### Pestaña Roles
- Matriz de permisos visual con íconos
- 4 roles predefinidos:
  - Administrador (todos los permisos)
  - Gabinete (lectura, escritura, firma)
  - Revisor (lectura, escritura)
  - Lector (solo lectura)

#### Pestaña Plantillas
- Lista de plantillas de documentos:
  - Oficio formal estándar
  - Memorando interno
  - Circular informativa
  - Respuesta a solicitud
- Iconos y colores por tipo de documento
- Acciones: Editar, Duplicar, Eliminar
- **Editor de plantillas** con:
  - Campo de nombre
  - Selector de tipo
  - Área de contenido con variables `{{variable}}`
  - Detección automática de variables
  - Referencia de variables disponibles

#### Pestaña Idioma
- Selector de idioma de interfaz (5 opciones)
- Selector de zona horaria (4 opciones)

#### Pestaña Alertas
- Toggles configurables:
  - Recordar 48h antes del vencimiento
  - Escalar plazos vencidos
  - Notificaciones por correo
  - Resumen diario

---

## 4. Componentes Globales

### 4.1 Centro de Notificaciones
**Ubicación**: Barra superior (icono de campana)

**Funcionalidades:**
- Contador de notificaciones no leídas
- Panel desplegable con lista de notificaciones
- 4 tipos de notificación:
  - Plazos (icono reloj)
  - Firmas pendientes (icono pluma)
  - Documentos nuevos (icono documento)
  - Sistema (icono configuración)
- Formato de tiempo relativo ("Hace 1h", "Hace 2 días")
- Marcar todo como leído
- Indicador visual de no leída
- Navegación al hacer clic

---

### 4.2 Perfil de Usuario
**Ubicación**: Menú de usuario en barra superior

**Funcionalidades:**
- Información del usuario:
  - Nombre completo
  - Correo electrónico
  - Rol con icono de escudo
- Campos editables (nombre, correo)
- Tarjeta de estadísticas:
  - Documentos procesados
  - Expedientes gestionados
  - Firmas realizadas
- Botones: Cancelar, Guardar cambios

---

### 4.3 Modo Oscuro/Claro
**Ubicación**: Barra superior (icono luna/sol)

**Funcionalidades:**
- Toggle instantáneo entre temas
- Paleta de colores completa para modo oscuro
- Persistencia visual en todos los componentes

---

### 4.4 Búsqueda Global
**Ubicación**: Barra superior

**Funcionalidades:**
- Atajo de teclado ⌘K (Ctrl+K en Windows)
- Paleta de comandos con categorías:
  - Documentos (con número correlativo)
  - Expedientes (con número de caso)
- Navegación directa al seleccionar

---

## 5. Diseño Visual

### 5.1 Paleta de Colores

| Color | Uso | Código HSL |
|-------|-----|------------|
| **Navy Primario** | Acciones principales, sidebar | 213 50% 23% |
| **Dorado Acento** | Destacados, hover states | 38 90% 50% |
| **Verde Éxito** | Estados completados, positivos | 152 60% 40% |
| **Amarillo Alerta** | Advertencias, plazos próximos | 38 92% 50% |
| **Rojo Error** | Errores, plazos vencidos | 0 72% 51% |
| **Azul Info** | Información, enlaces | 200 80% 50% |

### 5.2 Tipografía
- **Sans-serif**: Inter (interfaz general)
- **Serif**: Newsreader (contenido de documentos)

### 5.3 Componentes UI Reutilizables
- **KPI Cards**: Tarjetas de métricas con icono, valor y tendencia
- **Status Badge**: Etiquetas de estado con colores semánticos
- **Page Header**: Encabezado de página con título, descripción y acción
- **Empty State**: Estado vacío con icono, título y acción sugerida
- **Data Table**: Tabla de datos con skeleton loader
- **Timeline**: Línea de tiempo para historial

---

## 6. Responsive Design

La plataforma se adapta a diferentes tamaños de pantalla:

| Dispositivo | Comportamiento |
|-------------|----------------|
| **Desktop** (1024px+) | Layout completo con sidebar expandido |
| **Tablet** (768px-1023px) | Sidebar colapsable, tablas scrollables |
| **Móvil** (<768px) | Sidebar oculto, diseño de una columna |

---

## 7. Internacionalización (i18n)

### Idiomas Soportados
1. Español (predeterminado)
2. English
3. Français
4. Русский
5. 中文

### Elementos Traducidos
- Navegación y menús
- Etiquetas de formularios
- Mensajes de estado
- Tooltips y ayudas
- Notificaciones del sistema

---

## 8. Estados de Carga

Todos los componentes con datos asíncronos incluyen:
- **Skeleton loaders** animados
- Indicadores de progreso donde aplica
- Mensajes de estado vacío
- Manejo de errores con feedback visual

---

## 9. Accesibilidad

- Navegación por teclado completa
- Focus states visibles
- Etiquetas ARIA donde corresponde
- Contraste de colores WCAG 2.1
- Textos alternativos para iconos

---

## 10. Próximos Pasos Sugeridos

### Integraciones Pendientes
- [ ] Conexión con API backend real
- [ ] Autenticación y autorización
- [ ] Almacenamiento de documentos
- [ ] Servicios de firma digital
- [ ] Motor de IA para asistente

### Mejoras Opcionales
- [ ] Exportación a PDF/Excel
- [ ] Notificaciones push
- [ ] Modo offline
- [ ] Personalización de dashboard
- [ ] Reportes avanzados

---

## 11. Contacto y Soporte

**Desarrollado por**: [Nombre del desarrollador]
**Fecha de entrega**: Enero 2026
**Versión**: 1.0.0

---

*Este documento describe la implementación completa de la interfaz de usuario del Centro de Comando Ministerial. Todas las funcionalidades descritas están completamente implementadas y listas para demostración.*
