import { IsOptional } from 'class-validator';

export class CallDto {
  @IsOptional()
  to: string;
  @IsOptional()
  from: string;
  @IsOptional()
  offer: string;
  @IsOptional()
  answer: string;
}
