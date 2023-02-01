import { getUserAccountStub, changePasswordAccountStub } from '../test/stubs/account.stub';

export const AccountService = jest.fn().mockReturnValue({
  getUserAccountDetails: jest.fn().mockResolvedValue(getUserAccountStub()),
  changePassword: jest.fn().mockResolvedValue(changePasswordAccountStub()),
});
