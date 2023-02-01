import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from '../common/decorators';
import { AccountService } from './account.service';
import { ChangePasswordDto } from './dto';

@ApiBearerAuth()
@ApiTags('Account')
@Controller('account')
export class AccountController {
  constructor(private accountSerive: AccountService) {}

  @Get('')
  getUserAccount(@GetCurrentUserId() userId: number) {
    return this.accountSerive.getUserAccount(userId);
  }

  @Patch('')
  changeUserPassword(@GetCurrentUserId() userId: number, @Body() dto: ChangePasswordDto) {
    return this.accountSerive.changeUserPassword(userId, dto);
  }
}
