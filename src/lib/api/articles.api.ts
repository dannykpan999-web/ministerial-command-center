import { axiosInstance } from './axios';

export interface Article {
  id: string;
  title: string;
  content: string;
  sector: string;
  status: 'DRAFT' | 'PENDING' | 'PUBLISHED';
  sources: string[];
  authorId: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticleDto {
  title: string;
  content: string;
  sector: string;
  sources?: string[];
  status?: 'DRAFT' | 'PENDING';
}

export interface UpdateArticleDto extends Partial<CreateArticleDto> {
  status?: 'DRAFT' | 'PENDING' | 'PUBLISHED';
}

export const articlesApi = {
  findAll: async (status?: string): Promise<Article[]> => {
    const response = await axiosInstance.get('/articles', {
      params: status ? { status } : undefined,
    });
    return response.data;
  },

  findOne: async (id: string): Promise<Article> => {
    const response = await axiosInstance.get(`/articles/${id}`);
    return response.data;
  },

  create: async (dto: CreateArticleDto): Promise<Article> => {
    const response = await axiosInstance.post('/articles', dto);
    return response.data;
  },

  update: async (id: string, dto: UpdateArticleDto): Promise<Article> => {
    const response = await axiosInstance.patch(`/articles/${id}`, dto);
    return response.data;
  },

  publish: async (id: string): Promise<Article> => {
    const response = await axiosInstance.post(`/articles/${id}/publish`);
    return response.data;
  },

  remove: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/articles/${id}`);
  },
};
