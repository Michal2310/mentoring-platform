import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { GetCurrentUserId, Public } from '../common/decorators';
import { StatusType } from './types';
import { MentorDto } from './dto';
import { MentorService } from './mentor.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Mentors')
@Controller('mentor')
export class MentorController {
  constructor(private mentorService: MentorService) {}

  @Public()
  @Get('mentors')
  getMentors(@Query('page', ParseIntPipe) page: number) {
    return this.mentorService.getMentors(page);
  }

  @Public()
  @Get(':id')
  getMentor(@Param('id', ParseIntPipe) id: number) {
    return this.mentorService.getMentor(id);
  }

  @Post('')
  sendMentorRequest(@GetCurrentUserId() userId: number, @Body() dto: MentorDto) {
    return this.mentorService.sendMentorRequest(userId, dto);
  }

  @Post(':id')
  verifyPendingMentorRequests(
    @GetCurrentUserId() userId: number,
    @Param('id', ParseIntPipe) mentorId: number,
    @Query('status') status: StatusType,
  ) {
    return this.mentorService.verifyPendingMentorRequests(userId, mentorId, status);
  }
}
