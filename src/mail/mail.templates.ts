import { ConfigService } from '@nestjs/config';

export class MailerTemplate {
  constructor(private config: ConfigService) {}

  verification(verificationToken: string, userEmail: string) {
    return {
      subject: '',
      text: '',
      html: `verify your email: http://localhost:3001/auth/verificationToken?verificationToken=${verificationToken}&email=${userEmail}`,
    };
  }
  mentorshipStatus() {
    return {
      subject: '',
      text: '',
      html: '',
    };
  }
  mentorStatus() {
    return {
      subject: '',
      text: '',
      html: '',
    };
  }
}
