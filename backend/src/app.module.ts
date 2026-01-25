import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuditModule } from './audit/audit.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EmailModule } from './email/email.module';
import { WebSocketModule } from './websocket/websocket.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DepartmentsModule } from './departments/departments.module';
import { EntitiesModule } from './entities/entities.module';
import { DocumentsModule } from './documents/documents.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    // Environment configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    // Database
    PrismaModule,
    // Audit (Global)
    AuditModule,
    // Notifications (Global)
    NotificationsModule,
    // Email Service (Global)
    EmailModule,
    // WebSocket (Global)
    WebSocketModule,
    // Feature modules
    AuthModule,
    UsersModule,
    DepartmentsModule,
    EntitiesModule,
    DocumentsModule,
  ],
  controllers: [AppController],
  providers: [],
  exports: [],
})
export class AppModule {}
