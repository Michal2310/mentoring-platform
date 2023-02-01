import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MentorshipDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  background: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  expectations: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  message: string;
}
