import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

export interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);
  private readonly fromEmail: string;
  private readonly fromName: string;
  private readonly appUrl: string;

  constructor(private configService: ConfigService) {
    this.fromEmail = this.configService.get<string>('SMTP_FROM_EMAIL') || 'noreply@mttsia.gob.gq';
    this.fromName = this.configService.get<string>('SMTP_FROM_NAME') || 'Centro de Comando Ministerial';
    this.appUrl = this.configService.get<string>('APP_URL') || 'http://localhost:5173';

    // Configure nodemailer transporter
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = this.configService.get<number>('SMTP_PORT');
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');

    if (smtpHost && smtpUser && smtpPass) {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort || 587,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
      this.logger.log('Email service initialized with SMTP');
    } else {
      // Use ethereal for development if no SMTP configured
      this.logger.warn('No SMTP configured, emails will be logged only');
    }
  }

  private loadTemplate(templateName: string, context: Record<string, any>): string {
    const templatePath = path.join(__dirname, 'templates', `${templateName}.html`);

    try {
      let template = fs.readFileSync(templatePath, 'utf-8');

      // Simple template variable replacement
      Object.keys(context).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        template = template.replace(regex, context[key] || '');
      });

      return template;
    } catch (error) {
      this.logger.error(`Failed to load email template: ${templateName}`, error);
      return this.getPlainTextFallback(context);
    }
  }

  private getPlainTextFallback(context: Record<string, any>): string {
    return `
      Centro de Comando Ministerial - MTTSIA

      ${JSON.stringify(context, null, 2)}

      Acceda al sistema: ${this.appUrl}
    `;
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const html = this.loadTemplate(options.template, options.context);

      const mailOptions = {
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to: options.to,
        subject: options.subject,
        html,
      };

      if (this.transporter) {
        await this.transporter.sendMail(mailOptions);
        this.logger.log(`Email sent to ${options.to}: ${options.subject}`);
      } else {
        this.logger.log(`[DEV MODE] Email would be sent to ${options.to}: ${options.subject}`);
        this.logger.debug(`Email content: ${html.substring(0, 200)}...`);
      }
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}`, error);
      throw error;
    }
  }

  // Email notification methods
  async sendDocumentDecreeDEmail(data: {
    to: string;
    userName: string;
    correlativeNumber: string;
    documentTitle: string;
    entityName: string;
    priority: string;
    documentUrl: string;
  }): Promise<void> {
    await this.sendEmail({
      to: data.to,
      subject: `Documento Decretado - ${data.correlativeNumber}`,
      template: 'document-decreed',
      context: {
        userName: data.userName,
        correlativeNumber: data.correlativeNumber,
        documentTitle: data.documentTitle,
        entityName: data.entityName,
        priority: data.priority,
        documentUrl: data.documentUrl,
        appUrl: this.appUrl,
      },
    });
  }

  async sendDocumentAssignedEmail(data: {
    to: string;
    userName: string;
    correlativeNumber: string;
    documentTitle: string;
    assignedBy: string;
    priority: string;
    documentUrl: string;
  }): Promise<void> {
    await this.sendEmail({
      to: data.to,
      subject: `Documento Asignado - ${data.correlativeNumber}`,
      template: 'document-assigned',
      context: data,
    });
  }

  async sendStatusChangedEmail(data: {
    to: string;
    userName: string;
    correlativeNumber: string;
    documentTitle: string;
    oldStatus: string;
    newStatus: string;
    documentUrl: string;
  }): Promise<void> {
    await this.sendEmail({
      to: data.to,
      subject: `Estado del Documento Actualizado - ${data.correlativeNumber}`,
      template: 'status-changed',
      context: data,
    });
  }

  async sendCommentAddedEmail(data: {
    to: string;
    userName: string;
    correlativeNumber: string;
    documentTitle: string;
    commenterName: string;
    comment: string;
    documentUrl: string;
  }): Promise<void> {
    await this.sendEmail({
      to: data.to,
      subject: `Nuevo Comentario - ${data.correlativeNumber}`,
      template: 'comment-added',
      context: data,
    });
  }

  async sendSignatureRequiredEmail(data: {
    to: string;
    userName: string;
    correlativeNumber: string;
    documentTitle: string;
    deadline: string;
    documentUrl: string;
  }): Promise<void> {
    await this.sendEmail({
      to: data.to,
      subject: `Firma Requerida - ${data.correlativeNumber}`,
      template: 'signature-required',
      context: data,
    });
  }

  async sendDeadlineReminderEmail(data: {
    to: string;
    userName: string;
    correlativeNumber: string;
    documentTitle: string;
    deadline: string;
    hoursRemaining: number;
    documentUrl: string;
  }): Promise<void> {
    await this.sendEmail({
      to: data.to,
      subject: `Recordatorio de Plazo - ${data.correlativeNumber}`,
      template: 'deadline-reminder',
      context: data,
    });
  }

  async sendWelcomeEmail(data: {
    to: string;
    userName: string;
    email: string;
    temporaryPassword?: string;
    loginUrl: string;
  }): Promise<void> {
    await this.sendEmail({
      to: data.to,
      subject: 'Bienvenido al Centro de Comando Ministerial',
      template: 'welcome',
      context: data,
    });
  }
}
