import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { AccountController } from '../account.controller';
import { AccountService } from '../account.service';
import { AccountExtendedInfo } from '../types';
import { changePasswordAccountStub, getUserAccountStub } from './stubs/account.stub';
import { PrismaClient, Users } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';
import { ChangePasswordDto } from '../dto';

jest.mock('../account.service.ts');

describe('AccountController', () => {
  let accountController: AccountController;
  let accountService: AccountService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      controllers: [AccountController],
      providers: [AccountService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    accountController = module.get<AccountController>(AccountController);
    accountService = module.get<AccountService>(AccountService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('getAccount', () => {
    describe('when getAccount is called', () => {
      let account: AccountExtendedInfo;
      beforeEach(async () => {
        const { id } = getUserAccountStub();
        account = await accountController.getUserAccountDetails(id)[0];
      });
      test('then it should return user object', () => {
        expect(accountService.getUserAccountDetails).toBeCalledWith(getUserAccountStub().id);
      });
      test("then it should return a user's account", () => {
        expect(account).toEqual(getUserAccountStub());
      });
    });
  });

  describe('changePassword', () => {
    let account: Users;
    const body: ChangePasswordDto = {
      oldPassword: changePasswordAccountStub().password,
      newPassword: changePasswordAccountStub().password,
    };
    describe('when changePassword is called', () => {
      beforeEach(async () => {
        account = await accountController.changePassword(changePasswordAccountStub().id, body);
      });
      test('then it should call accountService', () => {
        expect(accountService.changePassword).toHaveBeenCalledWith(
          changePasswordAccountStub().id,
          body.oldPassword,
          body.newPassword,
        );
      });
      test('then it should return a updated user', () => {
        expect(account).toEqual(changePasswordAccountStub());
      });
    });
  });
});
