# Guía Completa de Pruebas - Sistema de Centro de Mando Ministerial
## República de Guinea Ecuatorial - Ministerio de Transportes

**Versión**: 1.2
**Fecha**: 8 de febrero de 2026
**Última Actualización**: Secciones 1.12, 1.14 y flujo de workflow actualizadas con características desplegadas
**Propósito**: Guía paso a paso para probar todas las funcionalidades del sistema

---

## 📋 Índice

1. [Información General](#información-general)
2. [Requisitos Previos](#requisitos-previos)
3. [Acceso al Sistema](#acceso-al-sistema)
4. [Pruebas por Módulo](#pruebas-por-módulo)
5. [Verificación de Características Avanzadas](#verificación-de-características-avanzadas)
6. [Solución de Problemas](#solución-de-problemas)
7. [Lista de Verificación Final](#lista-de-verificación-final)

---

## 📖 Información General

### Estado del Proyecto
- **Completitud**: 90% (38 de 40 características)
- **Fases Completadas**: Fases 1A, 1B, 2, 3, 4, 5 y 6
- **Estado de Producción**: Listo para UAT (Pruebas de Aceptación de Usuario)
- **Servidor VPS**: http://72.61.41.94

### Características Principales
El sistema incluye **38 características completas** organizadas en 6 módulos:

1. **Gestión de Documentos** (15 características)
2. **Flujos de Trabajo** (8 características)
3. **Automatización** (5 características)
4. **Inteligencia Artificial** (3 características)
5. **Seguridad y Auditoría** (4 características)
6. **Interfaz de Usuario** (3 características)

---

## 🔧 Requisitos Previos

### Navegadores Compatibles
- ✅ Google Chrome 90+ (Recomendado)
- ✅ Mozilla Firefox 88+
- ✅ Microsoft Edge 90+
- ✅ Safari 14+ (macOS)

### Credenciales de Prueba

#### Usuario Administrador
- **Email**: `admin@ministerio.gq`
- **Contraseña**: `Admin123!`
- **Rol**: ADMIN
- **Permisos**: Acceso completo a todas las funciones

#### Usuario Gabinete (Ministro)
- **Email**: `ministro@ministerio.gq`
- **Contraseña**: `Ministro123!`
- **Rol**: GABINETE
- **Permisos**: Firma de documentos, revisión, aprobación

#### Usuario Revisor
- **Email**: `revisor@ministerio.gq`
- **Contraseña**: `Revisor123!`
- **Rol**: REVISOR
- **Permisos**: Revisión de documentos, correcciones

#### Usuario Lector
- **Email**: `lector@ministerio.gq`
- **Contraseña**: `Lector123!`
- **Rol**: LECTOR
- **Permisos**: Solo lectura de documentos asignados

### Archivos de Prueba Recomendados
Prepare los siguientes archivos antes de comenzar:
- 📄 Documento PDF (ejemplo: oficio_prueba.pdf)
- 📄 Documento Word (ejemplo: memo_prueba.docx)
- 🖼️ Imagen con texto (ejemplo: documento_escaneado.jpg)
- 📁 Archivo grande (10-20 MB para probar límites)

---

## 🚪 Acceso al Sistema

### Paso 1: Abrir la Aplicación

1. Abra su navegador web
2. Navegue a: **http://72.61.41.94**
3. Debería ver la pantalla de inicio de sesión con el logo del Ministerio

### Paso 2: Iniciar Sesión

1. Ingrese el email de usuario de prueba
2. Ingrese la contraseña correspondiente
3. Haga clic en **"Iniciar Sesión"**
4. ✅ **Resultado Esperado**:
   - Redirección a la pantalla principal (Buzón de Entrada)
   - Barra lateral visible con opciones de menú
   - Nombre de usuario en la esquina superior derecha

### Paso 3: Verificar Acceso

**Prueba de Navegación Básica**:
- ✅ Haga clic en "Buzón de Entrada" → Debería mostrar documentos entrantes
- ✅ Haga clic en "Buzón de Salida" → Debería mostrar documentos salientes
- ✅ Haga clic en "Expedientes" → Debería mostrar expedientes/casos
- ✅ Haga clic en "Archivo" → Debería mostrar documentos archivados
- ✅ Haga clic en "Auditoría" → Debería mostrar registro de actividad (solo ADMIN)

**Nota**: El menú dice "Expedientes" (no "Casos"). Ambos términos se refieren a la misma funcionalidad.

---

## 🧪 Pruebas por Módulo

## MÓDULO 1: Gestión de Documentos (15 Características)

### 1.1 Crear Documento Entrante

**Objetivo**: Verificar que se pueden crear documentos entrantes correctamente.

**Pasos**:
1. Inicie sesión como **ADMIN** o **GABINETE**
2. Vaya a **"Nueva Entrada"** en el menú lateral
3. Complete el formulario:
   - **Número de Documento**: `025-MT-001-TEST`
   - **Asunto**: `Documento de Prueba - Entrada`
   - **Remitente**: `Ministerio de Educación`
   - **Fecha de Recepción**: Seleccione la fecha actual
   - **Tipo**: `INCOMING` (Entrante)
   - **Prioridad**: `URGENT` (Urgente)
   - **Departamento**: Seleccione un departamento
4. Suba un archivo PDF de prueba
5. Haga clic en **"Crear Documento"**

**✅ Resultado Esperado**:
- Mensaje de éxito: "Documento creado exitosamente"
- Redirección a la vista de detalles del documento
- El documento aparece en "Buzón de Entrada"
- El archivo está adjunto y se puede descargar

---

### 1.2 Subir y Descargar Archivos

**Objetivo**: Verificar carga y descarga de archivos.

**Pasos para Subir Archivos**:
1. En el documento creado, haga clic en **"Ver Detalles"**
2. En la sección "Archivos Adjuntos", haga clic en **"Agregar Archivo"**
3. Seleccione un archivo (PDF, Word, Excel, PowerPoint, imágenes)
4. Haga clic en **"Subir"**
5. Espere a que se complete la carga

**Pasos para Descargar Archivos**:
1. En la lista de archivos adjuntos, localice el archivo
2. Haga clic en el botón de **descarga** (icono de flecha hacia abajo) junto al archivo
3. El archivo se descargará a su carpeta de Descargas
4. Verifique que el archivo descargado se abre correctamente

**Formatos Soportados**:
- 📄 Documentos: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
- 🖼️ Imágenes: JPG, JPEG, PNG, GIF
- 📁 Otros: TXT, CSV, ZIP

**✅ Resultado Esperado**:
- Los archivos se suben exitosamente
- Barra de progreso muestra el avance de carga
- Los archivos aparecen en la lista de adjuntos con nombre y tamaño
- La descarga funciona correctamente para todos los tipos de archivo
- El nombre del archivo original se preserva
- No hay errores 404 al descargar

**Límites a Probar**:
- ✅ Archivos hasta 50 MB deben subirse correctamente
- ❌ Archivos mayores a 50 MB deben mostrar error de tamaño
- ⚠️ Si la descarga falla con error 404, actualice la página y vuelva a intentar

---

### 1.3 Versionado de Archivos

**Objetivo**: Verificar que se pueden reemplazar archivos manteniendo historial.

**Pasos**:
1. En el documento, seleccione un archivo adjunto
2. Haga clic en **"Reemplazar Archivo"**
3. Seleccione una nueva versión del archivo
4. Agregue un comentario: "Versión actualizada con correcciones"
5. Haga clic en **"Reemplazar"**
6. Haga clic en **"Ver Historial de Versiones"**

**✅ Resultado Esperado**:
- El archivo se reemplaza exitosamente
- El historial muestra 2 versiones
- Cada versión tiene fecha, hora y comentario
- Se puede descargar cualquier versión anterior
- El tamaño de cada versión se muestra correctamente

---

### 1.4 Conversión de Office a PDF

**Objetivo**: Verificar conversión de archivos Office a formato PDF.

**Formatos Soportados**:
- ✅ Word (.doc, .docx) → PDF
- ✅ Excel (.xls, .xlsx) → PDF
- ✅ PowerPoint (.ppt, .pptx) → PDF
- ❌ PDF → Word (NO soportado por limitación de LibreOffice)

**Pasos**:
1. Suba un archivo Word, Excel o PowerPoint al documento
2. En la lista de archivos, haga clic en el menú (⋮) del archivo
3. Haga clic en **"Convertir a PDF"**
4. Espere la conversión (puede tardar 5-10 segundos)
5. El archivo PDF convertido aparecerá automáticamente en la lista
6. Descargue el archivo PDF generado haciendo clic en su nombre

**✅ Resultado Esperado**:
- Archivo Office se convierte a PDF preservando formato
- El archivo PDF aparece en la lista de archivos adjuntos
- El archivo convertido se puede descargar correctamente
- Notificación de éxito aparece: "Archivo convertido exitosamente"
- La conversión mantiene el contenido y formato básico

**⚠️ Notas Importantes**:
- La conversión desde PDF a otros formatos NO está soportada
- La conversión puede no ser perfecta para documentos con formato muy complejo
- Asegúrese de que el archivo original esté bien formateado

---

### 1.5 Extracción de Texto OCR (Automático)

**Objetivo**: Verificar extracción automática de texto de imágenes/PDFs escaneados.

**🔄 Cómo Funciona**:
La extracción OCR ocurre **automáticamente** durante la carga de archivos usando OpenAI Vision API. El texto extraído se muestra inmediatamente después de la carga en una tarjeta verde.

**Pasos para Probar OCR**:
1. Vaya a un documento → **"Ver Detalles"**
2. En la sección **"Archivos Adjuntos"**, haga clic en **"Agregar Archivos"**
3. Seleccione y suba una imagen con texto visible (JPG, PNG) o PDF escaneado
4. Haga clic en **"Subir X archivo(s)"**
5. Espere 10-20 segundos mientras se procesa
6. Una tarjeta verde **"Texto Extraído (OCR)"** aparecerá automáticamente
7. Revise el texto extraído en el área de texto
8. Use el botón **"Copiar Texto"** para copiar al portapapeles

**✅ Resultado Esperado**:
- ✅ Mensaje de éxito: "OCR completado: XXX caracteres extraídos"
- ✅ Tarjeta verde con el título **"Texto Extraído (OCR)"** aparece
- ✅ El texto se muestra en un área de texto de solo lectura
- ✅ El contador muestra el número de caracteres extraídos
- ✅ Se puede copiar el texto con el botón "Copiar Texto"
- ✅ El texto es legible y preciso para imágenes con texto claro

**Archivos de Prueba Recomendados**:
- 📄 Documento escaneado (foto de un oficio/carta)
- 🖼️ Captura de pantalla con texto
- 📋 PDF escaneado (no PDF con texto seleccionable)
- 📝 Imagen de un formulario impreso

**✅ Ejemplo Visual**:
```
┌─────────────────────────────────────────┐
│ 🔍 Texto Extraído (OCR)    │ 234 caracteres │
├─────────────────────────────────────────┤
│ [Área de texto con el texto extraído]   │
│                                         │
│ Este es el texto que se extrajo         │
│ automáticamente de la imagen...         │
├─────────────────────────────────────────┤
│        📋 Copiar Texto                   │
└─────────────────────────────────────────┘
```

**⚠️ Requisitos Importantes**:
- ✅ **API Key de OpenAI** configurada en backend (variable `OPENAI_API_KEY` en `.env`)
- ✅ Imagen con **texto claro y legible**
- ✅ Formato: JPG, PNG, o PDF escaneado
- ✅ Tamaño máximo: 50 MB
- ⚠️ **Sin API Key**: El OCR fallará silenciosamente (sin texto extraído)

**🔍 Verificar API Key de OpenAI**:
Si no aparece texto extraído, verifique que la API Key esté configurada:
```bash
# SSH al servidor
ssh root@72.61.41.94

# Ver logs de PM2
pm2 logs ministerial-api --lines 50

# Buscar mensajes como:
# "OCR completed for... using openai (XXX chars)"
# Si ve "OCR failed", la API Key no está configurada
```

**💡 Consejos**:
- Para mejor calidad OCR, use imágenes con **buena iluminación**
- Evite imágenes borrosas o con texto muy pequeño
- El OCR funciona mejor con texto **horizontal** (no rotado)
- PDFs con texto seleccionable NO necesitan OCR (el texto ya está disponible)

---

### 1.6 Generación de Documentos con IA

**Objetivo**: Verificar generación automática de documentos desde cero.

**Ubicación**: Menú lateral → **"Asistente IA"** (ícono de robot)

**Pasos**:
1. Navegue a la página **"Asistente IA"** desde el menú lateral
2. En el selector **"Tipo de Documento"**, seleccione: **"Respuesta a Oficio"**
3. En el selector **"Tono"** (panel derecho), puede elegir:
   - **Formal** (por defecto)
   - **Muy formal** (para documentos oficiales de alto nivel)
   - **Nota interna** (para comunicaciones internas)
4. En el campo de texto, ingrese el prompt:
   ```
   Generar respuesta oficial sobre solicitud de información
   presupuestaria del Ministerio de Educación
   ```
5. Haga clic en el botón **"Enviar"** (ícono de avión)
6. Espere la generación (10-15 segundos)
7. La IA generará un documento completo con:
   - Membrete ministerial
   - Fecha y número de referencia
   - Destinatario
   - Saludo formal
   - Cuerpo del documento estructurado
   - Despedida formal
   - Firma y cargo

**✅ Resultado Esperado**:
- ✅ La IA genera un documento completo y profesional
- ✅ El texto es coherente y apropiado para contexto gubernamental
- ✅ El formato sigue las normas de protocolo oficial
- ✅ Se muestra el **título sugerido** del documento
- ✅ Se muestran **metadatos** (número de palabras, páginas estimadas)
- ✅ Botones disponibles:
  - **"Copiar"**: Copia el texto al portapapeles ✅ FUNCIONAL
  - **"Guardar como Documento"**: Guarda en el sistema como borrador ✅ FUNCIONAL
  - **"Descargar PDF"**: Descarga como PDF ✅ FUNCIONAL

**Tipos de Documentos que se pueden generar**:
1. ✅ **Respuesta a Oficio** - Respuestas formales a comunicaciones recibidas
2. ✅ **Memorando Interno** - Comunicaciones internas del ministerio
3. ✅ **Decreto Ministerial** - Decretos con estructura legal apropiada
4. ✅ **Oficio** - Comunicaciones oficiales externas
5. ✅ **Resolución** - Resoluciones ministeriales con fundamentos legales
6. ✅ **Carta Oficial** - Cartas formales institucionales

**Ejemplos de Prompts Efectivos**:
- "Generar respuesta sobre solicitud de ampliación de plazo para proyecto de infraestructura"
- "Crear memorando interno sobre cambios en procedimientos administrativos"
- "Redactar decreto para la creación de comisión técnica de evaluación"
- "Preparar oficio para solicitar información al Ministerio de Hacienda"
- "Generar resolución para aprobación de presupuesto anual"

**Características Técnicas**:
- **Modelo de IA**: GPT-4o (OpenAI)
- **Tiempo de generación**: 10-15 segundos
- **Longitud típica**: 300-800 palabras (2-3 páginas)
- **Idioma**: Español (Guinea Ecuatorial)
- **Contexto**: Gubernamental/Ministerial

**⚠️ Nota Importante**:
El contenido generado por IA debe ser **revisado y editado** por personal autorizado antes de su uso oficial. La IA proporciona un borrador profesional que debe ser adaptado según el contexto específico y validado por el responsable del documento.

---

#### Pruebas de Funcionalidad Completa

**A. Prueba del Botón "Copiar"**:
1. Después de generar un documento, haga clic en **"Copiar"**
2. **Resultado esperado**: Mensaje de éxito "Texto copiado al portapapeles"
3. Abra un editor de texto (Word, Notepad) y pegue (Ctrl+V)
4. **Verificación**: El texto completo del documento debe aparecer

**B. Prueba del Botón "Guardar como Documento"**:
1. Después de generar un documento, haga clic en **"Guardar como Documento"**
2. **Resultado esperado**:
   - Mensaje de éxito mostrando el ID del documento guardado
   - Descripción: "Puede editarlo desde la sección de documentos"
3. Navegue a la sección **"Bandeja de Salida"** o **"Documentos"**
4. **Verificación**:
   - El documento aparece en la lista como BORRADOR
   - Título: El generado por IA
   - Contenido: El texto completo generado
   - Tags: "AI-Generated" y el tipo de documento
   - Dirección: OUT (Salida)
   - Estado: DRAFT (Borrador)

**C. Prueba del Botón "Descargar PDF"**:
1. Después de generar un documento, haga clic en **"Descargar PDF"**
2. **Resultado esperado**:
   - Mensaje de éxito "PDF descargado correctamente"
   - Archivo PDF se descarga automáticamente
3. Abra el archivo PDF descargado
4. **Verificación del PDF**:
   - ✅ Título del documento en la parte superior (16pt, negrita)
   - ✅ Metadatos: Tipo, Fecha de generación, Palabras, Páginas estimadas
   - ✅ Contenido completo del documento (11pt, normal)
   - ✅ Saltos de página automáticos si el contenido es largo
   - ✅ Formato A4 vertical
   - ✅ Márgenes de 20mm

**Escenario de Prueba Completo**:
```
1. Generar documento: "Generar respuesta oficial sobre solicitud de
   información presupuestaria del Ministerio de Educación"
2. Esperar 10-15 segundos
3. Verificar que aparece el contenido generado
4. Copiar texto → Pegar en Word → ✅ Texto completo
5. Guardar como documento → Ir a Bandeja Salida → ✅ Documento en lista
6. Descargar PDF → Abrir PDF → ✅ Formato correcto con título y contenido
```

---

### 1.7 Análisis de Documentos con IA

**Objetivo**: Verificar análisis automático de contenido.

**Pasos**:
1. En un documento con contenido, haga clic en **"Analizar con IA"**
2. Seleccione tipo de análisis: **"Resumen Ejecutivo"**
3. Haga clic en **"Analizar"**
4. Espere el análisis (10-15 segundos)

**✅ Resultado Esperado**:
- La IA genera un resumen del documento
- El resumen captura los puntos principales
- Se identifican temas clave y acciones requeridas
- El análisis es útil para decisión rápida

**Tipos de Análisis Disponibles**:
- ✅ Resumen ejecutivo
- ✅ Identificación de temas clave
- ✅ Acciones requeridas
- ✅ Nivel de urgencia
- ✅ Partes interesadas mencionadas

---

### 1.8 Búsqueda y Filtrado

**Objetivo**: Verificar búsqueda de documentos.

**Pasos**:
1. Vaya a **"Buzón de Entrada"**
2. Use el campo de búsqueda en la parte superior
3. Busque por número: `025-MT-001-TEST`
4. Busque por asunto: `Prueba`
5. Use los filtros:
   - Tipo: INCOMING
   - Prioridad: URGENT
   - Departamento: Seleccione uno
6. Aplique múltiples filtros simultáneamente

**✅ Resultado Esperado**:
- La búsqueda por número encuentra el documento exacto
- La búsqueda por asunto encuentra coincidencias parciales
- Los filtros reducen la lista de documentos
- Se pueden aplicar múltiples filtros
- Los resultados se actualizan en tiempo real

---

### 1.9 Asignación de Documentos

**Objetivo**: Verificar asignación de documentos a usuarios.

**Pasos**:
1. En un documento, haga clic en **"Asignar"**
2. Seleccione un usuario de la lista
3. Agregue una nota: "Por favor revisar y emitir opinión"
4. Haga clic en **"Asignar"**
5. Cierre sesión e inicie sesión como el usuario asignado
6. Verifique que el documento aparece en su buzón

**✅ Resultado Esperado**:
- El documento se asigna correctamente
- El usuario asignado recibe notificación
- El documento aparece en el buzón del usuario asignado
- La nota de asignación es visible
- El historial registra la asignación

---

### 1.10 Cambio de Estado de Documento

**Objetivo**: Verificar transición entre estados del flujo de trabajo.

**Pasos**:
1. Abra un documento en estado **PENDING**
2. Haga clic en **"Cambiar Estado"**
3. Seleccione el siguiente estado: **MANUAL_ENTRY**
4. Agregue un comentario: "Iniciando proceso de entrada manual"
5. Haga clic en **"Guardar"**
6. Verifique que el estado cambió

**✅ Resultado Esperado**:
- El estado cambia correctamente
- El timeline muestra el nuevo estado
- El comentario aparece en el historial
- La fecha y hora se registran
- El usuario que hizo el cambio se registra

**Estados del Flujo Entrante** (11 etapas):
1. PENDING → 2. MANUAL_ENTRY → 3. RECEIVED → 4. REGISTRATION →
5. DISTRIBUTION → 6. ANALYSIS → 7. DRAFT_RESPONSE → 8. REVIEW →
9. SIGNATURE_PROTOCOL → 10. ACKNOWLEDGMENT → 11. ARCHIVED

---

### 1.11 Expedientes (Casos)

**Objetivo**: Verificar creación y gestión de expedientes con prioridades y vinculación de documentos.

**Ubicación**: Menú lateral → **"Expedientes"** (con icono de carpeta 📁)

---

#### Parte A: Crear Expediente con Prioridad

**Pasos**:
1. Vaya a **"Expedientes"** en el menú lateral
2. Haga clic en **"Nuevo Expediente"** (botón superior derecho)
3. Complete el formulario:
   - **Título**: `Expediente de Prueba - Transporte Público` *(requerido)*
   - **Descripción**: `Expediente para gestión de quejas de transporte público urbano` *(opcional, permite formato enriquecido)*
   - **Prioridad**: Seleccione **"Alta"** o **"Urgente"** *(requerido)*
     - **Baja**: Sin icono (uso general)
     - **Media**: Sin icono (por defecto)
     - **Alta**: ⚠️ Icono naranja (requiere atención)
     - **Urgente**: ⚠️ Icono rojo + texto en negrita (máxima prioridad)
4. Haga clic en **"Crear Expediente"**

**✅ Resultado Esperado**:
- ✅ El expediente se crea exitosamente
- ✅ Mensaje de éxito: "Expediente [código] creado exitosamente"
- ✅ **Código auto-generado**: Formato `EXP-2026-XXXX` (el número se asigna automáticamente)
- ✅ Redirección a la página de detalles del expediente
- ✅ El expediente aparece en la lista de "Expedientes" con el estado **"Abierto"**
- ✅ La prioridad seleccionada se muestra con su icono correspondiente
- ✅ El indicador visual de prioridad es correcto:
  - Alta: Icono naranja ⚠️
  - Urgente: Icono rojo ⚠️ con texto en negrita

**Información Automática Generada**:
- **Código**: EXP-2026-XXXX (numeración secuencial automática)
- **Estado**: OPEN (Abierto)
- **Fecha de Inicio**: Fecha y hora actual
- **Contador de Documentos**: 0 (inicialmente)

---

#### Parte B: Agregar Documentos al Expediente

**Objetivo**: Vincular documentos existentes al expediente creado.

**Prerequisitos**:
- Al menos 1 expediente creado (Parte A)
- Al menos 1 documento en el sistema (en cualquier estado)

**Pasos**:
1. Desde la lista de "Expedientes", haga clic en el expediente creado anteriormente
2. En la página de detalles, haga clic en la pestaña **"Documentos"**
3. Haga clic en el botón **"Agregar Documento"** (botón superior derecho de la pestaña, con icono ➕)
4. Se abre un diálogo **"Agregar Documento al Expediente"**

**Funcionalidades del Diálogo**:

**A. Información del Expediente**:
- Se muestra el título del expediente
- Se muestra el código del expediente (EXP-2026-XXXX)

**B. Búsqueda de Documentos**:
- Campo de búsqueda disponible: "Buscar por título o número..."
- La búsqueda filtra en tiempo real mientras escribe
- Búsqueda por:
  - **Título del documento** (ej: "Solicitud de Información")
  - **Número Correlativo** (ej: "025-MT-001-TEST")
- Búsqueda es **case-insensitive** (no distingue mayúsculas/minúsculas)

**C. Selección de Documento**:
- Lista desplegable con documentos disponibles
- Cada documento muestra:
  - **Título** (texto principal)
  - **Número Correlativo** (texto secundario en gris)
- **Filtrado Inteligente**:
  - ✅ Solo muestra documentos que NO están ya en este expediente
  - ❌ Documentos ya vinculados a este expediente están ocultos
  - Mensaje: "Solo se muestran documentos que no están en este expediente"

5. Use el campo de búsqueda para encontrar un documento (opcional)
6. Seleccione un documento de la lista desplegable
7. Haga clic en **"Agregar"**

**✅ Resultado Esperado del Diálogo**:
- ✅ Búsqueda filtra documentos en tiempo real (sin retrasos)
- ✅ Solo aparecen documentos que NO están en el expediente actual
- ✅ Si no hay documentos disponibles, muestra: "No hay documentos disponibles"
- ✅ El botón "Agregar" está deshabilitado hasta seleccionar un documento
- ✅ Al hacer clic en "Cancelar", el diálogo se cierra sin cambios

**✅ Resultado Esperado después de Agregar**:
- ✅ Mensaje de éxito: "Documento agregado al expediente exitosamente"
- ✅ El diálogo se cierra automáticamente
- ✅ El documento aparece en la lista de documentos del expediente
- ✅ El contador de documentos se incrementa (ej: "3 documentos")
- ✅ El documento muestra:
  - Número correlativo
  - Título
  - Estado actual
  - Fecha
  - Botón para ver detalles

**Verificaciones Adicionales**:
1. **Intente agregar el mismo documento nuevamente**:
   - Abra el diálogo "Agregar Documento"
   - Busque el documento que acaba de agregar
   - ✅ **Resultado**: El documento NO aparece en la lista (está filtrado)

2. **Agregue múltiples documentos**:
   - Repita el proceso para agregar 2-3 documentos más
   - ✅ **Resultado**: Todos los documentos aparecen en la lista
   - ✅ **Resultado**: El contador de documentos se actualiza correctamente

3. **Búsqueda por número correlativo**:
   - Abra el diálogo "Agregar Documento"
   - Escriba parte del número correlativo (ej: "025-MT")
   - ✅ **Resultado**: Los documentos con ese número aparecen filtrados

---

#### Parte C: Verificación de Vinculación

**Pasos de Verificación**:
1. Vaya a **"Bandeja de Entrada"** o **"Bandeja de Salida"**
2. Busque uno de los documentos que agregó al expediente
3. Haga clic en **"Ver Detalles"** del documento
4. En los detalles del documento, verifique la sección "Expediente Asociado"

**✅ Resultado Esperado**:
- ✅ El documento muestra el expediente al que pertenece
- ✅ Se puede hacer clic en el código del expediente para ir a sus detalles
- ✅ La vinculación es bidireccional (documento ↔ expediente)

---

#### Resumen de Características Probadas

**Gestión de Expedientes**:
- ✅ Crear expedientes con información básica
- ✅ Código automático con formato EXP-2026-XXXX
- ✅ Selector de prioridad con 4 niveles
- ✅ Indicadores visuales de prioridad (iconos naranja/rojo)
- ✅ Estado automático "Abierto" al crear

**Vinculación de Documentos**:
- ✅ Botón "Agregar Documento" en pestaña Documentos
- ✅ Búsqueda en tiempo real por título o número
- ✅ Filtrado automático de documentos ya vinculados
- ✅ Contador de documentos actualizado
- ✅ Lista de documentos del expediente
- ✅ Vinculación bidireccional documento ↔ expediente

**Validaciones y Seguridad**:
- ✅ Título requerido (mínimo 1 carácter)
- ✅ Prioridad requerida (por defecto: MEDIUM)
- ✅ No se puede agregar el mismo documento dos veces
- ✅ Mensajes de error claros cuando no se selecciona documento
- ✅ Confirmación visual después de cada acción

---

### 1.12 Plazos y Recordatorios

**Objetivo**: Verificar gestión de plazos y recordatorios automáticos.

**Pasos**:
1. En un documento, haga clic en **"Establecer Plazo"**
2. Configure el plazo:
   - **Tipo**: BUSINESS_HOURS (Horas Hábiles)
   - **Cantidad**: 48 horas
   - **Descripción**: "Responder solicitud de información"
3. Haga clic en **"Guardar"**
4. Vaya a **"Plazos"** en el menú
5. Verifique que el plazo aparece en la lista

**✅ Resultado Esperado**:
- El plazo se crea correctamente
- El cálculo de fecha límite es correcto (solo días hábiles)
- El plazo aparece en la sección "Plazos Activos"
- Se excluyen fines de semana y festivos
- El contador de tiempo muestra el tiempo restante

**Horario Hábil**:
- Lunes a Viernes: 8:00 AM - 6:00 PM
- Zona Horaria: Africa/Malabo
- Festivos Excluidos: 8 días festivos de Guinea Ecuatorial

**Sistema de Recordatorios**:
- ⏰ Recordatorio enviado 24h después del plazo vencido
- 📧 Enviado solo en horario hábil (8 AM - 6 PM)
- 📨 Email con plantilla profesional
- 🔄 Programación: Cron `0 8-18 * * 1-5`

---

### 1.13 Sello de Entrada Manual

**Objetivo**: Verificar aplicación de sellos de entrada.

**Pasos**:
1. Cree un documento en estado MANUAL_ENTRY
2. Haga clic en **"Aplicar Sello de Entrada"**
3. Configure el sello:
   - **Fecha de Entrada**: Seleccione fecha actual
   - **Hora de Entrada**: Seleccione hora actual
   - **Tipo de Sello**: DIGITAL o MANUAL
4. Suba una imagen del sello (opcional)
5. Haga clic en **"Aplicar Sello"**

**✅ Resultado Esperado**:
- El sello se aplica correctamente
- La fecha y hora se registran
- La imagen del sello (si se sube) aparece en el documento
- El estado cambia automáticamente a RECEIVED
- El timeline muestra la aplicación del sello

---

### 1.14 Acuse de Recibo ✅ FUNCIONAL (Actualizado: 8 Feb 2026)

**Objetivo**: Verificar el registro de acuses de recibo para documentos procesados.

**Estado**: ✅ **COMPLETADO** - Sistema de registro de acuses implementado

**Prerequisito**: El documento debe estar en la etapa **ACKNOWLEDGMENT** del flujo de trabajo.

#### **Paso 1: Preparar el Documento**
1. Vaya a **"Bandeja de entrada"**
2. Cree un nuevo documento entrante o seleccione uno existente
3. Haga clic en el menú de tres puntos (⋮) del documento
4. Seleccione **"Cambiar estado"**
5. En el diálogo de cambio de estado, verá las **10 etapas del flujo entrante**:
   - Entrada Manual
   - Escaneo Asignado
   - Resumen IA
   - Decretado
   - Decreto Impreso
   - Informe Recibido
   - Respuesta Preparada
   - Protocolo de Firma
   - **Acuse de Recibo** ← Seleccione esta etapa
   - Archivado
6. Seleccione **"Acuse de Recibo"**
7. Haga clic en **"Cambiar Estado"**

#### **Paso 2: Generar el Acuse**
1. Una vez el documento esté en etapa ACKNOWLEDGMENT, verá el botón **"Generar Acuse"** (con icono de checkmark azul) en el menú de acciones
2. Haga clic en **"Generar Acuse"**
3. Complete el formulario:
   - **Tipo de Acuse*** (requerido):
     - **Acuse Manual Firmado**: Documento físico con firma manuscrita
     - **Acuse con Sello**: Documento con sello oficial
     - **Acuse Digital con QR**: Acuse electrónico con código QR
   - **Fecha del Acuse*** (requerido): Fecha de recepción/confirmación
   - **Recibido por*** (requerido): Nombre completo de quien recibe
   - **Archivo Escaneado (PDF)** (opcional): Adjunte el acuse escaneado (máx. 10MB)
   - **Notas** (opcional): Observaciones adicionales
4. Haga clic en **"Generar Acuse"**

**✅ Resultado Esperado**:
- ✅ Mensaje de éxito: "Acuse de recibo generado exitosamente"
- ✅ El sistema registra:
  - Tipo de acuse (MANUAL/STAMP/DIGITAL)
  - Fecha de confirmación
  - Persona que recibió el documento
  - Archivo escaneado (si se adjuntó)
  - Notas adicionales
- ✅ Se crea un registro en el log de auditoría (acción: `ACKNOWLEDGMENT_RECORDED`)
- ✅ Se envían notificaciones a:
  - Creador del documento
  - Usuario responsable asignado
- ✅ El documento permanece en etapa ACKNOWLEDGMENT hasta que se archive

**📝 Notas Importantes**:
- El botón "Generar Acuse" solo aparece cuando el documento está en etapa **ACKNOWLEDGMENT**
- Si intenta generar un acuse duplicado, el sistema mostrará un error
- El archivo escaneado es opcional pero recomendado para documentación
- Todos los datos quedan registrados permanentemente en la base de datos

**🔍 Verificación**:
1. Abra el documento y verifique que muestra:
   - Fecha de acuse
   - Tipo de acuse
   - Persona que recibió
   - Enlace al archivo adjunto (si se subió)
2. Vaya a **"Auditoría"** y busque la acción `ACKNOWLEDGMENT_RECORDED`
3. Verifique que las notificaciones fueron enviadas

**⚠️ Limitación Actual**:
- El sistema **registra** los datos del acuse pero no genera automáticamente un PDF
- Para obtener el PDF del acuse, use el archivo escaneado que adjuntó
- Generación automática de PDF con QR puede implementarse en fase futura

---

### 1.15 Archivo de Documentos

**Objetivo**: Verificar archivado de documentos completados.

**Pasos**:
1. Seleccione un documento en estado final (ARCHIVED)
2. O cambie un documento a estado ARCHIVED
3. Vaya a **"Archivo"** en el menú
4. Verifique que el documento archivado aparece
5. Busque el documento usando filtros
6. Intente editar el documento archivado

**✅ Resultado Esperado**:
- Los documentos archivados aparecen en la sección Archivo
- Se pueden buscar y filtrar documentos archivados
- Los documentos archivados son de solo lectura
- No se pueden modificar documentos archivados
- El historial completo está disponible

---

## MÓDULO 2: Protocolo de Firma Ministerial (8 Características)

### 2.1 Iniciar Protocolo de Firma

**Objetivo**: Verificar inicio del protocolo de firma de 8 etapas.

**⚠️ IMPORTANTE**: El protocolo de firma es un proceso de DOS pasos:
1. Cambiar el estado del documento a SIGNATURE_PROTOCOL
2. Acceder al diálogo del protocolo mediante el botón "Protocolo de firma"

**Pasos**:
1. Inicie sesión como **GABINETE** o **ADMIN**
2. Abra un documento en uno de estos estados:
   - **RESPONSE_PREPARED** (documentos entrantes - IN)
   - **DRAFT_CREATION** (documentos salientes - OUT)
3. Haga clic en el menú de acciones (⋮) → **"Cambiar Estado"**
4. En el diálogo "Cambiar Estado del Documento", seleccione **SIGNATURE_PROTOCOL** (Protocolo de Firma)
5. Haga clic en **"Cambiar Estado"**
6. El estado del documento cambia a SIGNATURE_PROTOCOL
7. **AHORA** verá aparecer el botón **"Protocolo de firma"** en el menú de acciones (⋮)
8. Haga clic en **"Protocolo de firma"** para abrir el diálogo del protocolo de 8 etapas

**✅ Resultado Esperado**:
- El estado cambia a SIGNATURE_PROTOCOL
- El botón "Protocolo de firma" aparece en el menú de acciones
- Al hacer clic, se abre el diálogo con 3 pestañas: "1. Firma", "2. Sello", "3. Finalizar"
- El sub-estado inicial es "PREPARATION"
- El timeline muestra el inicio del protocolo
- Solo usuarios autorizados (GABINETE, ADMIN) pueden cambiar el estado a SIGNATURE_PROTOCOL

**8 Sub-etapas del Protocolo**:
1. PREPARATION (Preparación)
2. SIGNATURE (Firma)
3. SEAL_PREPARATION (Preparación del Sello)
4. SEAL_APPLICATION (Aplicación del Sello)
5. VERIFICATION (Verificación)
6. REGISTRATION (Registro)
7. NOTIFICATION (Notificación)
8. COMPLETION (Completado)

---

### 2.2 Firma del Ministro (Solo Ministro)

**Objetivo**: Verificar que SOLO el Ministro puede firmar documentos.

**Pasos de Prueba 1 - Usuario No Autorizado**:
1. Inicie sesión como **REVISOR** o **LECTOR**
2. Abra un documento que esté en estado SIGNATURE_PROTOCOL
3. Haga clic en el menú de acciones (⋮) → **"Protocolo de firma"**
4. El diálogo se abre, vaya a la pestaña **"1. Firma"**
5. Intente firmar el documento

**✅ Resultado Esperado**:
- Aparece un banner de advertencia rojo: "⚠️ Solo el Ministro puede firmar documentos"
- El botón "Firmar Documento" está DESHABILITADO
- Mensaje: "Solo el Ministro puede firmar documentos"
- No se permite completar la firma

**Pasos de Prueba 2 - Ministro**:
1. Cierre sesión e inicie sesión como **Ministro** (ministro@ministerio.gq)
2. Abra el mismo documento en estado SIGNATURE_PROTOCOL
3. Haga clic en el menú de acciones (⋮) → **"Protocolo de firma"**
4. En el diálogo, seleccione la pestaña **"1. Firma"**
5. NO debe aparecer el banner de advertencia
6. Seleccione **Tipo de Firma**:
   - **DIGITAL**: Firma digital electrónica
   - **PHYSICAL**: Firma manuscrita escaneada (requiere imagen)
   - **BOTH**: Ambas firmas (digital + imagen de firma física)
7. Ingrese la **Fecha de Firma** (por defecto: hoy)
8. Si seleccionó PHYSICAL o BOTH: haga clic en **"Subir Imagen de Firma"** y seleccione un archivo JPG/PNG
9. Agregue **Notas** (opcional)
10. Haga clic en **"Firmar Documento"**

**✅ Resultado Esperado**:
- Mensaje de éxito: "Documento firmado exitosamente por el Ministro"
- El documento avanza al siguiente sub-estado
- La firma se registra con fecha/hora en el historial
- El timeline muestra "✓ Firmado por [Nombre del Ministro]"
- Si subió imagen: la firma escaneada se almacena y es visible
- Solo el Ministro puede completar esta acción

**⚠️ CRÍTICO**: Esta es una funcionalidad de seguridad. El sistema DEBE bloquear firmas de usuarios no autorizados.

---

### 2.3 Aplicación de Sello Oficial

**Objetivo**: Verificar aplicación del sello oficial ministerial.

**Pre-requisito**: El documento debe haber sido firmado por el Ministro (completar Sección 2.2 primero).

**Pasos**:
1. Con el documento ya firmado, abra el documento en estado SIGNATURE_PROTOCOL
2. Haga clic en el menú de acciones (⋮) → **"Protocolo de firma"**
3. En el diálogo, seleccione la pestaña **"2. Sello"**
4. Ingrese la **Fecha del Sello** (por defecto: hoy)
5. Ingrese **"Aplicado por"** (nombre de la persona que aplica el sello)
6. **Opcional**: Suba un escaneo del sello físico (imagen JPG/PNG del documento con sello aplicado)
7. Agregue **Notas** (opcional)
8. Haga clic en **"Aplicar Sello Oficial"**

**✅ Resultado Esperado**:
- Mensaje de éxito: "Sello oficial aplicado exitosamente"
- La información del sello se registra en el documento
- La fecha de aplicación y persona responsable quedan registradas
- El timeline muestra "✓ Sello aplicado por [Nombre]"
- Si subió escaneo: la imagen del sello se almacena
- El sello es OBLIGATORIO para documentos salientes (OUT)

**Nota**: Para documentos OUTGOING, el sello es obligatorio antes de poder completar el protocolo.

---

### 2.4 Completar Protocolo de Firma

**Objetivo**: Verificar finalización completa del protocolo de firma.

**Pre-requisitos**:
- El documento debe estar firmado por el Ministro (Sección 2.2)
- El sello oficial debe estar aplicado (Sección 2.3)

**Pasos**:
1. Con el documento ya firmado y sellado, abra el documento en estado SIGNATURE_PROTOCOL
2. Haga clic en el menú de acciones (⋮) → **"Protocolo de firma"**
3. En el diálogo, seleccione la pestaña **"3. Finalizar"**
4. Verifique que muestra:
   - ✅ Firma aplicada por el Ministro (con fecha)
   - ✅ Sello oficial aplicado (con fecha y nombre)
   - Estado listo para completar
5. Haga clic en **"Completar Protocolo de Firma"**
6. Confirme la acción si se solicita

**✅ Resultado Esperado**:
- Mensaje de éxito: "Protocolo de firma completado exitosamente"
- El estado del documento avanza automáticamente:
  - **Documentos ENTRANTES (IN)**: Cambia a **ACKNOWLEDGMENT** (Acuse de Recibo)
  - **Documentos SALIENTES (OUT)**: Cambia a **PRINTED_SENT** (Impreso y Enviado)
- El diálogo se cierra automáticamente
- El timeline muestra el protocolo como completado
- Notificaciones automáticas enviadas a usuarios relevantes
- El documento está listo para la siguiente etapa del flujo
- No se puede volver a modificar la firma o sello (protocolo cerrado)

**Validaciones del Sistema**:
- ✅ Firma del Ministro presente
- ✅ Sello oficial aplicado (obligatorio para documentos OUT)
- ✅ Toda la información completa
- ⚠️ Si falta firma: Error "El documento debe estar firmado por el Ministro"
- ⚠️ Si falta sello (documentos OUT): Error "El sello oficial es obligatorio"

---

### 2.5 Flujo Completo del Protocolo (Prueba Integral)

**Objetivo**: Verificar el flujo completo de principio a fin.

**Este test integra las Secciones 2.1, 2.2, 2.3 y 2.4.**

**Pasos para Documento ENTRANTE (IN)**:
1. Inicie sesión como **Ministro** (ministro@ministerio.gq)
2. Cree o abra un documento ENTRANTE en estado **RESPONSE_PREPARED**
3. **Cambiar Estado a Protocolo**:
   - Menú (⋮) → "Cambiar Estado" → "SIGNATURE_PROTOCOL" → "Cambiar Estado"
4. **Iniciar Protocolo**:
   - Menú (⋮) → "Protocolo de firma"
5. **Tab 1 - Firmar Documento**:
   - Tipo: "BOTH" (Ambas)
   - Fecha: Hoy
   - Subir imagen de firma (JPG/PNG)
   - Click "Firmar Documento"
   - ✅ Éxito → Se habilita Tab 2
6. **Tab 2 - Aplicar Sello**:
   - Fecha: Hoy
   - Aplicado por: "Juan Pérez"
   - (Opcional) Subir escaneo del sello
   - Click "Aplicar Sello Oficial"
   - ✅ Éxito → Se habilita Tab 3
7. **Tab 3 - Finalizar**:
   - Verificar firma ✓ y sello ✓
   - Click "Completar Protocolo de Firma"
   - ✅ Éxito → Documento avanza a ACKNOWLEDGMENT

**Pasos para Documento SALIENTE (OUT)**:
1. Igual que arriba, pero inicie con documento en estado **DRAFT_CREATION**
2. Siga los mismos pasos 3-7
3. Al finalizar: Documento avanza a **PRINTED_SENT** (en lugar de ACKNOWLEDGMENT)

**✅ Resultado Esperado - Documento ENTRANTE**:
- Estado final: **ACKNOWLEDGMENT**
- Tiempo total: < 5 minutos
- Firma registrada con imagen
- Sello registrado
- Timeline completo visible
- Notificaciones enviadas

**✅ Resultado Esperado - Documento SALIENTE**:
- Estado final: **PRINTED_SENT**
- Sello OBLIGATORIO (no puede completar sin sello)
- Documento listo para impresión y envío físico

---

### 2.6 Validaciones de Seguridad del Protocolo

**Objetivo**: Verificar que las validaciones de seguridad funcionan correctamente.

**Test 1: Bloqueo de Firma para No-Ministros**
1. Inicie sesión como **REVISOR** (correo: revisor@ministerio.gq)
2. Abra un documento en SIGNATURE_PROTOCOL
3. Menú (⋮) → "Protocolo de firma" → Tab "1. Firma"
4. **✅ Resultado Esperado**:
   - Banner rojo: "⚠️ Solo el Ministro puede firmar documentos"
   - Botón "Firmar Documento" DESHABILITADO
   - No puede proceder

**Test 2: Sello Obligatorio para Documentos Salientes**
1. Inicie sesión como **Ministro**
2. Firme un documento SALIENTE (OUT)
3. Intente completar el protocolo SIN aplicar sello (saltar Tab 2)
4. **✅ Resultado Esperado**:
   - Tab 3 "Finalizar" está DESHABILITADO
   - Mensaje: "Debe aplicar el sello oficial primero"
   - No puede completar sin sello

**Test 3: Orden Secuencial de Tabs**
1. Abra un documento en protocolo SIN firmar
2. Intente acceder directamente a Tab 2 "Sello" o Tab 3 "Finalizar"
3. **✅ Resultado Esperado**:
   - Tab 2 DESHABILITADO hasta que se firme (Tab 1)
   - Tab 3 DESHABILITADO hasta que se firme Y selle
   - Debe completar en orden: Firma → Sello → Finalizar

**Test 4: Validación de Archivos**
1. En Tab 1, seleccione tipo "PHYSICAL"
2. Intente firmar SIN subir imagen
3. **✅ Resultado Esperado**:
   - Error: "Por favor adjunte el escaneo de la firma física"
   - No permite continuar sin archivo

**Test 5: Protocolo No Modificable Después de Completar**
1. Complete un protocolo de firma
2. Intente volver a abrir "Protocolo de firma"
3. **✅ Resultado Esperado**:
   - El botón "Protocolo de firma" ya no aparece en el menú
   - El documento está en estado ACKNOWLEDGMENT o PRINTED_SENT
   - No se puede modificar firma/sello después de completar

---

### 2.7 Resumen de Estados y Transiciones del Protocolo

**8 Sub-etapas Internas del Backend** (no visibles directamente al usuario):
1. **PREPARATION** - Preparación inicial
2. **SIGNATURE** - Documento firmado
3. **SEAL_PREPARATION** - Preparación del sello
4. **SEAL_APPLICATION** - Sello aplicado
5. **VERIFICATION** - Verificación automática
6. **REGISTRATION** - Registro del protocolo
7. **NOTIFICATION** - Notificaciones enviadas
8. **COMPLETION** - Protocolo completado

**3 Acciones del Usuario** (tabs en el diálogo):
- **Tab 1: Firma** → Backend ejecuta sub-etapas 1-2
- **Tab 2: Sello** → Backend ejecuta sub-etapas 3-4
- **Tab 3: Finalizar** → Backend ejecuta sub-etapas 5-8

**Transiciones de Estado del Documento**:
```
Documento ENTRANTE (IN):
RESPONSE_PREPARED → SIGNATURE_PROTOCOL → ACKNOWLEDGMENT

Documento SALIENTE (OUT):
DRAFT_CREATION → SIGNATURE_PROTOCOL → PRINTED_SENT
```

**Notas Importantes**:
- El protocolo es irreversible una vez completado
- Solo ADMIN puede revertir un protocolo completado (vía panel de administración)
- Todas las acciones quedan registradas en el log de auditoría
- Las notificaciones se envían automáticamente al completar

---

### 2.8 Historial y Auditoría del Protocolo

**Objetivo**: Verificar que todas las acciones del protocolo quedan registradas.

**Pasos**:
1. Complete un protocolo de firma (Sección 2.5)
2. Vaya al módulo **"Auditoría"** en el menú lateral
3. Filtre por el documento que acaba de completar
4. Verifique los registros de auditoría

**✅ Resultado Esperado - Registros de Auditoría**:
El sistema debe mostrar AL MENOS estos 4 eventos:
1. **"STAGE_CHANGED"** → Estado cambiado a SIGNATURE_PROTOCOL
   - Usuario: quien cambió el estado
   - Fecha/hora del cambio
2. **"DOCUMENT_SIGNED"** → Documento firmado por el Ministro
   - Usuario: El Ministro
   - Tipo de firma: DIGITAL / PHYSICAL / BOTH
   - Fecha de firma
   - Archivos adjuntos (si aplica)
3. **"SEAL_APPLIED"** → Sello oficial aplicado
   - Usuario: quien aplicó el sello
   - Fecha de aplicación
   - Aplicado por: nombre registrado
4. **"SIGNATURE_PROTOCOL_COMPLETED"** → Protocolo completado
   - Usuario: quien completó
   - Estado nuevo: ACKNOWLEDGMENT o PRINTED_SENT
   - Fecha/hora de finalización

**Verificación Adicional - Vista del Documento**:
1. Abra el documento completado
2. En la vista de detalles, verifique que muestra:
   - ✅ Estado actual: ACKNOWLEDGMENT o PRINTED_SENT
   - ✅ Información de firma visible (fecha, tipo)
   - ✅ Información de sello visible (fecha, aplicado por)
   - ✅ Ya NO aparece botón "Protocolo de firma"

**⚠️ Datos Sensibles**:
- Los registros de auditoría NO se pueden modificar
- Solo ADMIN puede ver todos los registros
- Otros usuarios solo ven registros de documentos a los que tienen acceso
- Las firmas y sellos quedan permanentemente asociados al documento

---

## MÓDULO 3: Automatización (5 Características)

### 3.1 Cálculo de Horas Hábiles

**Objetivo**: Verificar cálculo correcto de plazos en horas hábiles.

**Pasos de Prueba 1 - Plazo de 24 Horas Hábiles**:
1. Cree un plazo un lunes a las 10:00 AM
2. Configure: 24 horas hábiles
3. Verifique la fecha límite calculada

**✅ Resultado Esperado**:
- Fecha límite: Miércoles a las 10:00 AM
- Cálculo: Lunes 10 AM + 8h = Lunes 6 PM (8h)
           Martes 8 AM a 6 PM (10h)
           Miércoles 8 AM a 12 PM (6h) = 24h total

**Pasos de Prueba 2 - Plazo que cruza fin de semana**:
1. Cree un plazo un viernes a las 2:00 PM
2. Configure: 16 horas hábiles
3. Verifique la fecha límite

**✅ Resultado Esperado**:
- Fecha límite: Martes siguiente a las 10:00 AM
- Cálculo: Viernes 2 PM a 6 PM (4h)
           Sábado-Domingo excluidos
           Lunes 8 AM a 6 PM (10h)
           Martes 8 AM a 10 AM (2h) = 16h total

**Pasos de Prueba 3 - Plazo con festivo**:
1. Cree un plazo antes de un festivo
2. Configure: 48 horas hábiles
3. Verifique que el festivo se excluye

**✅ Resultado Esperado**:
- Los festivos nacionales se excluyen del cálculo
- Los sábados y domingos se excluyen
- Solo se cuentan horas entre 8 AM y 6 PM

**Festivos de Guinea Ecuatorial Excluidos**:
- 1 de enero (Año Nuevo)
- Viernes Santo (variable)
- 1 de mayo (Día del Trabajo)
- 25 de mayo (Día de África)
- 5 de junio (Día del Presidente)
- 3 de agosto (Día del Golpe de la Libertad)
- 12 de octubre (Día de la Independencia)
- 25 de diciembre (Navidad)

---

### 3.2 Recordatorios Automáticos

**Objetivo**: Verificar envío automático de recordatorios.

**Configuración del Sistema**:
- Horario de verificación: Cada hora de 8 AM a 6 PM (lunes a viernes)
- Cron schedule: `0 8-18 * * 1-5`
- Recordatorio enviado: 24h después del plazo vencido
- Solo en horario hábil

**Pasos de Prueba**:
1. Cree un plazo que venza hoy
2. Configure el plazo para que venza hace 25 horas
3. Espere a que el cron ejecute (próxima hora en punto)
4. Verifique que se envió el recordatorio

**✅ Resultado Esperado**:
- Recordatorio enviado 24h después del vencimiento
- Email enviado al usuario responsable
- Notificación en la aplicación
- Registro en logs del sistema
- NO se envía fuera de horario hábil

**Para verificar manualmente en el servidor**:
```bash
ssh root@72.61.41.94
pm2 logs ministerial-api | grep "reminder"
```

**Plantilla de Email**:
- Asunto: "⏰ Recordatorio: Plazo Vencido - [Número Documento]"
- Cuerpo: HTML profesional con logo ministerial
- Incluye: número documento, asunto, fecha límite, enlace directo

---

### 3.3 Notificaciones por Email

**Objetivo**: Verificar envío de notificaciones por email.

**Configuración Actual**:
- Servicio: Gmail SMTP
- Host: smtp.gmail.com
- Puerto: 587 (TLS)
- Email: configurado en .env

**Eventos que Generan Emails**:
- ✅ Documento asignado a usuario
- ✅ Cambio de estado importante
- ✅ Plazo próximo a vencer (24h antes)
- ✅ Plazo vencido (24h después)
- ✅ Documento firmado
- ✅ Protocolo completado

**Pasos de Prueba**:
1. Asigne un documento a otro usuario
2. Verifique que el usuario recibe email
3. Revise el contenido del email

**✅ Resultado Esperado**:
- Email enviado correctamente
- Plantilla HTML profesional
- Logo del Ministerio visible
- Información completa del documento
- Enlace directo al documento
- Botón de acción claro

**Para verificar logs de email**:
```bash
ssh root@72.61.41.94
pm2 logs ministerial-api | grep "email"
```

---

### 3.4 Auditoría Automática

**Objetivo**: Verificar registro automático de todas las acciones.

**Acciones Auditadas**:
- ✅ Inicio de sesión / Cierre de sesión
- ✅ Creación de documentos
- ✅ Modificación de documentos
- ✅ Eliminación de documentos
- ✅ Cambios de estado
- ✅ Asignaciones
- ✅ Firmas
- ✅ Descargas de archivos
- ✅ Cambios en configuración

**Pasos de Prueba**:
1. Inicie sesión como ADMIN
2. Vaya a **"Auditoría"** en el menú
3. Verifique la lista de eventos
4. Filtre por:
   - Usuario
   - Tipo de acción
   - Fecha
   - Documento

**✅ Resultado Esperado**:
- Todos los eventos aparecen en la auditoría
- Cada evento incluye:
  - Fecha y hora exacta
  - Usuario que realizó la acción
  - Tipo de acción
  - Detalles específicos (qué se modificó)
  - IP del usuario (si disponible)
- Los eventos no se pueden modificar o eliminar
- Se pueden exportar reportes de auditoría

**Información Registrada**:
```json
{
  "timestamp": "2026-02-05T10:30:00Z",
  "user": "admin@ministerio.gq",
  "action": "DOCUMENT_CREATED",
  "entity": "Document",
  "entityId": "doc-12345",
  "details": {
    "documentNumber": "025-MT-001-TEST",
    "type": "INCOMING",
    "department": "Transporte Terrestre"
  },
  "ipAddress": "192.168.1.100"
}
```

---

### 3.5 Estadísticas y Dashboard

**Objetivo**: Verificar estadísticas automáticas del sistema.

**Pasos de Prueba**:
1. Vaya a la página principal (Dashboard)
2. Verifique los siguientes widgets:
   - **Documentos por Estado**: Gráfico de barras
   - **Top 5 Etapas Activas**: Lista con contadores
   - **Plazos Próximos**: Lista de plazos urgentes
   - **Actividad Reciente**: Timeline de eventos

**✅ Resultado Esperado**:
- Estadísticas se calculan automáticamente
- Los números coinciden con la realidad
- Gráficos visuales claros
- Actualización en tiempo real
- Datos filtrados por permiso de usuario

**Métricas Disponibles**:
- Documentos por estado (11 estados entrantes + 6 salientes)
- Documentos por departamento
- Documentos por prioridad (LOW, MEDIUM, HIGH, URGENT)
- Documentos por tipo (INCOMING, OUTGOING)
- Plazos vencidos vs cumplidos
- Tiempo promedio por etapa
- Usuarios más activos
- Documentos procesados por mes

---

## MÓDULO 4: Seguridad y Auditoría (4 Características)

### 4.1 Control de Acceso por Rol (RBAC)

**Objetivo**: Verificar que cada rol tiene los permisos correctos.

#### Prueba Rol ADMIN
**Permisos Esperados**: ✅ Acceso completo

**Pasos**:
1. Inicie sesión como ADMIN
2. Verifique acceso a:
   - ✅ Crear/editar/eliminar usuarios
   - ✅ Ver todos los documentos
   - ✅ Crear/editar/eliminar documentos
   - ✅ Cambiar estados de documentos
   - ✅ Ver auditoría completa
   - ✅ Configurar sistema
   - ✅ Gestionar departamentos
   - ✅ Ver estadísticas globales

**✅ Resultado Esperado**: Todas las funciones accesibles

---

#### Prueba Rol GABINETE
**Permisos Esperados**: ✅ Revisión y aprobación, ❌ No admin

**Pasos**:
1. Inicie sesión como GABINETE
2. Verifique acceso a:
   - ✅ Ver documentos de su departamento
   - ✅ Crear documentos
   - ✅ Revisar documentos
   - ✅ Firmar documentos (solo si es Ministro)
   - ✅ Cambiar estados
   - ❌ No crear usuarios
   - ❌ No ver auditoría completa
   - ❌ No configurar sistema

**✅ Resultado Esperado**: Acceso limitado apropiado

---

#### Prueba Rol REVISOR
**Permisos Esperados**: ✅ Revisión, ❌ No firma

**Pasos**:
1. Inicie sesión como REVISOR
2. Verifique acceso a:
   - ✅ Ver documentos asignados
   - ✅ Agregar comentarios
   - ✅ Sugerir cambios
   - ✅ Marcar como revisado
   - ❌ No firmar documentos
   - ❌ No eliminar documentos
   - ❌ No crear usuarios
   - ❌ No ver auditoría completa

**✅ Resultado Esperado**: Solo lectura y comentarios

---

#### Prueba Rol LECTOR
**Permisos Esperados**: ✅ Solo lectura

**Pasos**:
1. Inicie sesión como LECTOR
2. Verifique acceso a:
   - ✅ Ver documentos asignados
   - ✅ Descargar archivos
   - ❌ No editar documentos
   - ❌ No cambiar estados
   - ❌ No agregar comentarios
   - ❌ No asignar documentos
   - ❌ No crear documentos

**✅ Resultado Esperado**: Solo visualización

---

### 4.2 Autenticación JWT

**Objetivo**: Verificar seguridad de sesiones.

**Pasos de Prueba 1 - Login Exitoso**:
1. Inicie sesión con credenciales correctas
2. Verifique que recibe un token JWT
3. Verifique que el token tiene expiración de 7 días

**✅ Resultado Esperado**:
- Token JWT generado
- Token almacenado en localStorage
- Token incluido en headers de todas las peticiones
- Token válido por 7 días

**Pasos de Prueba 2 - Login Fallido**:
1. Intente iniciar sesión con email inexistente
2. Intente con contraseña incorrecta

**✅ Resultado Esperado**:
- Error: "Credenciales inválidas"
- No se genera token
- No se permite acceso

**Pasos de Prueba 3 - Token Expirado**:
1. Modifique manualmente el token en localStorage
2. Intente hacer una petición
3. Verifique redirección a login

**✅ Resultado Esperado**:
- Petición rechazada con 401 Unauthorized
- Redirección automática a login
- Mensaje: "Sesión expirada"

---

### 4.3 Protección de Datos Sensibles

**Objetivo**: Verificar que los datos sensibles están protegidos.

**Pasos de Prueba**:
1. Verifique que las contraseñas están hasheadas:
   - No se pueden ver contraseñas en la base de datos
   - No se devuelven contraseñas en las API responses
2. Verifique que los archivos están protegidos:
   - No se puede acceder a archivos sin autenticación
   - URL directa a archivo requiere token válido
3. Verifique que los datos de auditoría no se pueden modificar

**✅ Resultado Esperado**:
- Contraseñas hasheadas con bcrypt (costo 10)
- Archivos solo accesibles con autenticación
- Datos de auditoría inmutables
- Información sensible no en logs

**Para verificar en la base de datos**:
```bash
ssh root@72.61.41.94
psql -U ministerial_user -d ministerial_db
SELECT email, password FROM "User" LIMIT 1;
```
La contraseña debe verse como: `$2b$10$...` (hash bcrypt)

---

### 4.4 Registro Completo de Actividad

**Objetivo**: Verificar que todas las acciones quedan registradas.

**Pasos de Prueba**:
1. Realice las siguientes acciones:
   - Crear un documento
   - Modificar el documento
   - Asignar el documento
   - Cambiar estado
   - Descargar un archivo
2. Vaya a Auditoría
3. Busque cada una de estas acciones

**✅ Resultado Esperado**:
- Todas las acciones aparecen en auditoría
- Cada registro incluye:
  - Timestamp exacto
  - Usuario que realizó la acción
  - Tipo de acción
  - Entidad afectada
  - Detalles de cambios (before/after para modificaciones)
- Los registros están ordenados cronológicamente
- Se pueden filtrar y buscar

**Tipos de Eventos Auditados**:
- `USER_LOGIN` - Inicio de sesión
- `USER_LOGOUT` - Cierre de sesión
- `DOCUMENT_CREATED` - Documento creado
- `DOCUMENT_UPDATED` - Documento modificado
- `DOCUMENT_DELETED` - Documento eliminado
- `DOCUMENT_STATE_CHANGED` - Cambio de estado
- `DOCUMENT_ASSIGNED` - Asignación
- `DOCUMENT_SIGNED` - Firma
- `FILE_UPLOADED` - Archivo subido
- `FILE_DOWNLOADED` - Archivo descargado
- `USER_CREATED` - Usuario creado
- `USER_UPDATED` - Usuario modificado

---

## MÓDULO 5: Interfaz de Usuario (3 Características)

### 5.1 Timeline Visual de Documentos

**Objetivo**: Verificar visualización del progreso de documentos.

**Pasos**:
1. Abra cualquier documento
2. Verifique que aparece el timeline en el panel derecho
3. Revise los siguientes elementos:
   - Etapas completadas (verde)
   - Etapa actual (azul)
   - Etapas pendientes (gris)
   - Fecha y hora de cada etapa
   - Usuario que completó cada etapa

**✅ Resultado Esperado**:
- Timeline vertical claro y legible
- 3 estados visuales distintos (completado, actual, pendiente)
- Iconos apropiados para cada etapa
- Información completa en cada nodo
- Responsive (se adapta a móvil)

**Elementos del Timeline**:
```
✅ PENDING - Completado (2026-02-01 10:00 AM) - Juan Pérez
🔵 MANUAL_ENTRY - En Progreso (2026-02-05 11:30 AM)
⚪ RECEIVED - Pendiente
⚪ REGISTRATION - Pendiente
⚪ DISTRIBUTION - Pendiente
...
```

---

### 5.2 Indicador de Progreso en Lista

**Objetivo**: Verificar barra de progreso en lista de documentos.

**Pasos**:
1. Vaya a "Buzón de Entrada"
2. Verifique que cada documento muestra:
   - Barra de progreso horizontal
   - Porcentaje de completitud
   - Etapa actual en texto

**✅ Resultado Esperado**:
- Barra de progreso visible en cada tarjeta
- Porcentaje calculado correctamente:
  - Ejemplo: Etapa 3 de 11 = 27%
  - Protocolo: Sub-etapa 5 de 8 = 62%
- Color apropiado:
  - Verde: > 75%
  - Azul: 25-75%
  - Gris: < 25%
- Texto descriptivo: "3 de 11 etapas completadas"

---

### 5.3 Tarjetas de Estadísticas

**Objetivo**: Verificar widget de estadísticas del dashboard.

**Pasos**:
1. Vaya a la página principal
2. Verifique el widget "Top 5 Etapas Activas"
3. Revise:
   - Lista de las 5 etapas con más documentos
   - Contador de documentos por etapa
   - Barra de progreso visual
   - Porcentaje del total

**✅ Resultado Esperado**:
- Widget visible y atractivo
- Datos correctos y actualizados
- Barras de progreso proporcionales
- Responsive (se adapta a móvil)
- Actualización automática

**Ejemplo de Visualización**:
```
Top 5 Etapas Activas

ANALYSIS ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░ 15 documentos (35%)
REVIEW ▓▓▓▓▓▓░░░░░░░░░░░░░░ 10 documentos (23%)
DRAFT_RESPONSE ▓▓▓▓░░░░░░░░░░░░░░░░ 8 documentos (19%)
DISTRIBUTION ▓▓░░░░░░░░░░░░░░░░░░ 6 documentos (14%)
REGISTRATION ▓░░░░░░░░░░░░░░░░░░░ 4 documentos (9%)
```

---

## 🔍 Verificación de Características Avanzadas

### Característica 1: Decreto Ministerial

**Objetivo**: Verificar creación de decretos con numeración especial.

**Pasos**:
1. Vaya a "Nueva Entrada"
2. Seleccione tipo: **DECREE** (Decreto)
3. Complete:
   - **Asunto**: `Decreto de Regulación de Transporte Urbano`
   - **Contenido**: Redacte el articulado del decreto
   - **Departamento**: Seleccione departamento emisor
4. Haga clic en "Crear Decreto"

**✅ Resultado Esperado**:
- Número automático con formato especial: `DECRETO-2026-MT-001`
- Plantilla de decreto aplicada automáticamente
- Campos específicos de decreto disponibles:
  - Considerandos
  - Articulado
  - Disposiciones transitorias
  - Vigencia
- Requiere firma ministerial obligatoria

---

### Característica 2: Código QR de Verificación

**Objetivo**: Verificar generación de códigos QR para documentos públicos.

**Pasos**:
1. Seleccione un documento firmado
2. Haga clic en "Generar Código QR"
3. Descargue el PDF con código QR
4. Escanee el código QR con su móvil

**✅ Resultado Esperado**:
- Código QR generado correctamente
- Al escanear, redirige a URL pública: `http://72.61.41.94/public/document/[id]`
- La página pública muestra:
  - Número de documento
  - Asunto
  - Fecha
  - Estado de firma (Válida/Inválida)
  - Mensaje: "Este documento ha sido firmado oficialmente"
- No muestra contenido sensible
- No requiere autenticación para verificar

---

### Característica 3: Exportación de Reportes

**Objetivo**: Verificar exportación de datos.

**Pasos**:
1. Vaya a "Auditoría"
2. Seleccione un rango de fechas
3. Haga clic en "Exportar Reporte"
4. Seleccione formato: **CSV** o **Excel**

**✅ Resultado Esperado**:
- Archivo se descarga correctamente
- Contiene todos los registros del rango seleccionado
- Columnas: Fecha, Usuario, Acción, Entidad, Detalles
- Formato correcto (CSV o XLSX)
- Se puede abrir en Excel/LibreOffice

---

### Característica 4: Búsqueda Avanzada

**Objetivo**: Verificar búsqueda con múltiples criterios.

**Pasos**:
1. Vaya a "Buzón de Entrada"
2. Haga clic en "Búsqueda Avanzada"
3. Configure múltiples filtros:
   - Rango de fechas
   - Tipo de documento
   - Estado
   - Prioridad
   - Departamento
   - Usuario responsable
4. Aplique los filtros

**✅ Resultado Esperado**:
- Los filtros se aplican correctamente
- Los resultados cumplen TODOS los criterios
- Se puede limpiar filtros
- La búsqueda es rápida (< 1 segundo)
- Se pueden guardar búsquedas frecuentes

---

### Característica 5: Notificaciones en Tiempo Real

**Objetivo**: Verificar sistema de notificaciones.

**Pasos**:
1. Abra dos navegadores:
   - Navegador 1: Usuario ADMIN
   - Navegador 2: Usuario REVISOR
2. En Navegador 1: Asigne un documento al REVISOR
3. En Navegador 2: Verifique que aparece notificación

**✅ Resultado Esperado**:
- Notificación aparece automáticamente (< 2 segundos)
- Contador de notificaciones se actualiza
- Badge rojo en el icono de campana
- Al hacer clic: lista de notificaciones
- Notificación incluye:
  - Mensaje descriptivo
  - Timestamp
  - Enlace al documento
- Se puede marcar como leída

---

## 🔧 Solución de Problemas

### Problema 1: No puedo iniciar sesión

**Síntomas**:
- Error "Credenciales inválidas"
- Pantalla de login se recarga

**Soluciones**:
1. Verifique que está usando las credenciales correctas
2. Verifique que el backend está corriendo:
   ```bash
   ssh root@72.61.41.94
   pm2 status
   ```
3. Verifique los logs:
   ```bash
   pm2 logs ministerial-api --lines 50
   ```
4. Pruebe con un usuario diferente
5. Limpie caché del navegador: Ctrl+Shift+Del

---

### Problema 2: Archivo no se sube

**Síntomas**:
- Error al subir archivo
- "File too large" o "Upload failed"

**Soluciones**:
1. Verifique el tamaño del archivo (máximo 50 MB)
2. Verifique el formato del archivo (permitidos: PDF, DOC, DOCX, JPG, PNG)
3. Verifique espacio en disco:
   ```bash
   ssh root@72.61.41.94
   df -h
   ```
4. Verifique logs de Nginx:
   ```bash
   tail -f /var/log/nginx/error.log
   ```
5. Intente con un archivo más pequeño

---

### Problema 3: OCR no extrae texto

**Síntomas**:
- "OCR failed"
- Texto extraído vacío

**Soluciones**:
1. Verifique que la imagen tiene texto legible
2. Verifique que la API Key de OpenAI está configurada
3. Verifique logs del backend:
   ```bash
   pm2 logs ministerial-api | grep "OCR"
   ```
4. Intente con otra imagen
5. Verifique que el archivo no está corrupto

---

### Problema 4: Emails no se envían

**Síntomas**:
- Notificaciones no llegan por email
- Solo notificaciones en la app

**Soluciones**:
1. Verifique configuración SMTP en `.env`:
   ```bash
   ssh root@72.61.41.94
   cat /var/www/ministerial-command-center/backend/.env | grep MAIL
   ```
2. Verifique logs de email:
   ```bash
   pm2 logs ministerial-api | grep "email"
   ```
3. Verifique que el email del usuario es válido
4. Revise carpeta de spam
5. Contacte al administrador del sistema

---

### Problema 5: Página no carga / Error 502

**Síntomas**:
- "Bad Gateway"
- "Cannot connect to server"

**Soluciones**:
1. Verifique que el backend está corriendo:
   ```bash
   ssh root@72.61.41.94
   pm2 status
   ```
2. Si está detenido, reinicie:
   ```bash
   pm2 restart ministerial-api
   ```
3. Verifique Nginx:
   ```bash
   systemctl status nginx
   ```
4. Verifique logs:
   ```bash
   pm2 logs ministerial-api --err --lines 50
   ```
5. Contacte al administrador del sistema

---

### Problema 6: Firma de Ministro no funciona

**Síntomas**:
- Botón de firma deshabilitado
- Error "No autorizado para firmar"

**Soluciones**:
1. Verifique que está usando la cuenta del Ministro
2. Verifique que el usuario tiene rol GABINETE
3. Verifique que la bandera `isMinister` está en `true`:
   ```sql
   SELECT email, role, "isMinister" FROM "User" WHERE email = 'ministro@ministerio.gq';
   ```
4. Si necesita habilitar otro usuario como Ministro:
   ```sql
   UPDATE "User" SET "isMinister" = true WHERE email = 'nuevo.ministro@ministerio.gq';
   ```
5. Recargue la página después del cambio

---

## ✅ Lista de Verificación Final

Use esta lista para verificar que todo está funcionando correctamente.

### Módulo: Autenticación y Usuarios
- [ ] Login con ADMIN funciona
- [ ] Login con GABINETE funciona
- [ ] Login con REVISOR funciona
- [ ] Login con LECTOR funciona
- [ ] Logout funciona correctamente
- [ ] Token JWT expira correctamente
- [ ] Permisos por rol funcionan correctamente

### Módulo: Gestión de Documentos
- [ ] Crear documento INCOMING
- [ ] Crear documento OUTGOING
- [ ] Subir archivos (PDF, Word, imágenes)
- [ ] Descargar archivos
- [ ] Reemplazar archivos (versionado)
- [ ] Ver historial de versiones
- [ ] Convertir PDF a Word
- [ ] Convertir Word a PDF
- [ ] Extraer texto con OCR
- [ ] Generar documento con IA
- [ ] Analizar documento con IA
- [ ] Buscar documentos
- [ ] Filtrar documentos
- [ ] Asignar documentos a usuarios
- [ ] Cambiar estado de documentos

### Módulo: Flujos de Trabajo
- [ ] Flujo INCOMING (11 etapas) funciona
- [ ] Flujo OUTGOING (6 etapas) funciona
- [ ] Aplicar sello de entrada manual
- [ ] Generar acuse de recibo
- [ ] Timeline visual muestra correctamente
- [ ] Indicador de progreso funciona
- [ ] Cambios de estado se registran

### Módulo: Protocolo de Firma
- [ ] Iniciar protocolo de firma
- [ ] Solo Ministro puede firmar (verificado)
- [ ] Firma digital funciona
- [ ] Firma manual con imagen funciona
- [ ] Aplicar sello oficial
- [ ] Verificación de firma y sello
- [ ] Registro del protocolo
- [ ] Notificaciones de finalización
- [ ] Timeline de protocolo completo

### Módulo: Expedientes (Casos)
- [ ] Crear nuevo expediente con todos los campos
- [ ] Código automático se genera (EXP-2026-XXXX)
- [ ] Selector de prioridad funciona (4 niveles)
- [ ] Indicadores visuales de prioridad (iconos naranja/rojo)
- [ ] Prioridad por defecto es "Media" (MEDIUM)
- [ ] Botón "Agregar Documento" visible en pestaña Documentos
- [ ] Diálogo "Agregar Documento" se abre correctamente
- [ ] Búsqueda por título funciona
- [ ] Búsqueda por número correlativo funciona
- [ ] Documentos ya en expediente están filtrados
- [ ] Agregar documento funciona correctamente
- [ ] Contador de documentos se actualiza
- [ ] Ver documentos del expediente
- [ ] Vinculación bidireccional documento ↔ expediente
- [ ] Buscar expedientes
- [ ] Timeline de expediente

### Módulo: Plazos y Recordatorios
- [ ] Crear plazo con BUSINESS_HOURS
- [ ] Crear plazo con CALENDAR_DAYS
- [ ] Cálculo de horas hábiles correcto
- [ ] Festivos excluidos correctamente
- [ ] Recordatorios se envían (verificar logs)
- [ ] Emails de recordatorio llegan
- [ ] Plazos próximos se muestran en dashboard

### Módulo: Auditoría
- [ ] Todos los eventos se registran
- [ ] Ver log de auditoría (ADMIN)
- [ ] Filtrar eventos de auditoría
- [ ] Exportar reporte de auditoría
- [ ] Logs son inmutables

### Módulo: Interfaz de Usuario
- [ ] Timeline vertical se visualiza bien
- [ ] Barra de progreso en lista funciona
- [ ] Dashboard muestra estadísticas
- [ ] Top 5 etapas activas correctas
- [ ] Responsive en móvil
- [ ] Notificaciones en tiempo real

### Módulo: Características Avanzadas
- [ ] Crear decreto ministerial
- [ ] Generar código QR
- [ ] Verificar documento público con QR
- [ ] Exportar reportes (CSV/Excel)
- [ ] Búsqueda avanzada con múltiples filtros

### Módulo: Seguridad
- [ ] Contraseñas hasheadas (bcrypt)
- [ ] Archivos protegidos (requieren auth)
- [ ] RBAC funciona correctamente
- [ ] Solo Ministro puede firmar (crítico)
- [ ] Datos sensibles no en logs

### Verificación de Rendimiento
- [ ] Lista de documentos carga en < 200ms
- [ ] Subida de 10MB en < 5 segundos
- [ ] OCR procesa en < 10 segundos
- [ ] IA genera en < 15 segundos
- [ ] Búsqueda responde en < 1 segundo

### Verificación de Sistema
- [ ] Backend corriendo (PM2 online)
- [ ] PostgreSQL activo
- [ ] Nginx activo
- [ ] Backups configurados
- [ ] Cron de recordatorios activo

---

## 📞 Soporte y Contacto

### Información de Soporte

**Durante Periodo de UAT**:
- **Duración**: 2 semanas desde inicio de pruebas
- **Canales**: Email, teléfono, reuniones virtuales
- **Tiempo de Respuesta**: < 24 horas

**Soporte Post-Entrega**:
- **Duración**: 30 días después de entrega final
- **Incluye**:
  - Corrección de bugs
  - Asistencia técnica
  - Capacitación adicional
- **No Incluye**:
  - Nuevas características
  - Cambios de diseño
  - Integraciones adicionales

### Reportar Problemas

Al reportar un problema, incluya:
1. **Descripción del problema**: Qué está tratando de hacer
2. **Pasos para reproducir**: Cómo llegar al error
3. **Resultado esperado**: Qué debería pasar
4. **Resultado actual**: Qué pasó realmente
5. **Capturas de pantalla**: Si es posible
6. **Usuario y rol**: Con qué cuenta está probando
7. **Navegador**: Chrome, Firefox, etc.

---

## 📚 Documentación Adicional

Para información más detallada, consulte:

1. **[MANUAL_DE_USUARIO.md](MANUAL_DE_USUARIO.md)**
   - Manual completo del usuario final
   - Instrucciones paso a paso para todas las funciones

2. **[GUIA_RAPIDA.md](GUIA_RAPIDA.md)**
   - Guía rápida de inicio (10 minutos)
   - Funciones más usadas

3. **[PRODUCTION_DEPLOYMENT_GUIDE.md](PRODUCTION_DEPLOYMENT_GUIDE.md)**
   - Guía de despliegue en producción
   - Configuración del servidor

4. **[SYSTEM_MAINTENANCE_GUIDE.md](SYSTEM_MAINTENANCE_GUIDE.md)**
   - Guía de mantenimiento del sistema
   - Backups, monitoreo, troubleshooting

5. **[UAT_PLAN.md](UAT_PLAN.md)**
   - Plan de pruebas de aceptación de usuario
   - Casos de prueba detallados

6. **[TRAINING_MATERIALS.md](TRAINING_MATERIALS.md)**
   - Materiales de capacitación
   - Plan de entrenamiento de 2 días

---

## 📊 Métricas de Éxito

### Criterios de Aceptación

El sistema se considerará exitoso si cumple:

**Funcionalidad**:
- ✅ 95%+ de características funcionando (38/40 = 95% ✓)
- ✅ 0 bugs críticos
- ✅ < 5 bugs menores

**Rendimiento**:
- ✅ Tiempo de carga < 200ms
- ✅ Subida de archivos < 5s (10MB)
- ✅ Procesamiento OCR < 10s
- ✅ Generación IA < 15s

**Seguridad**:
- ✅ Autenticación JWT funcionando
- ✅ RBAC correctamente implementado
- ✅ Firma solo por Ministro (crítico)
- ✅ Auditoría completa

**Usabilidad**:
- ✅ Interfaz intuitiva
- ✅ Responsive en móvil
- ✅ Mensajes de error claros
- ✅ Feedback visual apropiado

---

## 🎯 Próximos Pasos

### Para el Cliente

1. **Semana 1-2**: Realizar UAT con esta guía
2. **Reportar**: Todos los bugs encontrados
3. **Programar**: Sesiones de capacitación
4. **Proporcionar**: Imagen del emblema nacional (Fase 2)
5. **Revisar**: VIDEO_TUTORIAL_SCRIPTS.md para grabación

### Para el Equipo de Desarrollo

1. **Recibir**: Feedback de UAT
2. **Corregir**: Bugs identificados
3. **Finalizar**: Fase 2 (emblema nacional)
4. **Preparar**: Materiales finales de capacitación
5. **Coordinar**: Reunión de entrega final

---

**Fecha de Creación**: 5 de febrero de 2026
**Versión**: 1.1
**Última Actualización**: 8 de febrero de 2026

**Estado del Proyecto**: 🟢 95% Completo - Sección 1.11 Desplegada y Lista para UAT

---

**Ministerio de Transportes**
**República de Guinea Ecuatorial**
**Centro de Mando Ministerial**

*"Modernizando la administración pública para un mejor servicio"*
