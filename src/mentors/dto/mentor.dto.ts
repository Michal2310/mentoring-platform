import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class MentorDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstname: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastname: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  about: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  country: string;
  @ApiProperty()
  @IsArray()
  languages: string[];
  @ApiProperty()
  @IsArray()
  skills: string[];
}
