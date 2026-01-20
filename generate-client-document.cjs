const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, UnderlineType, convertInchesToTwip, BorderStyle } = require('docx');

// Create the document
const doc = new Document({
  sections: [{
    properties: {
      page: {
        margin: {
          top: convertInchesToTwip(1),
          right: convertInchesToTwip(1),
          bottom: convertInchesToTwip(1),
          left: convertInchesToTwip(1),
        },
      },
    },
    children: [
      // Title
      new Paragraph({
        text: "SEMANA 1 - GUÍA DE PRUEBAS Y IMPLEMENTACIÓN",
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),

      new Paragraph({
        children: [
          new TextRun({
            text: "Centro de Comando Ministerial - MTTSIA",
            bold: true,
            size: 24,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      }),

      new Paragraph({
        children: [
          new TextRun({
            text: "República de Guinea Ecuatorial",
            italics: true,
            size: 22,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),

      new Paragraph({
        text: "Fecha: 17 de Enero, 2026",
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "Estado: Semana 1 - COMPLETADA ✓",
        alignment: AlignmentType.CENTER,
        spacing: { after: 600 },
        bold: true,
      }),

      // Section 1: Executive Summary
      new Paragraph({
        text: "1. RESUMEN EJECUTIVO",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      }),

      new Paragraph({
        text: "La Semana 1 del proyecto ha sido completada exitosamente. Todos los módulos de autenticación, gestión de perfiles y notificaciones están funcionando correctamente en el servidor de producción.",
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "Logros Principales:",
        bold: true,
        spacing: { after: 100 },
      }),

      new Paragraph({
        text: "✓ Sistema de autenticación completo (Login/Registro/Perfil)",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "✓ Notificaciones visuales hermosas con iconos",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "✓ Formato automático de teléfono para Guinea Ecuatorial (+240)",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "✓ Gestión completa de perfiles de usuario",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "✓ 8 departamentos ministeriales configurados",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "✓ Sistema desplegado en servidor VPS (72.61.41.94)",
        bullet: { level: 0 },
        spacing: { after: 400 },
      }),

      // Section 2: How to Access
      new Paragraph({
        text: "2. CÓMO ACCEDER AL SISTEMA",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      }),

      new Paragraph({
        text: "URL de Acceso:",
        bold: true,
        spacing: { after: 100 },
      }),

      new Paragraph({
        children: [
          new TextRun({
            text: "Frontend (Aplicación Principal): ",
            bold: true,
          }),
          new TextRun({
            text: "http://72.61.41.94",
            color: "0000FF",
            underline: { type: UnderlineType.SINGLE },
          }),
        ],
        spacing: { after: 100 },
      }),

      new Paragraph({
        children: [
          new TextRun({
            text: "API Backend: ",
            bold: true,
          }),
          new TextRun({
            text: "http://72.61.41.94/api",
            color: "0000FF",
            underline: { type: UnderlineType.SINGLE },
          }),
        ],
        spacing: { after: 100 },
      }),

      new Paragraph({
        children: [
          new TextRun({
            text: "Estado del Sistema: ",
            bold: true,
          }),
          new TextRun({
            text: "http://72.61.41.94/api/health",
            color: "0000FF",
            underline: { type: UnderlineType.SINGLE },
          }),
        ],
        spacing: { after: 400 },
      }),

      new Paragraph({
        text: "Requisitos:",
        bold: true,
        spacing: { after: 100 },
      }),

      new Paragraph({
        text: "• Navegador web moderno (Chrome, Firefox, Edge, Safari)",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Conexión a internet estable",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Credenciales de acceso válidas",
        bullet: { level: 0 },
        spacing: { after: 400 },
      }),

      // Section 3: Test Credentials
      new Paragraph({
        text: "3. CREDENCIALES DE PRUEBA",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      }),

      new Paragraph({
        text: "Se han creado 4 cuentas de prueba con diferentes niveles de acceso:",
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "3.1 Cuenta de Administrador",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 },
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Email: ", bold: true }),
          new TextRun({ text: "admin@mttsia.gob.gq" }),
        ],
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Contraseña: ", bold: true }),
          new TextRun({ text: "Admin123!" }),
        ],
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Rol: ", bold: true }),
          new TextRun({ text: "ADMIN (Acceso completo al sistema)" }),
        ],
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Departamento: ", bold: true }),
          new TextRun({ text: "Gabinete Ministerial" }),
        ],
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "3.2 Cuenta de Gabinete",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 },
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Email: ", bold: true }),
          new TextRun({ text: "gabinete@mttsia.gob.gq" }),
        ],
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Contraseña: ", bold: true }),
          new TextRun({ text: "Gabinete123!" }),
        ],
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Rol: ", bold: true }),
          new TextRun({ text: "GABINETE (Aprobación ministerial)" }),
        ],
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "3.3 Cuenta de Revisor",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 },
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Email: ", bold: true }),
          new TextRun({ text: "revisor@mttsia.gob.gq" }),
        ],
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Contraseña: ", bold: true }),
          new TextRun({ text: "Revisor123!" }),
        ],
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Rol: ", bold: true }),
          new TextRun({ text: "REVISOR (Revisión de documentos)" }),
        ],
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "3.4 Cuenta de Lector",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 },
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Email: ", bold: true }),
          new TextRun({ text: "lector@mttsia.gob.gq" }),
        ],
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Contraseña: ", bold: true }),
          new TextRun({ text: "Lector123!" }),
        ],
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Rol: ", bold: true }),
          new TextRun({ text: "LECTOR (Solo lectura)" }),
        ],
        spacing: { after: 400 },
      }),

      // Section 4: Testing Guide
      new Paragraph({
        text: "4. GUÍA DE PRUEBAS PASO A PASO",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      }),

      new Paragraph({
        text: "4.1 PRUEBA DE INICIO DE SESIÓN",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 },
      }),

      new Paragraph({
        text: "Pasos:",
        bold: true,
        spacing: { after: 100 },
      }),

      new Paragraph({
        text: "1. Abra su navegador web",
        numbering: { reference: "test-numbering", level: 0 },
      }),

      new Paragraph({
        text: "2. Vaya a: http://72.61.41.94",
        numbering: { reference: "test-numbering", level: 0 },
      }),

      new Paragraph({
        text: "3. Ingrese email: admin@mttsia.gob.gq",
        numbering: { reference: "test-numbering", level: 0 },
      }),

      new Paragraph({
        text: "4. Ingrese contraseña: Admin123!",
        numbering: { reference: "test-numbering", level: 0 },
      }),

      new Paragraph({
        text: "5. (Opcional) Marque 'Recordarme' si desea mantener la sesión",
        numbering: { reference: "test-numbering", level: 0 },
      }),

      new Paragraph({
        text: "6. Haga clic en 'Iniciar sesión'",
        numbering: { reference: "test-numbering", level: 0 },
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "Resultados Esperados:",
        bold: true,
        spacing: { after: 100 },
      }),

      new Paragraph({
        text: "✓ Aparece notificación verde: '¡Inicio de sesión exitoso!'",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "✓ La notificación tiene un icono de verificación",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "✓ La notificación puede cerrarse con la 'X'",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "✓ Redirección automática al Dashboard",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "✓ En el Dashboard aparece: 'Bienvenido de vuelta, Admin'",
        bullet: { level: 0 },
        spacing: { after: 400 },
      }),

      new Paragraph({
        text: "4.2 PRUEBA DE ACTUALIZACIÓN DE PERFIL",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      }),

      new Paragraph({
        text: "Pasos:",
        bold: true,
        spacing: { after: 100 },
      }),

      new Paragraph({
        text: "1. Una vez autenticado, busque su avatar en la esquina superior derecha",
        numbering: { reference: "profile-numbering", level: 0 },
      }),

      new Paragraph({
        text: "2. Haga clic en el avatar para abrir el menú desplegable",
        numbering: { reference: "profile-numbering", level: 0 },
      }),

      new Paragraph({
        text: "3. Seleccione 'Mi perfil' del menú",
        numbering: { reference: "profile-numbering", level: 0 },
      }),

      new Paragraph({
        text: "4. Se abrirá un modal con sus datos actuales pre-cargados",
        numbering: { reference: "profile-numbering", level: 0 },
      }),

      new Paragraph({
        text: "5. Verifique que aparecen dos campos separados: 'Nombre' y 'Apellido'",
        numbering: { reference: "profile-numbering", level: 0 },
      }),

      new Paragraph({
        text: "6. Modifique algún campo (ej: teléfono)",
        numbering: { reference: "profile-numbering", level: 0 },
      }),

      new Paragraph({
        text: "7. Si ingresa teléfono, escriba números y observe el formato automático a +240 XXX XXX XXX",
        numbering: { reference: "profile-numbering", level: 0 },
      }),

      new Paragraph({
        text: "8. Haga clic en 'Guardar cambios'",
        numbering: { reference: "profile-numbering", level: 0 },
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "Resultados Esperados:",
        bold: true,
        spacing: { after: 100 },
      }),

      new Paragraph({
        text: "✓ Notificación verde: '¡Perfil actualizado!'",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "✓ El modal se cierra automáticamente",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "✓ Los cambios se guardan en la base de datos",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "✓ Al volver a abrir el modal, los cambios persisten",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "✓ El teléfono aparece formateado: +240 XXX XXX XXX",
        bullet: { level: 0 },
        spacing: { after: 400 },
      }),

      new Paragraph({
        text: "4.3 PRUEBA DE REGISTRO DE NUEVO USUARIO",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      }),

      new Paragraph({
        text: "Pasos:",
        bold: true,
        spacing: { after: 100 },
      }),

      new Paragraph({
        text: "1. Cierre sesión (si está autenticado)",
        numbering: { reference: "register-numbering", level: 0 },
      }),

      new Paragraph({
        text: "2. En la página de login, haga clic en 'Crear cuenta'",
        numbering: { reference: "register-numbering", level: 0 },
      }),

      new Paragraph({
        text: "3. Complete el formulario de registro:",
        numbering: { reference: "register-numbering", level: 0 },
      }),

      new Paragraph({
        text: "- Nombre: Prueba",
        bullet: { level: 1 },
      }),

      new Paragraph({
        text: "- Apellido: Usuario",
        bullet: { level: 1 },
      }),

      new Paragraph({
        text: "- Email: prueba.usuario@mttsia.gob.gq",
        bullet: { level: 1 },
      }),

      new Paragraph({
        text: "- Contraseña: Prueba123!@#",
        bullet: { level: 1 },
      }),

      new Paragraph({
        text: "- Confirmar contraseña: Prueba123!@#",
        bullet: { level: 1 },
      }),

      new Paragraph({
        text: "- Rol: Seleccione 'Lector'",
        bullet: { level: 1 },
      }),

      new Paragraph({
        text: "- Departamento: Seleccione cualquiera de los 8 disponibles",
        bullet: { level: 1 },
      }),

      new Paragraph({
        text: "4. Haga clic en 'Crear Cuenta'",
        numbering: { reference: "register-numbering", level: 0 },
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "Resultados Esperados:",
        bold: true,
        spacing: { after: 100 },
      }),

      new Paragraph({
        text: "✓ Notificación verde: '¡Registro exitoso!'",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "✓ Mensaje: 'Tu cuenta ha sido creada. Redirigiendo al dashboard...'",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "✓ NO aparece error 'Departamento no encontrado'",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "✓ Auto-login después de 1.5 segundos",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "✓ Redirección al Dashboard",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "✓ Puede volver a iniciar sesión con las nuevas credenciales",
        bullet: { level: 0 },
        spacing: { after: 400 },
      }),

      new Paragraph({
        text: "4.4 PRUEBA DE FORMATO DE TELÉFONO",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      }),

      new Paragraph({
        text: "Esta característica formatea automáticamente los números de teléfono al formato de Guinea Ecuatorial.",
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "Pasos:",
        bold: true,
        spacing: { after: 100 },
      }),

      new Paragraph({
        text: "1. Abra el modal de perfil (avatar → Mi perfil)",
        numbering: { reference: "phone-numbering", level: 0 },
      }),

      new Paragraph({
        text: "2. Haga clic en el campo 'Teléfono (opcional)'",
        numbering: { reference: "phone-numbering", level: 0 },
      }),

      new Paragraph({
        text: "3. Escriba solo números, por ejemplo: 222333444",
        numbering: { reference: "phone-numbering", level: 0 },
      }),

      new Paragraph({
        text: "4. Observe cómo se formatea automáticamente mientras escribe",
        numbering: { reference: "phone-numbering", level: 0 },
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "Resultados Esperados:",
        bold: true,
        spacing: { after: 100 },
      }),

      new Paragraph({
        text: "✓ Al escribir '222333444' aparece: '+240 222 333 444'",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "✓ El prefijo +240 se agrega automáticamente",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "✓ Los espacios se insertan automáticamente",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "✓ No se permiten letras u otros caracteres",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "✓ Máximo 16 caracteres (incluidos espacios)",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "✓ Debajo del campo aparece: 'Formato: +240 XXX XXX XXX'",
        bullet: { level: 0 },
        spacing: { after: 400 },
      }),

      // Section 5: Departments
      new Paragraph({
        text: "5. DEPARTAMENTOS DISPONIBLES",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      }),

      new Paragraph({
        text: "El sistema tiene configurados 8 departamentos ministeriales con IDs reales de base de datos:",
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "1. Gabinete Ministerial",
        numbering: { reference: "dept-numbering", level: 0 },
      }),

      new Paragraph({
        text: "   - Nivel jerárquico más alto del ministerio",
        bullet: { level: 1 },
        spacing: { after: 100 },
      }),

      new Paragraph({
        text: "2. Dirección General de Transportes",
        numbering: { reference: "dept-numbering", level: 0 },
      }),

      new Paragraph({
        text: "   - Gestión de transporte aéreo, marítimo y terrestre",
        bullet: { level: 1 },
        spacing: { after: 100 },
      }),

      new Paragraph({
        text: "3. Dirección General de Telecomunicaciones",
        numbering: { reference: "dept-numbering", level: 0 },
      }),

      new Paragraph({
        text: "   - Regulación de telecomunicaciones y espectro",
        bullet: { level: 1 },
        spacing: { after: 100 },
      }),

      new Paragraph({
        text: "4. Dirección General de Sistemas de Inteligencia Artificial",
        numbering: { reference: "dept-numbering", level: 0 },
      }),

      new Paragraph({
        text: "   - Innovación y tecnología IA",
        bullet: { level: 1 },
        spacing: { after: 100 },
      }),

      new Paragraph({
        text: "5. Dirección General de Administración",
        numbering: { reference: "dept-numbering", level: 0 },
      }),

      new Paragraph({
        text: "   - Gestión administrativa y financiera",
        bullet: { level: 1 },
        spacing: { after: 100 },
      }),

      new Paragraph({
        text: "6. Dirección General de Recursos Humanos",
        numbering: { reference: "dept-numbering", level: 0 },
      }),

      new Paragraph({
        text: "   - Gestión de personal ministerial",
        bullet: { level: 1 },
        spacing: { after: 100 },
      }),

      new Paragraph({
        text: "7. Dirección General de Planificación",
        numbering: { reference: "dept-numbering", level: 0 },
      }),

      new Paragraph({
        text: "   - Planificación estratégica ministerial",
        bullet: { level: 1 },
        spacing: { after: 100 },
      }),

      new Paragraph({
        text: "8. Asesoría Jurídica",
        numbering: { reference: "dept-numbering", level: 0 },
      }),

      new Paragraph({
        text: "   - Asesoramiento legal y normativo",
        bullet: { level: 1 },
        spacing: { after: 400 },
      }),

      // Section 6: Features Implemented
      new Paragraph({
        text: "6. CARACTERÍSTICAS IMPLEMENTADAS",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      }),

      new Paragraph({
        text: "6.1 Sistema de Autenticación",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 },
      }),

      new Paragraph({
        text: "• Login con email y contraseña",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Función 'Recordarme' para sesiones persistentes",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Registro de nuevos usuarios",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Selección de rol y departamento en registro",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Auto-login después de registro exitoso",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Tokens JWT con expiración (15 minutos access, 7 días refresh)",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Renovación automática de tokens",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Cierre de sesión seguro",
        bullet: { level: 0 },
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "6.2 Gestión de Perfiles",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 },
      }),

      new Paragraph({
        text: "• Actualización de nombre (Nombre y Apellido separados)",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Actualización de email con validación de unicidad",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Campo de teléfono con formato automático (+240)",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Campo de cargo/posición",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Modal que se abre con datos pre-cargados",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Cierre automático del modal tras guardar",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Cambios persistentes en base de datos",
        bullet: { level: 0 },
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "6.3 Sistema de Notificaciones (Toasts)",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 },
      }),

      new Paragraph({
        text: "• Notificaciones visuales hermosas",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Posición: esquina superior derecha",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Colores: verde (éxito), rojo (error)",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Bordes coloreados (izquierda: 4px)",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Iconos personalizados por tipo",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Botón X para cerrar manualmente",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Auto-cierre después de 3-4 segundos",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Animaciones suaves de entrada/salida",
        bullet: { level: 0 },
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "6.4 Formato de Teléfono",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 },
      }),

      new Paragraph({
        text: "• Formato específico de Guinea Ecuatorial: +240 XXX XXX XXX",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Prefijo +240 automático",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Formateo en tiempo real mientras escribe",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Limpieza automática de caracteres no numéricos",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Texto de ayuda debajo del campo",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Funciona con copiar/pegar",
        bullet: { level: 0 },
        spacing: { after: 400 },
      }),

      // Section 7: Technical Details
      new Paragraph({
        text: "7. DETALLES TÉCNICOS",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      }),

      new Paragraph({
        text: "7.1 Tecnologías Utilizadas",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 },
      }),

      new Paragraph({
        text: "Frontend:",
        bold: true,
        spacing: { after: 50 },
      }),

      new Paragraph({
        text: "• React 18.3.1 - Framework de interfaz de usuario",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• TypeScript 5.8.3 - Lenguaje con tipado estático",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Vite 5.4.19 - Herramienta de build ultrarrápida",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Tailwind CSS 3.4.17 - Framework de estilos",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• shadcn/ui - Componentes UI de alta calidad",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Sonner - Sistema de notificaciones",
        bullet: { level: 0 },
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "Backend:",
        bold: true,
        spacing: { after: 50 },
      }),

      new Paragraph({
        text: "• NestJS 10.3.0 - Framework backend empresarial",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• PostgreSQL 17.7 - Base de datos relacional",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Prisma ORM 5.22.0 - ORM moderno y seguro",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• JWT - Autenticación con tokens",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• bcrypt - Hash de contraseñas",
        bullet: { level: 0 },
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "Infraestructura:",
        bold: true,
        spacing: { after: 50 },
      }),

      new Paragraph({
        text: "• VPS Ubuntu 22.04 LTS",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Nginx 1.28.0 - Servidor web",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• PM2 - Gestor de procesos",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• IP: 72.61.41.94",
        bullet: { level: 0 },
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "7.2 Arquitectura del Sistema",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 },
      }),

      new Paragraph({
        text: "El sistema utiliza una arquitectura de 3 capas:",
        spacing: { after: 100 },
      }),

      new Paragraph({
        text: "1. Capa de Presentación (Frontend)",
        bold: true,
      }),

      new Paragraph({
        text: "   - React con componentes reutilizables",
        bullet: { level: 1 },
      }),

      new Paragraph({
        text: "   - Comunicación con API mediante fetch",
        bullet: { level: 1 },
      }),

      new Paragraph({
        text: "   - Gestión de estado global con Context API",
        bullet: { level: 1 },
        spacing: { after: 100 },
      }),

      new Paragraph({
        text: "2. Capa de Aplicación (Backend API)",
        bold: true,
      }),

      new Paragraph({
        text: "   - NestJS con arquitectura modular",
        bullet: { level: 1 },
      }),

      new Paragraph({
        text: "   - Validación de datos con DTOs",
        bullet: { level: 1 },
      }),

      new Paragraph({
        text: "   - Middleware de autenticación JWT",
        bullet: { level: 1 },
        spacing: { after: 100 },
      }),

      new Paragraph({
        text: "3. Capa de Datos (PostgreSQL)",
        bold: true,
      }),

      new Paragraph({
        text: "   - Base de datos relacional normalizada",
        bullet: { level: 1 },
      }),

      new Paragraph({
        text: "   - Migraciones con Prisma",
        bullet: { level: 1 },
      }),

      new Paragraph({
        text: "   - Datos semilla (seed) para testing",
        bullet: { level: 1 },
        spacing: { after: 400 },
      }),

      // Section 8: Security
      new Paragraph({
        text: "8. SEGURIDAD IMPLEMENTADA",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      }),

      new Paragraph({
        text: "• Contraseñas hasheadas con bcrypt (salt rounds: 10)",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Tokens JWT con expiración controlada",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Validación de datos en frontend y backend",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Protección contra inyección SQL (Prisma ORM)",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Validación de unicidad de email",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Verificación de existencia de departamentos",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• HTTPS recomendado para producción (actualmente HTTP)",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Rate limiting en API (100 req/15min)",
        bullet: { level: 0 },
        spacing: { after: 400 },
      }),

      // Section 9: Known Issues
      new Paragraph({
        text: "9. PROBLEMAS RESUELTOS",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      }),

      new Paragraph({
        text: "Durante la Semana 1, se identificaron y resolvieron los siguientes problemas:",
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "9.1 Modal de Perfil con Campos Vacíos",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 },
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Problema: ", bold: true }),
          new TextRun({ text: "Al abrir el modal, los campos estaban vacíos" }),
        ],
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Causa: ", bold: true }),
          new TextRun({ text: "Se llamaba setProfileOpen(true) en lugar de handleProfileOpen(true)" }),
        ],
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Solución: ", bold: true }),
          new TextRun({ text: "Cambiado a handleProfileOpen(true) para inicializar datos" }),
        ],
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Estado: ", bold: true, color: "008000" }),
          new TextRun({ text: "✓ RESUELTO", bold: true, color: "008000" }),
        ],
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "9.2 Error de Icono CheckCircle2",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 },
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Problema: ", bold: true }),
          new TextRun({ text: "'CheckCircle2 is not defined' en toast" }),
        ],
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Causa: ", bold: true }),
          new TextRun({ text: "Faltaba importar CheckCircle2 de lucide-react" }),
        ],
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Solución: ", bold: true }),
          new TextRun({ text: "Agregado CheckCircle2 a imports" }),
        ],
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Estado: ", bold: true, color: "008000" }),
          new TextRun({ text: "✓ RESUELTO", bold: true, color: "008000" }),
        ],
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "9.3 Error 'Departamento no encontrado'",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 },
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Problema: ", bold: true }),
          new TextRun({ text: "Registro fallaba con error de departamento" }),
        ],
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Causa: ", bold: true }),
          new TextRun({ text: "IDs de departamento falsos (dept1, dept2) en lugar de IDs reales" }),
        ],
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Solución: ", bold: true }),
          new TextRun({ text: "Reemplazados con 8 IDs reales de la base de datos" }),
        ],
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Estado: ", bold: true, color: "008000" }),
          new TextRun({ text: "✓ RESUELTO", bold: true, color: "008000" }),
        ],
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "9.4 Nombre Incorrecto en Dashboard",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 },
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Problema: ", bold: true }),
          new TextRun({ text: "Dashboard mostraba 'MARIA' en lugar del nombre real" }),
        ],
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Causa: ", bold: true }),
          new TextRun({ text: "Dashboard usaba currentUser de mockData en lugar del usuario autenticado" }),
        ],
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Solución: ", bold: true }),
          new TextRun({ text: "Cambiado a usar user.firstName de AuthContext" }),
        ],
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Estado: ", bold: true, color: "008000" }),
          new TextRun({ text: "✓ RESUELTO", bold: true, color: "008000" }),
        ],
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "9.5 Toast No Descartable",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 },
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Problema: ", bold: true }),
          new TextRun({ text: "No se podía cerrar el toast haciendo clic" }),
        ],
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Causa: ", bold: true }),
          new TextRun({ text: "closeButton no estaba habilitado en Sonner" }),
        ],
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Solución: ", bold: true }),
          new TextRun({ text: "Agregado closeButton={true} y estilos del botón" }),
        ],
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Estado: ", bold: true, color: "008000" }),
          new TextRun({ text: "✓ RESUELTO", bold: true, color: "008000" }),
        ],
        spacing: { after: 400 },
      }),

      // Section 10: Troubleshooting
      new Paragraph({
        text: "10. SOLUCIÓN DE PROBLEMAS",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      }),

      new Paragraph({
        text: "Si encuentra algún problema durante las pruebas:",
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "Problema: No puedo iniciar sesión",
        bold: true,
        spacing: { after: 50 },
      }),

      new Paragraph({
        text: "• Verifique que está usando las credenciales correctas",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Las contraseñas distinguen mayúsculas y minúsculas",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Verifique que el backend está corriendo: http://72.61.41.94/api/health",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Limpie la caché del navegador (Ctrl + Shift + R)",
        bullet: { level: 0 },
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "Problema: Las notificaciones no aparecen",
        bold: true,
        spacing: { after: 50 },
      }),

      new Paragraph({
        text: "• Haga un hard refresh del navegador (Ctrl + Shift + R)",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Abra la consola del navegador (F12) y busque errores JavaScript",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Verifique que no tiene bloqueadores de pop-ups activos",
        bullet: { level: 0 },
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "Problema: El modal de perfil no se abre",
        bold: true,
        spacing: { after: 50 },
      }),

      new Paragraph({
        text: "• Verifique que está autenticado correctamente",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Recargue la página completamente",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Revise la consola del navegador por errores",
        bullet: { level: 0 },
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "Problema: El teléfono no se formatea",
        bold: true,
        spacing: { after: 50 },
      }),

      new Paragraph({
        text: "• Escriba solo números, no letras",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• El formateo es automático, no agregue el +240 manualmente",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Si pegó un número, el formateo se aplica automáticamente",
        bullet: { level: 0 },
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "Problema: Error 401 Unauthorized",
        bold: true,
        spacing: { after: 50 },
      }),

      new Paragraph({
        text: "• Este error es normal al cargar la página por primera vez",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Significa que no hay sesión activa",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Simplemente inicie sesión y el error desaparecerá",
        bullet: { level: 0 },
        spacing: { after: 400 },
      }),

      // Section 11: Next Steps
      new Paragraph({
        text: "11. PRÓXIMOS PASOS (SEMANA 2)",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      }),

      new Paragraph({
        text: "Para la Semana 2, se implementarán las siguientes características:",
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "• Sistema de gestión documental",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Bandeja de entrada y salida de documentos",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Carga y descarga de archivos",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Sistema de workflow y aprobaciones",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Firma electrónica de documentos",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Notificaciones de plazos y vencimientos",
        bullet: { level: 0 },
        spacing: { after: 400 },
      }),

      // Section 12: Legal Module (if approved)
      new Paragraph({
        text: "12. MÓDULO LEGAL (PROPUESTA)",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      }),

      new Paragraph({
        text: "Basado en el feedback del Sr. Elliot Honorato, se ha preparado una propuesta para un Módulo de Inteligencia Legal que cubrirá:",
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "1. Legislación de Transportes (aéreo, marítimo, terrestre)",
        numbering: { reference: "legal-numbering", level: 0 },
      }),

      new Paragraph({
        text: "2. Sector Postal (leyes internacionales y locales)",
        numbering: { reference: "legal-numbering", level: 0 },
      }),

      new Paragraph({
        text: "3. Telecomunicaciones (ITU, regulaciones nacionales)",
        numbering: { reference: "legal-numbering", level: 0 },
      }),

      new Paragraph({
        text: "4. Ciberseguridad y regulaciones de IA",
        numbering: { reference: "legal-numbering", level: 0 },
      }),

      new Paragraph({
        text: "5. Derecho comercial internacional y arbitraje",
        numbering: { reference: "legal-numbering", level: 0 },
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "Este módulo está planificado para las Semanas 3-7 con un costo estimado de $17,000 - $26,000.",
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "Ver documento separado: CLIENT_RESPONSE_LEGAL_REQUIREMENTS.md para detalles completos.",
        italics: true,
        spacing: { after: 400 },
      }),

      // Section 13: Support
      new Paragraph({
        text: "13. SOPORTE Y CONTACTO",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      }),

      new Paragraph({
        text: "Para cualquier consulta o problema técnico:",
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "Desarrollador Principal:",
        bold: true,
        spacing: { after: 50 },
      }),

      new Paragraph({
        text: "• Nombre: [Tu Nombre]",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Email: [Tu Email]",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Teléfono: [Tu Teléfono]",
        bullet: { level: 0 },
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "Documentación Técnica:",
        bold: true,
        spacing: { after: 50 },
      }),

      new Paragraph({
        text: "• Reporte Técnico Completo: WEEK1_IMPLEMENTATION_REPORT.md",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Propuesta Módulo Legal: CLIENT_RESPONSE_LEGAL_REQUIREMENTS.md",
        bullet: { level: 0 },
      }),

      new Paragraph({
        text: "• Repositorio de Código: [URL del repositorio si aplica]",
        bullet: { level: 0 },
        spacing: { after: 400 },
      }),

      // Section 14: Glossary
      new Paragraph({
        text: "14. GLOSARIO DE TÉRMINOS",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "API: ", bold: true }),
          new TextRun({ text: "Application Programming Interface - Interfaz de programación de aplicaciones" }),
        ],
        spacing: { after: 100 },
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "JWT: ", bold: true }),
          new TextRun({ text: "JSON Web Token - Token de autenticación basado en JSON" }),
        ],
        spacing: { after: 100 },
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "VPS: ", bold: true }),
          new TextRun({ text: "Virtual Private Server - Servidor privado virtual" }),
        ],
        spacing: { after: 100 },
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Toast: ", bold: true }),
          new TextRun({ text: "Notificación visual temporal que aparece en la pantalla" }),
        ],
        spacing: { after: 100 },
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Modal: ", bold: true }),
          new TextRun({ text: "Ventana emergente que aparece sobre el contenido principal" }),
        ],
        spacing: { after: 100 },
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Dashboard: ", bold: true }),
          new TextRun({ text: "Panel de control principal con resumen de información" }),
        ],
        spacing: { after: 100 },
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Frontend: ", bold: true }),
          new TextRun({ text: "Parte visual de la aplicación que el usuario ve" }),
        ],
        spacing: { after: 100 },
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Backend: ", bold: true }),
          new TextRun({ text: "Servidor que procesa la lógica y datos de la aplicación" }),
        ],
        spacing: { after: 100 },
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Base de Datos: ", bold: true }),
          new TextRun({ text: "Sistema que almacena toda la información del sistema" }),
        ],
        spacing: { after: 400 },
      }),

      // Footer
      new Paragraph({
        text: "─────────────────────────────────────────────────────",
        alignment: AlignmentType.CENTER,
        spacing: { before: 600, after: 200 },
      }),

      new Paragraph({
        text: "FIN DEL DOCUMENTO",
        alignment: AlignmentType.CENTER,
        bold: true,
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "Ministerio de Transportes, Telecomunicaciones y Sistemas de Inteligencia Artificial",
        alignment: AlignmentType.CENTER,
        italics: true,
        spacing: { after: 100 },
      }),

      new Paragraph({
        text: "República de Guinea Ecuatorial",
        alignment: AlignmentType.CENTER,
        italics: true,
        spacing: { after: 100 },
      }),

      new Paragraph({
        text: "2026",
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      }),
    ],
  }],
});

// Generate the document
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("SEMANA1_GUIA_PRUEBAS_CLIENTE.docx", buffer);
  console.log("✓ Documento Word creado exitosamente: SEMANA1_GUIA_PRUEBAS_CLIENTE.docx");
});
