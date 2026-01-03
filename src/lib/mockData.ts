// Mock data for the ministerial platform
import { addDays, subDays, format } from 'date-fns';

// Users
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  role: 'admin' | 'gabinete' | 'revisor' | 'lector';
  avatar?: string;
  departmentId?: string;
}

export const users: User[] = [
  { id: 'u1', name: 'María García López', email: 'maria.garcia@ministerio.gob', phone: '+240 222 123 456', whatsapp: '+240 555 123 456', role: 'admin', departmentId: 'dep1' },
  { id: 'u2', name: 'Carlos Rodríguez Pérez', email: 'carlos.rodriguez@ministerio.gob', phone: '+240 222 234 567', whatsapp: '+240 555 234 567', role: 'gabinete', departmentId: 'dep2' },
  { id: 'u3', name: 'Ana Martínez Sánchez', email: 'ana.martinez@ministerio.gob', phone: '+240 222 345 678', whatsapp: '+240 555 345 678', role: 'revisor', departmentId: 'dep3' },
  { id: 'u4', name: 'Luis Fernández Torres', email: 'luis.fernandez@ministerio.gob', phone: '+240 222 456 789', whatsapp: '+240 555 456 789', role: 'lector', departmentId: 'dep4' },
];

export const currentUser = users[0];

// Internal Department Structure (Estructura Interna)
export interface Department {
  id: string;
  name: string;
  code: string;
  level: number; // Hierarchy level (1 = highest)
  parentId?: string;
  headUserId?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  color: string;
}

export const departments: Department[] = [
  { id: 'dep1', name: 'Ministro', code: 'MIN', level: 1, color: '#dc2626', email: 'ministro@ministerio.gob', phone: '+240 222 100 001', whatsapp: '+240 555 100 001' },
  { id: 'dep2', name: 'Ministro Delegado', code: 'MIND', level: 2, parentId: 'dep1', color: '#ea580c', email: 'ministro.delegado@ministerio.gob', phone: '+240 222 100 002', whatsapp: '+240 555 100 002' },
  { id: 'dep3', name: 'Viceministro', code: 'VMIN', level: 2, parentId: 'dep1', color: '#d97706', email: 'viceministro@ministerio.gob', phone: '+240 222 100 003', whatsapp: '+240 555 100 003' },
  { id: 'dep4', name: 'Secretario de Estado', code: 'SE', level: 3, parentId: 'dep3', color: '#ca8a04', email: 'secretario.estado@ministerio.gob', phone: '+240 222 100 004', whatsapp: '+240 555 100 004' },
  { id: 'dep5', name: 'Secretario General', code: 'SG', level: 3, parentId: 'dep3', color: '#65a30d', email: 'secretario.general@ministerio.gob', phone: '+240 222 100 005', whatsapp: '+240 555 100 005' },
  { id: 'dep6', name: 'Directores Generales', code: 'DG', level: 4, parentId: 'dep5', color: '#16a34a', email: 'directores@ministerio.gob', phone: '+240 222 100 006', whatsapp: '+240 555 100 006' },
  { id: 'dep7', name: 'Inspección General de Servicios', code: 'IGS', level: 4, parentId: 'dep5', color: '#0d9488', email: 'inspeccion@ministerio.gob', phone: '+240 222 100 007', whatsapp: '+240 555 100 007' },
  { id: 'dep8', name: 'Delegación Regional', code: 'DR', level: 5, parentId: 'dep6', color: '#0891b2', email: 'delegacion.regional@ministerio.gob', phone: '+240 222 100 008', whatsapp: '+240 555 100 008' },
  { id: 'dep9', name: 'Sección Económica', code: 'SEC', level: 5, parentId: 'dep6', color: '#2563eb', email: 'seccion.economica@ministerio.gob', phone: '+240 222 100 009', whatsapp: '+240 555 100 009' },
  { id: 'dep10', name: 'Funcionarios', code: 'FUNC', level: 6, parentId: 'dep6', color: '#7c3aed', email: 'funcionarios@ministerio.gob', phone: '+240 222 100 010', whatsapp: '+240 555 100 010' },
];

// Entities (External organizations)
export interface Entity {
  id: string;
  name: string;
  code: string;
  color: string;
  type: 'internal' | 'external';
  email?: string;
  phone?: string;
}

export const entities: Entity[] = [
  { id: 'e1', name: 'Autoridad Portuaria', code: 'AP', color: '#2563eb', type: 'external', email: 'info@autoridadportuaria.gob', phone: '+240 333 100 001' },
  { id: 'e2', name: 'Telecomunicaciones', code: 'TEL', color: '#7c3aed', type: 'external', email: 'info@telecom.gob', phone: '+240 333 100 002' },
  { id: 'e3', name: 'Cooperación Internacional', code: 'CI', color: '#059669', type: 'external', email: 'info@cooperacion.gob', phone: '+240 333 100 003' },
  { id: 'e4', name: 'Ministerio de Hacienda', code: 'MH', color: '#dc2626', type: 'external', email: 'info@hacienda.gob', phone: '+240 333 100 004' },
  { id: 'e5', name: 'Ministerio de Trabajo', code: 'MT', color: '#ea580c', type: 'external', email: 'info@trabajo.gob', phone: '+240 333 100 005' },
];

// Document types
export const documentTypes = [
  'Oficio',
  'Memorando',
  'Circular',
  'Resolución',
  'Acuerdo',
  'Informe',
  'Solicitud',
  'Respuesta',
  'Notificación',
];

// Channels
export const channels = [
  'Correo electrónico',
  'Mensajería física',
  'Ventanilla única',
  'Plataforma digital',
];

// Tags
export const tags = [
  'Urgente',
  'Confidencial',
  'Seguimiento',
  'Información',
  'Respuesta requerida',
  'Archivo',
];

// Documents
export interface Document {
  id: string;
  correlativeNumber: string;
  title: string;
  type: string;
  entityId: string;
  responsibleId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'archived';
  direction: 'in' | 'out';
  channel: string;
  origin: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  content?: string;
  qrCode?: string;
  // New fields for classification and routing
  classification: 'internal' | 'external';
  decretedTo?: string[]; // Department IDs where document is routed
  aiSummary?: string;
  aiProposedResponse?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

const now = new Date();

export const documents: Document[] = [
  {
    id: 'd1',
    correlativeNumber: 'ENT-2024-001542',
    title: 'Solicitud de ampliación de concesión portuaria',
    type: 'Solicitud',
    entityId: 'e1',
    responsibleId: 'u2',
    status: 'pending',
    direction: 'in',
    channel: 'Plataforma digital',
    origin: 'Terminal Marítima S.A.',
    tags: ['Urgente', 'Respuesta requerida'],
    createdAt: subDays(now, 1),
    updatedAt: subDays(now, 1),
    classification: 'external',
    decretedTo: ['dep3', 'dep6'],
    priority: 'urgent',
    aiSummary: 'Terminal Marítima S.A. solicita ampliación de su concesión portuaria por 15 años adicionales, argumentando inversiones realizadas en infraestructura por valor de $50M y cumplimiento de todos los indicadores de gestión establecidos.',
    aiProposedResponse: 'Estimados señores de Terminal Marítima S.A.,\n\nAcusamos recibo de su solicitud de ampliación de concesión portuaria con fecha [fecha]. Procedemos a iniciar el análisis técnico y legal correspondiente.\n\nSe ha asignado el expediente al departamento competente para su evaluación. Les mantendremos informados del avance del proceso.\n\nAtentamente,\n[Nombre del responsable]',
  },
  {
    id: 'd2',
    correlativeNumber: 'ENT-2024-001541',
    title: 'Informe trimestral de operaciones',
    type: 'Informe',
    entityId: 'e1',
    responsibleId: 'u3',
    status: 'in_progress',
    direction: 'in',
    channel: 'Correo electrónico',
    origin: 'Dirección de Operaciones',
    tags: ['Información'],
    createdAt: subDays(now, 2),
    updatedAt: subDays(now, 1),
    classification: 'internal',
    decretedTo: ['dep5'],
    priority: 'medium',
    aiSummary: 'Informe Q3 2024 muestra incremento del 12% en movimiento de carga respecto al trimestre anterior. Se destacan mejoras en tiempos de despacho y reducción de incidentes operativos.',
  },
  {
    id: 'd3',
    correlativeNumber: 'ENT-2024-001540',
    title: 'Consulta sobre normativa de telecomunicaciones',
    type: 'Oficio',
    entityId: 'e2',
    responsibleId: 'u2',
    status: 'pending',
    direction: 'in',
    channel: 'Mensajería física',
    origin: 'Operador Nacional de Telecomunicaciones',
    tags: ['Seguimiento'],
    createdAt: subDays(now, 3),
    updatedAt: subDays(now, 3),
    classification: 'external',
    priority: 'medium',
    aiSummary: 'Consulta técnica sobre interpretación del artículo 45 del reglamento de telecomunicaciones referente a tarifas de interconexión entre operadores.',
    aiProposedResponse: 'En respuesta a su consulta sobre el artículo 45 del Reglamento de Telecomunicaciones, le informamos que la interpretación correcta establece...',
  },
  {
    id: 'd4',
    correlativeNumber: 'SAL-2024-000823',
    title: 'Respuesta a solicitud de información',
    type: 'Respuesta',
    entityId: 'e3',
    responsibleId: 'u2',
    status: 'completed',
    direction: 'out',
    channel: 'Correo electrónico',
    origin: 'Gabinete Ministerial',
    tags: ['Información'],
    createdAt: subDays(now, 5),
    updatedAt: subDays(now, 4),
    classification: 'external',
    priority: 'low',
  },
  {
    id: 'd5',
    correlativeNumber: 'ENT-2024-001539',
    title: 'Proyecto de cooperación bilateral',
    type: 'Memorando',
    entityId: 'e3',
    responsibleId: 'u3',
    status: 'in_progress',
    direction: 'in',
    channel: 'Plataforma digital',
    origin: 'Embajada de Francia',
    tags: ['Confidencial', 'Seguimiento'],
    createdAt: subDays(now, 7),
    updatedAt: subDays(now, 2),
    classification: 'external',
    decretedTo: ['dep1', 'dep3'],
    priority: 'high',
    aiSummary: 'Propuesta de cooperación técnica Francia-Guinea Ecuatorial en materia de digitalización de servicios públicos. Incluye programa de capacitación y transferencia tecnológica valorado en €2.5M.',
    aiProposedResponse: 'Excelentísimo Embajador,\n\nAgradecemos la propuesta de cooperación técnica presentada por el Gobierno de Francia. Hemos procedido a elevar el documento a las instancias superiores para su consideración.\n\nQuedamos a su disposición para coordinar reuniones de trabajo técnico.',
  },
  {
    id: 'd6',
    correlativeNumber: 'SAL-2024-000822',
    title: 'Notificación de actualización regulatoria',
    type: 'Circular',
    entityId: 'e2',
    responsibleId: 'u2',
    status: 'pending',
    direction: 'out',
    channel: 'Plataforma digital',
    origin: 'Gabinete Ministerial',
    tags: ['Información'],
    createdAt: subDays(now, 1),
    updatedAt: subDays(now, 1),
    classification: 'internal',
    decretedTo: ['dep6', 'dep7'],
    priority: 'medium',
  },
];

// Expedientes (Cases)
export interface Expediente {
  id: string;
  number: string;
  title: string;
  entityId: string;
  responsibleId: string;
  status: 'open' | 'pending_signature' | 'closed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  documentIds: string[];
  createdAt: Date;
  updatedAt: Date;
  description?: string;
}

export const expedientes: Expediente[] = [
  {
    id: 'exp1',
    number: 'EXP-2024-00342',
    title: 'Renovación concesión Terminal Norte',
    entityId: 'e1',
    responsibleId: 'u2',
    status: 'open',
    priority: 'high',
    documentIds: ['d1', 'd2'],
    createdAt: subDays(now, 30),
    updatedAt: subDays(now, 1),
    description: 'Proceso de renovación de la concesión de la Terminal Norte del puerto principal.',
  },
  {
    id: 'exp2',
    number: 'EXP-2024-00341',
    title: 'Licitación espectro 5G',
    entityId: 'e2',
    responsibleId: 'u3',
    status: 'pending_signature',
    priority: 'urgent',
    documentIds: ['d3'],
    createdAt: subDays(now, 45),
    updatedAt: subDays(now, 2),
    description: 'Proceso de licitación para la asignación de espectro 5G.',
  },
  {
    id: 'exp3',
    number: 'EXP-2024-00340',
    title: 'Acuerdo cooperación Francia',
    entityId: 'e3',
    responsibleId: 'u2',
    status: 'open',
    priority: 'medium',
    documentIds: ['d4', 'd5'],
    createdAt: subDays(now, 60),
    updatedAt: subDays(now, 5),
    description: 'Negociación del acuerdo de cooperación técnica con Francia.',
  },
  {
    id: 'exp4',
    number: 'EXP-2024-00339',
    title: 'Modernización infraestructura portuaria',
    entityId: 'e1',
    responsibleId: 'u3',
    status: 'open',
    priority: 'medium',
    documentIds: [],
    createdAt: subDays(now, 90),
    updatedAt: subDays(now, 10),
  },
  {
    id: 'exp5',
    number: 'EXP-2024-00338',
    title: 'Regulación servicios OTT',
    entityId: 'e2',
    responsibleId: 'u2',
    status: 'closed',
    priority: 'low',
    documentIds: [],
    createdAt: subDays(now, 120),
    updatedAt: subDays(now, 30),
  },
  {
    id: 'exp6',
    number: 'EXP-2024-00337',
    title: 'Programa becas internacionales',
    entityId: 'e3',
    responsibleId: 'u4',
    status: 'archived',
    priority: 'low',
    documentIds: [],
    createdAt: subDays(now, 180),
    updatedAt: subDays(now, 60),
  },
];

// Deadlines
export interface Deadline {
  id: string;
  title: string;
  expedienteId: string;
  dueDate: Date;
  status: 'upcoming' | 'urgent' | 'overdue';
  reminderSent: boolean;
  assignedTo: string;
}

export const deadlines: Deadline[] = [
  {
    id: 'dl1',
    title: 'Respuesta a solicitud de ampliación',
    expedienteId: 'exp1',
    dueDate: addDays(now, 3),
    status: 'urgent',
    reminderSent: true,
    assignedTo: 'u2',
  },
  {
    id: 'dl2',
    title: 'Informe técnico licitación 5G',
    expedienteId: 'exp2',
    dueDate: addDays(now, 7),
    status: 'upcoming',
    reminderSent: false,
    assignedTo: 'u3',
  },
  {
    id: 'dl3',
    title: 'Revisión borrador acuerdo Francia',
    expedienteId: 'exp3',
    dueDate: addDays(now, 14),
    status: 'upcoming',
    reminderSent: false,
    assignedTo: 'u2',
  },
  {
    id: 'dl4',
    title: 'Entrega documentación portuaria',
    expedienteId: 'exp4',
    dueDate: subDays(now, 2),
    status: 'overdue',
    reminderSent: true,
    assignedTo: 'u3',
  },
  {
    id: 'dl5',
    title: 'Firma resolución telecomunicaciones',
    expedienteId: 'exp2',
    dueDate: addDays(now, 1),
    status: 'urgent',
    reminderSent: true,
    assignedTo: 'u2',
  },
  {
    id: 'dl6',
    title: 'Presentación proyecto modernización',
    expedienteId: 'exp4',
    dueDate: addDays(now, 21),
    status: 'upcoming',
    reminderSent: false,
    assignedTo: 'u3',
  },
  {
    id: 'dl7',
    title: 'Evaluación ofertas licitación',
    expedienteId: 'exp2',
    dueDate: addDays(now, 5),
    status: 'upcoming',
    reminderSent: false,
    assignedTo: 'u2',
  },
  {
    id: 'dl8',
    title: 'Cierre consulta pública',
    expedienteId: 'exp1',
    dueDate: subDays(now, 5),
    status: 'overdue',
    reminderSent: true,
    assignedTo: 'u3',
  },
];

// Signature flows
export interface SignatureFlow {
  id: string;
  documentId: string;
  expedienteId: string;
  status: 'pending' | 'signed' | 'rejected';
  mainSignerId: string;
  alternateSignerId: string;
  validatorIds: string[];
  hash: string;
  timestamp?: Date;
  version: number;
}

export const signatureFlows: SignatureFlow[] = [
  {
    id: 'sf1',
    documentId: 'd1',
    expedienteId: 'exp1',
    status: 'pending',
    mainSignerId: 'u1',
    alternateSignerId: 'u2',
    validatorIds: ['u3'],
    hash: 'a3f2c1d4e5b6789...',
    version: 1,
  },
  {
    id: 'sf2',
    documentId: 'd3',
    expedienteId: 'exp2',
    status: 'pending',
    mainSignerId: 'u2',
    alternateSignerId: 'u1',
    validatorIds: ['u3', 'u4'],
    hash: 'b4g3h2i1j6k789...',
    version: 1,
  },
  {
    id: 'sf3',
    documentId: 'd4',
    expedienteId: 'exp3',
    status: 'signed',
    mainSignerId: 'u1',
    alternateSignerId: 'u2',
    validatorIds: ['u3'],
    hash: 'c5h4i3j2k1l890...',
    timestamp: subDays(now, 4),
    version: 2,
  },
  {
    id: 'sf4',
    documentId: 'd6',
    expedienteId: 'exp2',
    status: 'rejected',
    mainSignerId: 'u2',
    alternateSignerId: 'u1',
    validatorIds: [],
    hash: 'd6i5j4k3l2m901...',
    timestamp: subDays(now, 1),
    version: 1,
  },
];

// Audit log
export interface AuditEntry {
  id: string;
  userId: string;
  action: string;
  targetType: 'document' | 'expediente' | 'signature' | 'user' | 'system';
  targetId: string;
  details: string;
  timestamp: Date;
}

export const auditLog: AuditEntry[] = [
  {
    id: 'a1',
    userId: 'u2',
    action: 'Documento registrado',
    targetType: 'document',
    targetId: 'd1',
    details: 'Registro de entrada ENT-2024-001542',
    timestamp: subDays(now, 1),
  },
  {
    id: 'a2',
    userId: 'u3',
    action: 'Estado actualizado',
    targetType: 'document',
    targetId: 'd2',
    details: 'Cambio de estado: pendiente → en proceso',
    timestamp: subDays(now, 1),
  },
  {
    id: 'a3',
    userId: 'u1',
    action: 'Firma aprobada',
    targetType: 'signature',
    targetId: 'sf3',
    details: 'Documento firmado electrónicamente',
    timestamp: subDays(now, 4),
  },
  {
    id: 'a4',
    userId: 'u2',
    action: 'Expediente creado',
    targetType: 'expediente',
    targetId: 'exp1',
    details: 'Nuevo expediente EXP-2024-00342',
    timestamp: subDays(now, 30),
  },
  {
    id: 'a5',
    userId: 'u3',
    action: 'Plazo asignado',
    targetType: 'expediente',
    targetId: 'exp2',
    details: 'Nuevo plazo: Informe técnico licitación 5G',
    timestamp: subDays(now, 7),
  },
];

// Fake API functions with latency
export async function delay(ms: number = 500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchDocuments(direction?: 'in' | 'out'): Promise<Document[]> {
  await delay(800);
  if (direction) {
    return documents.filter(d => d.direction === direction);
  }
  return documents;
}

export async function fetchExpedientes(): Promise<Expediente[]> {
  await delay(600);
  return expedientes;
}

export async function fetchDeadlines(): Promise<Deadline[]> {
  await delay(500);
  return deadlines;
}

export async function fetchSignatureFlows(): Promise<SignatureFlow[]> {
  await delay(700);
  return signatureFlows;
}

export async function fetchAuditLog(): Promise<AuditEntry[]> {
  await delay(900);
  return auditLog;
}

export async function fetchDashboardStats() {
  await delay(400);
  return {
    entriesToday: documents.filter(d => d.direction === 'in' && format(d.createdAt, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')).length,
    exitsToday: documents.filter(d => d.direction === 'out' && format(d.createdAt, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')).length,
    openCases: expedientes.filter(e => e.status === 'open' || e.status === 'pending_signature').length,
    upcomingDeadlines: deadlines.filter(d => d.status === 'upcoming' || d.status === 'urgent').length,
    pendingSignatures: signatureFlows.filter(s => s.status === 'pending').length,
  };
}

// Helper functions
export function getEntityById(id: string): Entity | undefined {
  return entities.find(e => e.id === id);
}

export function getUserById(id: string): User | undefined {
  return users.find(u => u.id === id);
}

export function getExpedienteById(id: string): Expediente | undefined {
  return expedientes.find(e => e.id === id);
}

export function getDocumentById(id: string): Document | undefined {
  return documents.find(d => d.id === id);
}

export function getDepartmentById(id: string): Department | undefined {
  return departments.find(d => d.id === id);
}

export function getDepartmentsByLevel(level: number): Department[] {
  return departments.filter(d => d.level === level);
}

export function getChildDepartments(parentId: string): Department[] {
  return departments.filter(d => d.parentId === parentId);
}
