import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { DeadlineStatus, Priority } from '@prisma/client';
import { NotificationType } from '../notifications/dto/create-notification.dto';

@Injectable()
export class DeadlineSchedulerService {
  private readonly logger = new Logger(DeadlineSchedulerService.name);

  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  /**
   * Run every hour to check for overdue deadlines and send notifications
   * Cron: Every hour at minute 0
   */
  @Cron(CronExpression.EVERY_HOUR)
  async checkDeadlines() {
    this.logger.log('Running deadline check cron job');

    try {
      // Update overdue deadlines
      await this.updateOverdueDeadlines();

      // Send notifications for upcoming deadlines
      await this.sendUpcomingDeadlineNotifications();

      // Send notifications for overdue deadlines
      await this.sendOverdueDeadlineNotifications();

      this.logger.log('Deadline check completed successfully');
    } catch (error) {
      this.logger.error(`Error in deadline check: ${error.message}`, error.stack);
    }
  }

  /**
   * Update deadlines that have passed their due date to OVERDUE status
   */
  private async updateOverdueDeadlines() {
    const now = new Date();

    const result = await this.prisma.deadline.updateMany({
      where: {
        dueDate: {
          lt: now,
        },
        status: {
          notIn: [DeadlineStatus.COMPLETED, DeadlineStatus.OVERDUE],
        },
      },
      data: {
        status: DeadlineStatus.OVERDUE,
      },
    });

    if (result.count > 0) {
      this.logger.log(`Updated ${result.count} deadlines to OVERDUE status`);
    }

    return result;
  }

  /**
   * Send notifications for deadlines that are due in 24 hours
   */
  private async sendUpcomingDeadlineNotifications() {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Find deadlines due within the next 24 hours
    const upcomingDeadlines = await this.prisma.deadline.findMany({
      where: {
        dueDate: {
          gte: now,
          lte: tomorrow,
        },
        status: {
          notIn: [DeadlineStatus.COMPLETED, DeadlineStatus.OVERDUE],
        },
      },
      include: {
        document: {
          select: {
            id: true,
            title: true,
            correlativeNumber: true,
            responsible: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        expediente: {
          select: {
            id: true,
            code: true,
            title: true,
          },
        },
      },
    });

    for (const deadline of upcomingDeadlines) {
      try {
        // Determine who to notify
        const userToNotify = deadline.document?.responsible?.id;

        if (!userToNotify) {
          this.logger.warn(
            `Deadline ${deadline.id} has no responsible user, skipping notification`,
          );
          continue;
        }

        const hoursUntilDue = Math.round(
          (deadline.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60),
        );

        const priorityEmoji = this.getPriorityEmoji(deadline.priority);
        const title = `${priorityEmoji} Plazo próximo a vencer`;
        const relatedName = deadline.document
          ? `Documento: ${deadline.document.correlativeNumber}`
          : deadline.expediente
          ? `Expediente: ${deadline.expediente.code}`
          : '';

        const message = `${deadline.title}\n${relatedName}\nVence en ${hoursUntilDue} horas`;

        await this.notificationsService.create({
          userId: userToNotify,
          type: NotificationType.DEADLINE_REMINDER,
          title,
          message,
          relatedId: deadline.id,
          relatedType: 'deadline',
        });

        this.logger.log(
          `Sent upcoming deadline notification for: ${deadline.title}`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to send notification for deadline ${deadline.id}: ${error.message}`,
        );
      }
    }

    this.logger.log(
      `Sent ${upcomingDeadlines.length} upcoming deadline notifications`,
    );
  }

  /**
   * Send notifications for overdue deadlines
   */
  private async sendOverdueDeadlineNotifications() {
    const now = new Date();

    // Find overdue deadlines
    const overdueDeadlines = await this.prisma.deadline.findMany({
      where: {
        status: DeadlineStatus.OVERDUE,
      },
      include: {
        document: {
          select: {
            id: true,
            title: true,
            correlativeNumber: true,
            responsible: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        expediente: {
          select: {
            id: true,
            code: true,
            title: true,
          },
        },
      },
    });

    for (const deadline of overdueDeadlines) {
      try {
        const userToNotify = deadline.document?.responsible?.id;

        if (!userToNotify) {
          this.logger.warn(
            `Overdue deadline ${deadline.id} has no responsible user, skipping notification`,
          );
          continue;
        }

        const daysOverdue = Math.floor(
          (now.getTime() - deadline.dueDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        const priorityEmoji = this.getPriorityEmoji(deadline.priority);
        const title = `🔴 ${priorityEmoji} Plazo vencido`;
        const relatedName = deadline.document
          ? `Documento: ${deadline.document.correlativeNumber}`
          : deadline.expediente
          ? `Expediente: ${deadline.expediente.code}`
          : '';

        const message = `${deadline.title}\n${relatedName}\nVencido hace ${daysOverdue} día${daysOverdue !== 1 ? 's' : ''}`;

        await this.notificationsService.create({
          userId: userToNotify,
          type: NotificationType.DEADLINE_OVERDUE,
          title,
          message,
          relatedId: deadline.id,
          relatedType: 'deadline',
        });

        this.logger.log(`Sent overdue notification for: ${deadline.title}`);
      } catch (error) {
        this.logger.error(
          `Failed to send overdue notification for deadline ${deadline.id}: ${error.message}`,
        );
      }
    }

    this.logger.log(
      `Sent ${overdueDeadlines.length} overdue deadline notifications`,
    );
  }

  /**
   * Get emoji for deadline priority
   */
  private getPriorityEmoji(priority: Priority): string {
    const emojiMap = {
      [Priority.LOW]: '🟢',
      [Priority.MEDIUM]: '🟡',
      [Priority.HIGH]: '🟠',
      [Priority.URGENT]: '🔴',
    };
    return emojiMap[priority] || '⚪';
  }

  /**
   * Manual trigger for testing - can be called via API endpoint
   */
  async manualDeadlineCheck() {
    this.logger.log('Manual deadline check triggered');
    return this.checkDeadlines();
  }
}
