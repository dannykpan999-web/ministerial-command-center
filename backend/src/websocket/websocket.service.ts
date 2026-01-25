import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

export interface NotificationPayload {
  type: 'DOCUMENT_DECREED' | 'DOCUMENT_ASSIGNED' | 'STATUS_CHANGED' | 'COMMENT_ADDED' | 'SIGNATURE_REQUIRED' | 'DEADLINE_REMINDER';
  documentId: number;
  title: string;
  message: string;
  timestamp: Date;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  metadata?: Record<string, any>;
}

@Injectable()
export class WebSocketService {
  private server: Server;
  private readonly logger = new Logger(WebSocketService.name);
  private userSockets = new Map<number, Set<string>>(); // userId -> Set of socket IDs

  setServer(server: Server) {
    this.server = server;
    this.logger.log('WebSocket server initialized');
  }

  // Register a user's socket connection
  registerUserSocket(userId: number, socketId: string) {
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId).add(socketId);
    this.logger.log(`User ${userId} connected with socket ${socketId}`);
  }

  // Unregister a user's socket connection
  unregisterUserSocket(userId: number, socketId: string) {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.delete(socketId);
      if (sockets.size === 0) {
        this.userSockets.delete(userId);
      }
    }
    this.logger.log(`User ${userId} disconnected socket ${socketId}`);
  }

  // Send notification to a specific user (all their connected sockets)
  sendNotificationToUser(userId: number, notification: NotificationPayload) {
    const sockets = this.userSockets.get(userId);
    if (!sockets || sockets.size === 0) {
      this.logger.debug(`User ${userId} has no active connections`);
      return;
    }

    sockets.forEach((socketId) => {
      this.server.to(socketId).emit('notification', notification);
    });

    this.logger.log(`Notification sent to user ${userId} (${sockets.size} connections)`);
  }

  // Send notification to multiple users
  sendNotificationToUsers(userIds: number[], notification: NotificationPayload) {
    userIds.forEach((userId) => {
      this.sendNotificationToUser(userId, notification);
    });
  }

  // Broadcast to all connected users
  broadcastNotification(notification: NotificationPayload) {
    this.server.emit('notification', notification);
    this.logger.log('Notification broadcasted to all users');
  }

  // Get number of active connections for a user
  getUserConnectionCount(userId: number): number {
    return this.userSockets.get(userId)?.size || 0;
  }

  // Get total number of connected users
  getConnectedUsersCount(): number {
    return this.userSockets.size;
  }

  // Get all connected user IDs
  getConnectedUserIds(): number[] {
    return Array.from(this.userSockets.keys());
  }
}
