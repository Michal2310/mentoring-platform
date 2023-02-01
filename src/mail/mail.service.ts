import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService, private config: ConfigService) {}

  async sendMail(
    userEmail: string,
    template: { subject: string; text: string; html: string },
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: userEmail,
      from: this.config.get('MAIL_FROM'),
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
  }
}
