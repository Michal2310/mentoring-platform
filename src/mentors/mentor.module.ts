import { Module } from '@nestjs/common';
import { MentorController } from './mentor.controller';
import { MentorService } from './mentor.service';

@Module({
  providers: [MentorService],
  controllers: [MentorController],
})
export class MentorModule {}
