import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';
import { QrService } from './qr.service';
import { CreateDocumentDto, DocumentStatus } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { QueryDocumentDto } from './dto/query-document.dto';
import { DecreeDocumentDto } from './dto/decree-document.dto';
import { AssignDocumentDto } from './dto/assign-document.dto';
import { SearchDocumentDto } from './dto/search-document.dto';
import { PaginatedResponseDto, DashboardStatsDto } from './dto/document-response.dto';
import { CorrelativeNumberService } from './utils/correlative-number.util';
import { createPaginatedResponse, calculateSkip } from './utils/pagination.util';
import { Prisma } from '@prisma/client';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    private prisma: PrismaService,
    private correlativeNumberService: CorrelativeNumberService,
    private auditService: AuditService,
    private notificationsService: NotificationsService,
    private qrService: QrService,
  ) {}

  /**
   * Create a new document
   */
  async create(createDocumentDto: CreateDocumentDto, userId: string) {
    // Validate entity exists
    const entity = await this.prisma.entity.findUnique({
      where: { id: createDocumentDto.entityId },
    });
    if (!entity) {
      throw new NotFoundException(`Entity with ID ${createDocumentDto.entityId} not found`);
    }

    // Validate responsible user exists
    const responsibleUser = await this.prisma.user.findUnique({
      where: { id: createDocumentDto.responsibleId },
    });
    if (!responsibleUser) {
      throw new NotFoundException(
        `User with ID ${createDocumentDto.responsibleId} not found`,
      );
    }

    // Validate expediente if provided
    if (createDocumentDto.expedienteId) {
      const expediente = await this.prisma.expediente.findUnique({
        where: { id: createDocumentDto.expedienteId },
      });
      if (!expediente) {
        throw new NotFoundException(
          `Expediente with ID ${createDocumentDto.expedienteId} not found`,
        );
      }
    }

    // Generate correlative number
    const correlativeNumber = await this.correlativeNumberService.generateCorrelativeNumber(
      createDocumentDto.direction,
    );

    // Determine status based on isDraft
    const status = createDocumentDto.isDraft ? DocumentStatus.DRAFT : DocumentStatus.PENDING;

    // Create document
    const { tags, ...documentData } = createDocumentDto;

    const document = await this.prisma.document.create({
      data: {
        ...documentData,
        correlativeNumber,
        status,
        createdById: userId,
        tags: tags
          ? {
              create: tags.map((tagName) => ({
                tag: {
                  connectOrCreate: {
                    where: { name: tagName },
                    create: { name: tagName },
                  },
                },
              })),
            }
          : undefined,
      },
      include: {
        entity: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        responsible: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        expediente: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // Generate QR code for document
    try {
      const qrCode = await this.qrService.generateDocumentQR(document.id);

      // Update document with QR code
      await this.prisma.document.update({
        where: { id: document.id },
        data: { qrCode },
      });

      this.logger.log(`QR code generated for document ${correlativeNumber}`);
    } catch (error) {
      this.logger.error(`Failed to generate QR code: ${error.message}`);
      // Don't throw - QR generation is not critical
    }

    // Audit log
    await this.auditService.logDocumentAction(
      userId,
      'CREATE_DOCUMENT',
      document.id,
      { documentData: { ...documentData, correlativeNumber, status } },
    );

    // Return document with QR code
    return this.prisma.document.findUnique({
      where: { id: document.id },
      include: {
        entity: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        responsible: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        expediente: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  /**
   * Find all documents with filters and pagination
   */
  async findAll(queryDto: QueryDocumentDto): Promise<PaginatedResponseDto<any>> {
    const { page = 1, limit = 20, search, sort = 'createdAt:desc', ...filters } = queryDto;

    // Build WHERE clause
    const where: Prisma.DocumentWhereInput = {};

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { correlativeNumber: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Direction filter
    if (filters.direction) {
      where.direction = filters.direction;
    }

    // Status filter
    if (filters.status) {
      where.status = filters.status as any;
    }

    // Classification filter
    if (filters.classification) {
      where.classification = filters.classification;
    }

    // Entity filter
    if (filters.entityId) {
      where.entityId = filters.entityId;
    }

    // Responsible filter
    if (filters.responsibleId) {
      where.responsibleId = filters.responsibleId;
    }

    // Created by filter
    if (filters.createdById) {
      where.createdById = filters.createdById;
    }

    // Priority filter
    if (filters.priority) {
      where.priority = filters.priority;
    }

    // AI summary filter
    if (filters.hasAiSummary !== undefined) {
      where.aiSummary = filters.hasAiSummary ? { not: null } : null;
    }

    // Expediente filter
    if (filters.expedienteId) {
      where.expedienteId = filters.expedienteId;
    }

    // Draft filter
    if (filters.isDraft !== undefined) {
      where.isDraft = filters.isDraft;
    }

    // Date range filters
    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) {
        where.createdAt.gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        where.createdAt.lte = new Date(filters.dateTo);
      }
    }

    // Parse sort parameter
    const [sortField, sortOrder] = sort.split(':');
    const orderBy: Prisma.DocumentOrderByWithRelationInput = {
      [sortField]: sortOrder === 'asc' ? 'asc' : 'desc',
    };

    // Calculate pagination
    const skip = calculateSkip(page, limit);

    // Execute query
    const [documents, total] = await Promise.all([
      this.prisma.document.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          entity: true,
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          responsible: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          expediente: true,
          tags: {
            include: {
              tag: true,
            },
          },
          _count: {
            select: {
              files: true,
              comments: true,
            },
          },
        },
      }),
      this.prisma.document.count({ where }),
    ]);

    return createPaginatedResponse(documents, { total, page, limit });
  }

  /**
   * Find one document by ID
   */
  async findOne(id: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: {
        entity: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        responsible: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        expediente: true,
        tags: {
          include: {
            tag: true,
          },
        },
        files: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        deadlines: true,
        signatureFlows: {
          include: {
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return document;
  }

  /**
   * Update document
   */
  async update(id: string, updateDocumentDto: UpdateDocumentDto) {
    // Check if document exists
    await this.findOne(id);

    // Validate entity if being updated
    if (updateDocumentDto.entityId) {
      const entity = await this.prisma.entity.findUnique({
        where: { id: updateDocumentDto.entityId },
      });
      if (!entity) {
        throw new NotFoundException(`Entity with ID ${updateDocumentDto.entityId} not found`);
      }
    }

    // Validate responsible if being updated
    if (updateDocumentDto.responsibleId) {
      const user = await this.prisma.user.findUnique({
        where: { id: updateDocumentDto.responsibleId },
      });
      if (!user) {
        throw new NotFoundException(
          `User with ID ${updateDocumentDto.responsibleId} not found`,
        );
      }
    }

    const { tags, ...documentData } = updateDocumentDto;

    const document = await this.prisma.document.update({
      where: { id },
      data: {
        ...documentData,
        tags: tags
          ? {
              deleteMany: {},
              create: tags.map((tagName) => ({
                tag: {
                  connectOrCreate: {
                    where: { name: tagName },
                    create: { name: tagName },
                  },
                },
              })),
            }
          : undefined,
      },
      include: {
        entity: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        responsible: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        expediente: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // Audit log
    await this.auditService.log(document.createdById, {
      action: 'UPDATE_DOCUMENT',
      resourceType: 'document',
      resourceId: id,
      changes: { updated: documentData },
    });

    return document;
  }

  /**
   * Update document status
   */
  async updateStatus(id: string, status: DocumentStatus) {
    await this.findOne(id);

    const document = await this.prisma.document.update({
      where: { id },
      data: { status },
    });

    return document;
  }

  /**
   * Archive document (soft delete)
   */
  async remove(id: string) {
    const existingDoc = await this.findOne(id);

    const document = await this.prisma.document.update({
      where: { id },
      data: { status: 'ARCHIVED' as any },
    });

    // Audit log
    await this.auditService.log(existingDoc.createdById, {
      action: 'DELETE_DOCUMENT',
      resourceType: 'document',
      resourceId: id,
    });

    return {
      message: 'Document archived successfully',
      document,
    };
  }

  /**
   * Assign document to a user
   */
  async assign(id: string, assignDto: AssignDocumentDto) {
    await this.findOne(id);

    // Validate user exists
    const user = await this.prisma.user.findUnique({
      where: { id: assignDto.userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${assignDto.userId} not found`);
    }

    const document = await this.prisma.document.update({
      where: { id },
      data: {
        responsibleId: assignDto.userId,
        status: 'IN_PROGRESS' as any,
      },
      include: {
        responsible: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Audit log
    await this.auditService.log(document.createdById, {
      action: 'ASSIGN_DOCUMENT',
      resourceType: 'document',
      resourceId: id,
      changes: { assignedTo: assignDto.userId, note: assignDto.note },
    });

    return {
      message: `Document assigned to ${user.firstName} ${user.lastName}`,
      document,
    };
  }

  /**
   * Decree document to departments
   */
  async decree(id: string, decreeDto: DecreeDocumentDto) {
    const document = await this.findOne(id);

    // Validate all departments exist
    const departments = await this.prisma.department.findMany({
      where: {
        id: {
          in: decreeDto.departmentIds,
        },
      },
    });

    if (departments.length !== decreeDto.departmentIds.length) {
      throw new BadRequestException('One or more department IDs are invalid');
    }

    // Update document with decreed departments
    const updatedDocument = await this.prisma.document.update({
      where: { id },
      data: {
        decretedTo: decreeDto.departmentIds,
      },
    });

    // Send notifications if requested
    if (decreeDto.sendNotification) {
      // Get all users from the decreed departments
      const departmentUsers = await this.prisma.user.findMany({
        where: {
          departmentId: { in: decreeDto.departmentIds },
          isActive: true,
        },
        select: { id: true },
      });

      const userIds = departmentUsers.map((u) => u.id);

      // Send notifications via the selected method
      const notificationMethod =
        decreeDto.notificationMethod === 'EMAIL'
          ? 'EMAIL'
          : decreeDto.notificationMethod === 'WHATSAPP'
          ? 'WHATSAPP'
          : 'BOTH';

      await this.notificationsService.notifyDocumentDecree(
        id,
        document.title,
        userIds,
        notificationMethod,
      );
    }

    // Audit log
    await this.auditService.log(document.createdById, {
      action: 'DECREE_DOCUMENT',
      resourceType: 'document',
      resourceId: id,
      changes: {
        decretedTo: decreeDto.departmentIds,
        sendNotification: decreeDto.sendNotification,
        notificationMethod: decreeDto.notificationMethod,
      },
    });

    return {
      message: `Document decreed to ${decreeDto.departmentIds.length} department(s)`,
      document: updatedDocument,
      departments,
    };
  }

  /**
   * Get inbox documents (direction = IN)
   */
  async getInbox(queryDto: QueryDocumentDto): Promise<PaginatedResponseDto<any>> {
    return this.findAll({ ...queryDto, direction: 'IN' as any });
  }

  /**
   * Get outbox documents (direction = OUT)
   */
  async getOutbox(queryDto: QueryDocumentDto): Promise<PaginatedResponseDto<any>> {
    return this.findAll({ ...queryDto, direction: 'OUT' as any });
  }

  /**
   * Get documents assigned to current user
   */
  async getMyDocuments(
    userId: string,
    queryDto: QueryDocumentDto,
  ): Promise<PaginatedResponseDto<any>> {
    return this.findAll({ ...queryDto, responsibleId: userId });
  }

  /**
   * Get pending documents
   */
  async getPending(queryDto: QueryDocumentDto): Promise<PaginatedResponseDto<any>> {
    return this.findAll({ ...queryDto, status: 'PENDING' as any });
  }

  /**
   * Get documents by entity
   */
  async getByEntity(
    entityId: string,
    queryDto: QueryDocumentDto,
  ): Promise<PaginatedResponseDto<any>> {
    // Validate entity exists
    const entity = await this.prisma.entity.findUnique({
      where: { id: entityId },
    });
    if (!entity) {
      throw new NotFoundException(`Entity with ID ${entityId} not found`);
    }

    return this.findAll({ ...queryDto, entityId });
  }

  /**
   * Get dashboard statistics
   */
  async getStats(): Promise<DashboardStatsDto> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      entriesToday,
      exitsToday,
      pending,
      inProgress,
      completed,
      openCases,
      upcomingDeadlines,
      pendingSignatures,
    ] = await Promise.all([
      // Documents entered today
      this.prisma.document.count({
        where: {
          direction: 'IN',
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
      // Documents sent out today
      this.prisma.document.count({
        where: {
          direction: 'OUT',
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
      // Pending documents
      this.prisma.document.count({
        where: { status: 'PENDING' },
      }),
      // In progress documents
      this.prisma.document.count({
        where: { status: 'IN_PROGRESS' },
      }),
      // Completed documents
      this.prisma.document.count({
        where: { status: 'COMPLETED' },
      }),
      // Open cases (expedientes)
      this.prisma.expediente.count({
        where: { status: 'OPEN' },
      }),
      // Upcoming deadlines (next 7 days)
      this.prisma.deadline.count({
        where: {
          dueDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
          status: {
            in: ['PENDING', 'IN_PROGRESS'],
          },
        },
      }),
      // Pending signatures
      this.prisma.signatureParticipant.count({
        where: {
          status: 'PENDING',
        },
      }),
    ]);

    return {
      entriesToday,
      exitsToday,
      pending,
      inProgress,
      completed,
      openCases,
      upcomingDeadlines,
      pendingSignatures,
    };
  }

  /**
   * Full-text search documents using PostgreSQL tsvector
   */
  async search(searchDto: SearchDocumentDto) {
    const { query, page = 1, limit = 20, direction, classification, status, entityId } = searchDto;

    if (!query || query.trim().length === 0) {
      throw new BadRequestException('Search query cannot be empty');
    }

    // Build WHERE clause for filters
    const where: Prisma.DocumentWhereInput = {};

    if (direction) {
      where.direction = direction;
    }

    if (classification) {
      where.classification = classification as any;
    }

    if (status) {
      where.status = status as any;
    }

    if (entityId) {
      where.entityId = entityId;
    }

    const skip = calculateSkip(page, limit);

    // Convert query to tsquery format (handle Spanish characters and multiple words)
    const tsQuery = query
      .trim()
      .split(/\s+/)
      .map((word) => `${word}:*`)
      .join(' & ');

    // Execute full-text search using raw SQL
    const documents = await this.prisma.$queryRaw<any[]>`
      SELECT
        d.id,
        d."correlativeNumber",
        d.title,
        d.type,
        d.status,
        d.direction,
        d.classification,
        d."entityId",
        d."createdById",
        d."responsibleId",
        d."expedienteId",
        d.content,
        d.priority,
        d."decretedTo",
        d."receivedAt",
        d."sentAt",
        d."createdAt",
        d."updatedAt",
        ts_rank(d.search_vector, to_tsquery('spanish', ${tsQuery})) as rank
      FROM documents d
      WHERE d.search_vector @@ to_tsquery('spanish', ${tsQuery})
        ${direction ? Prisma.sql`AND d.direction = ${direction}` : Prisma.empty}
        ${classification ? Prisma.sql`AND d.classification = ${classification}` : Prisma.empty}
        ${status ? Prisma.sql`AND d.status = ${status}` : Prisma.empty}
        ${entityId ? Prisma.sql`AND d."entityId" = ${entityId}` : Prisma.empty}
      ORDER BY rank DESC, d."createdAt" DESC
      LIMIT ${limit}
      OFFSET ${skip}
    `;

    // Get total count for pagination
    const totalResult = await this.prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*)::int as count
      FROM documents d
      WHERE d.search_vector @@ to_tsquery('spanish', ${tsQuery})
        ${direction ? Prisma.sql`AND d.direction = ${direction}` : Prisma.empty}
        ${classification ? Prisma.sql`AND d.classification = ${classification}` : Prisma.empty}
        ${status ? Prisma.sql`AND d.status = ${status}` : Prisma.empty}
        ${entityId ? Prisma.sql`AND d."entityId" = ${entityId}` : Prisma.empty}
    `;

    const total = Number(totalResult[0].count);

    // Fetch related data for each document
    const enrichedDocuments = await Promise.all(
      documents.map(async (doc) => {
        const [entity, createdBy, responsible] = await Promise.all([
          this.prisma.entity.findUnique({
            where: { id: doc.entityId },
            select: { id: true, name: true, shortName: true, type: true },
          }),
          this.prisma.user.findUnique({
            where: { id: doc.createdById },
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              position: true,
            },
          }),
          this.prisma.user.findUnique({
            where: { id: doc.responsibleId },
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              position: true,
            },
          }),
        ]);

        return {
          ...doc,
          rank: parseFloat(doc.rank),
          entity,
          createdBy,
          responsible,
        };
      })
    );

    return createPaginatedResponse(enrichedDocuments, { total, page, limit });
  }
}
