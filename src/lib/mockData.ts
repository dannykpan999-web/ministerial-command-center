// Mock data for the ministerial platform
import { addDays, subDays, format } from 'date-fns';

// Users
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'gabinete' | 'revisor' | 'lector';
  avatar?: string;
}

export const users: User[] = [
  { id: 'u1', name: 'María García López', email: 'maria.garcia@ministerio.gob', role: 'admin' },
  { id: 'u2', name: 'Carlos Rodríguez Pérez', email: 'carlos.rodriguez@ministerio.gob', role: 'gabinete' },
  { id: 'u3', name: 'Ana Martínez Sánchez', email: 'ana.martinez@ministerio.gob', role: 'revisor' },
  { id: 'u4', name: 'Luis Fernández Torres', email: 'luis.fernandez@ministerio.gob', role: 'lector' },
];

export const currentUser = users[0];

// Entities
export interface Entity {
  id: string;
  name: string;
  code: string;
  color: string;
}

export const entities: Entity[] = [
  { id: 'e1', name: 'Autoridad Portuaria', code: 'AP', color: '#2563eb' },
  { id: 'e2', name: 'Telecomunicaciones', code: 'TEL', color: '#7c3aed' },
  { id: 'e3', name: 'Cooperación Internacional', code: 'CI', color: '#059669' },
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
