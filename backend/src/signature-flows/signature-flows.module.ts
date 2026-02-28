import { Module } from '@nestjs/common';
import { SignatureFlowsController } from './signature-flows.controller';
import { SignatureFlowsService } from './signature-flows.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [PrismaModule, AuditModule, NotificationsModule, EmailModule],
  controllers: [SignatureFlowsController],
  providers: [SignatureFlowsService],
  exports: [SignatureFlowsService],
})
export class SignatureFlowsModule {}
