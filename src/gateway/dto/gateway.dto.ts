import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GatewayDto {
  @IsNotEmpty()
  @IsString()
  message: string;
  @IsNotEmpty()
  @IsString()
  room: string;
  userId: number;
}
