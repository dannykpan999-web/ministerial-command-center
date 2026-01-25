import { axiosInstance } from './axios';

export interface CreateDocumentDto {
  title: string;
  type: string;
  direction: 'IN' | 'OUT';
  classification: 'INTERNAL' | 'EXTERNAL';
  channel?: string;
  origin?: string;
  entityId: string;
  responsibleId: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  content?: string;
  expedienteId?: string;
  isDraft?: boolean;
  tags?: string[];
  receivedAt?: Date;
  sentAt?: Date;
}

export interface UpdateDocumentDto extends Partial<CreateDocumentDto> {
  status?: 'DRAFT' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED' | 'REJECTED';
  aiSummary?: string;
  aiProposedResponse?: string;
  aiKeyPoints?: string[];
  qrCode?: string;
}

export interface QueryDocumentDto {
  page?: number;
  limit?: number;
  search?: string;
  direction?: 'IN' | 'OUT';
  status?: string;
  classification?: 'INTERNAL' | 'EXTERNAL';
  entityId?: string;
  responsibleId?: string;
  priority?: string;
  hasAiSummary?: boolean;
  expedienteId?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: string;
  isDraft?: boolean;
  createdById?: string;
}

export interface DecreeDocumentDto {
  departmentIds: string[];
  sendNotification: boolean;
  notificationMethod: 'EMAIL' | 'WHATSAPP' | 'BOTH';
  message?: string;
}

export interface AssignDocumentDto {
  userId: string;
  note?: string;
}

export const documentsApi = {
  // Create document
  create: async (data: CreateDocumentDto) => {
    const response = await axiosInstance.post('/documents', data);
    return response.data;
  },

  // Get all documents with filters
  findAll: async (params?: QueryDocumentDto) => {
    const response = await axiosInstance.get('/documents', { params });
    return response.data;
  },

  // Get document by ID
  findOne: async (id: string) => {
    const response = await axiosInstance.get(`/documents/${id}`);
    return response.data;
  },

  // Update document
  update: async (id: string, data: UpdateDocumentDto) => {
    const response = await axiosInstance.patch(`/documents/${id}`, data);
    return response.data;
  },

  // Update document status
  updateStatus: async (id: string, status: string) => {
    const response = await axiosInstance.patch(`/documents/${id}/status`, { status });
    return response.data;
  },

  // Archive document
  remove: async (id: string) => {
    const response = await axiosInstance.delete(`/documents/${id}`);
    return response.data;
  },

  // Decree document
  decree: async (id: string, data: DecreeDocumentDto) => {
    const response = await axiosInstance.post(`/documents/${id}/decree`, data);
    return response.data;
  },

  // Assign document
  assign: async (id: string, data: AssignDocumentDto) => {
    const response = await axiosInstance.post(`/documents/${id}/assign`, data);
    return response.data;
  },

  // Get inbox documents
  getInbox: async (params?: QueryDocumentDto) => {
    const response = await axiosInstance.get('/documents/inbox', { params });
    return response.data;
  },

  // Get outbox documents
  getOutbox: async (params?: QueryDocumentDto) => {
    const response = await axiosInstance.get('/documents/outbox', { params });
    return response.data;
  },

  // Get my documents
  getMyDocuments: async (params?: QueryDocumentDto) => {
    const response = await axiosInstance.get('/documents/my', { params });
    return response.data;
  },

  // Get pending documents
  getPending: async (params?: QueryDocumentDto) => {
    const response = await axiosInstance.get('/documents/pending', { params });
    return response.data;
  },

  // Get documents by entity
  getByEntity: async (entityId: string, params?: QueryDocumentDto) => {
    const response = await axiosInstance.get(`/documents/by-entity/${entityId}`, { params });
    return response.data;
  },

  // Get dashboard statistics
  getStats: async () => {
    const response = await axiosInstance.get('/documents/stats');
    return response.data;
  },

  // Full-text search documents (Spanish language support)
  search: async (query: string, params?: Omit<QueryDocumentDto, 'search'>) => {
    const response = await axiosInstance.get('/documents/search', {
      params: { q: query, ...params }
    });
    return response.data;
  },
};
