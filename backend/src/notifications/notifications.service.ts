import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto, NotificationType } from './dto/create-notification.dto';
import { QueryNotificationDto } from './dto/query-notification.dto';
import { createPaginatedResponse, calculateSkip } from '../documents/utils/pagination.util';
import { Prisma } from '@prisma/client';
import { WebSocketService } from '../websocket/websocket.service';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private websocketService: WebSocketService,
  ) {}

  /**
   * Create a notification
   */
  async create(dto: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: dto.userId,
        type: dto.type as any,
        title: dto.title,
        message: dto.message,
        relatedId: dto.relatedId,
        relatedType: dto.relatedType,
      },
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
    });

    // Send real-time WebSocket notification
    this.websocketService.sendNotificationToUser(parseInt(dto.userId), {
      type: this.mapNotificationTypeToWebSocket(dto.type),
      documentId: dto.relatedId ? parseInt(dto.relatedId) : null,
      title: dto.title,
      message: dto.message,
      timestamp: notification.createdAt,
      metadata: {
        notificationId: notification.id,
        relatedType: dto.relatedType,
      },
    });

    return notification;
  }

  /**
   * Create bulk notifications (for decree operations)
   */
  async createBulk(dtos: CreateNotificationDto[]) {
    const notifications = await this.prisma.notification.createMany({
      data: dtos.map((dto) => ({
        userId: dto.userId,
        type: dto.type as any,
        title: dto.title,
        message: dto.message,
        relatedId: dto.relatedId,
        relatedType: dto.relatedType,
      })),
    });

    return notifications;
  }

  /**
   * Get all notifications for a user with pagination
   */
  async findAll(userId: string, queryDto: QueryNotificationDto) {
    const { page = 1, limit = 20, ...filters } = queryDto;

    const where: Prisma.NotificationWhereInput = {
      userId,
    };

    if (filters.type) {
      where.type = filters.type as any;
    }

    if (filters.isRead !== undefined) {
      where.isRead = filters.isRead;
    }

    const skip = calculateSkip(page, limit);

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
    ]);

    return createPaginatedResponse(notifications, { total, page, limit });
  }

  /**
   * Get unread notification count for a user
   */
  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: string, userId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    return this.prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  /**
   * Delete a notification
   */
  async remove(id: string, userId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    await this.prisma.notification.delete({
      where: { id },
    });

    return { message: 'Notification deleted successfully' };
  }

  /**
   * Delete all read notifications for a user
   */
  async removeAllRead(userId: string) {
    const result = await this.prisma.notification.deleteMany({
      where: {
        userId,
        isRead: true,
      },
    });

    return { message: `${result.count} read notifications deleted` };
  }

  /**
   * Send email notification (placeholder for actual email service)
   */
  async sendEmailNotification(email: string, subject: string, message: string) {
    // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
    console.log(`[EMAIL] To: ${email}, Subject: ${subject}, Message: ${message}`);
    return { sent: true, method: 'email' };
  }

  /**
   * Send WhatsApp notification (placeholder for actual WhatsApp service)
   */
  async sendWhatsAppNotification(phone: string, message: string) {
    // TODO: Integrate with WhatsApp Business API or Twilio
    console.log(`[WHATSAPP] To: ${phone}, Message: ${message}`);
    return { sent: true, method: 'whatsapp' };
  }

  /**
   * Helper: Notify document decree
   */
  async notifyDocumentDecree(
    documentId: string,
    documentTitle: string,
    departmentUserIds: string[],
    sendMethod: 'EMAIL' | 'WHATSAPP' | 'BOTH' = 'EMAIL',
  ) {
    const notifications: CreateNotificationDto[] = departmentUserIds.map((userId) => ({
      userId,
      type: NotificationType.DOCUMENT_DECREED,
      title: 'Documento Decretado',
      message: `Se ha decretado el documento: ${documentTitle}`,
      relatedId: documentId,
      relatedType: 'document',
    }));

    // Create in-app notifications
    await this.createBulk(notifications);

    // Send real-time WebSocket notifications
    departmentUserIds.forEach((userId) => {
      this.websocketService.sendNotificationToUser(parseInt(userId), {
        type: 'DOCUMENT_DECREED',
        documentId: parseInt(documentId),
        title: 'Documento Decretado',
        message: `Se ha decretado el documento: ${documentTitle}`,
        timestamp: new Date(),
        metadata: {
          relatedType: 'document',
        },
      });
    });

    // Send external notifications if requested
    if (sendMethod === 'EMAIL' || sendMethod === 'BOTH') {
      const users = await this.prisma.user.findMany({
        where: { id: { in: departmentUserIds } },
        select: { email: true, firstName: true },
      });

      for (const user of users) {
        await this.sendEmailNotification(
          user.email,
          'Documento Decretado',
          `Hola ${user.firstName}, se ha decretado un nuevo documento: ${documentTitle}`,
        );
      }
    }

    if (sendMethod === 'WHATSAPP' || sendMethod === 'BOTH') {
      const users = await this.prisma.user.findMany({
        where: { id: { in: departmentUserIds } },
        select: { phone: true, firstName: true },
      });

      for (const user of users) {
        if (user.phone) {
          await this.sendWhatsAppNotification(
            user.phone,
            `Hola ${user.firstName}, se ha decretado un nuevo documento: ${documentTitle}`,
          );
        }
      }
    }

    return { notificationsSent: departmentUserIds.length };
  }

  /**
   * Map NotificationType to WebSocket notification type
   */
  private mapNotificationTypeToWebSocket(type: NotificationType): any {
    const mapping = {
      [NotificationType.DOCUMENT_DECREED]: 'DOCUMENT_DECREED',
      [NotificationType.DOCUMENT_ASSIGNED]: 'DOCUMENT_ASSIGNED',
      [NotificationType.STATUS_CHANGED]: 'STATUS_CHANGED',
      [NotificationType.COMMENT_ADDED]: 'COMMENT_ADDED',
      [NotificationType.SIGNATURE_REQUIRED]: 'SIGNATURE_REQUIRED',
      [NotificationType.DEADLINE_REMINDER]: 'DEADLINE_REMINDER',
    };
    return mapping[type] || 'DOCUMENT_DECREED';
  }
}
