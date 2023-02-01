import {
  Body,
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
  UseInterceptors,
  CacheInterceptor,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { Tokens } from './types';
import { AuthService } from './auth.service';
import { RtGuard } from '../common/guards';
import { GetCurrentUser, GetCurrentUserId, Public } from 'src/common/decorators';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@ApiBearerAuth()
@UseInterceptors(CacheInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private userService: AuthService) {}
  @ApiResponse({ status: 201, description: 'User has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Credentials taken' })
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: RegisterDto) {
    return this.userService.register(dto);
  }

  @ApiResponse({ status: 200, description: 'User has been loged in successfully.' })
  @ApiResponse({ status: 403, description: 'Email or password incorrect' })
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto): Promise<Tokens> {
    return this.userService.login(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: number) {
    return this.userService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.userService.refresh(userId, refreshToken);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('verificationToken')
  async verificationToken(
    @Query('verificationToken') verificationToken: string,
    @Query('email') email: string,
  ) {
    return this.userService.verificationToken(verificationToken, email);
  }
}
