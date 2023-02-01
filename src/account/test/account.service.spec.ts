import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { AccountController } from '../account.controller';
import { AccountService } from '../account.service';
import { ChangePasswordDto } from '../dto';
import { AccountExtendedInfo } from '../types';
import { changePasswordAccountStub, getUserAccountStub } from './stubs/account.stub';

jest.mock('../account.service.ts');

describe('Account service', () => {
  let accountService: AccountService;
  let prisma: PrismaService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        AccountService,
        {
          provide: PrismaService,
          useValue: AccountService,
        },
      ],
    }).compile();
    accountService = module.get<AccountService>(AccountService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('getAccount', () => {
    describe('when getAccount is called', () => {
      let user: AccountExtendedInfo;
      beforeEach(async () => {
        user = await accountService.getUserAccountDetails(getUserAccountStub().id);
      });
      test('it should return user', async () => {
        expect(user).toBeDefined();
        expect(user).toEqual(getUserAccountStub());
        expect(user.id).toEqual(getUserAccountStub().id);
      });
    });
  });
  describe('changePassword', () => {
    describe('when changePassword is called', () => {
      const body: ChangePasswordDto = {
        oldPassword: 'password',
        newPassword: 'password',
      };
      let user;
      beforeEach(async () => {
        user = await accountService.changePassword(
          changePasswordAccountStub().id,
          body.newPassword,
          changePasswordAccountStub().password,
        );
      });
      test('then it should change password', () => {
        expect(user).toBeDefined();
      });
    });
  });
});
