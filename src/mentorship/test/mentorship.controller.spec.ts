import { Test } from '@nestjs/testing';
import { Mentorships, PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';
import { PrismaService } from '../../prisma/prisma.service';
import { MentorshipDto } from '../dto';
import { MentorshipController } from '../mentorship.controller';
import { MentorshipService } from '../mentorship.service';
import { StatusType } from '../types';
import {
  getUserMentorshipsRequestsStub,
  getReceivedMentorshipsRequestsStub,
  sendMentorshipRequestStub,
  verifyPendingMentorshipsStub,
} from './stubs/mentorship.stub';

jest.mock('../mentorship.service.ts');

describe('MentorshipController', () => {
  let mentorshipController: MentorshipController;
  let mentorshipService: MentorshipService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      controllers: [MentorshipController],
      providers: [MentorshipService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();
    mentorshipController = module.get<MentorshipController>(MentorshipController);
    mentorshipService = module.get<MentorshipService>(MentorshipService);

    jest.clearAllMocks();
  });

  describe('sendMentorshipRequest', () => {
    describe('when sendMentorshipRequest is called', () => {
      let request: Mentorships;
      const dto: MentorshipDto = {
        background: sendMentorshipRequestStub().background,
        expectations: sendMentorshipRequestStub().expectations,
        message: sendMentorshipRequestStub().message,
      };
      beforeEach(async () => {
        request = await mentorshipController.sendMentorshipRequest(
          sendMentorshipRequestStub().senderId,
          sendMentorshipRequestStub().mentorId,
          dto,
        );
      });
      test('it should return new created mentorship request', () => {
        expect(request).toEqual(sendMentorshipRequestStub);
      });
      test('it should be called with userId, mentorId and dto', () => {
        expect(mentorshipService.sendMentorshipRequest).toBeCalledWith(
          sendMentorshipRequestStub().senderId,
          sendMentorshipRequestStub().mentorId,
          dto,
        );
      });
    });
  });

  describe('getMyMentorshipsRequests', () => {
    describe('when getMyMentorshipsRequests is called', () => {
      let requests: Mentorships[];
      beforeEach(async () => {
        const { id } = getUserMentorshipsRequestsStub()[0];
        requests = await mentorshipController.getUserMentorshipsRequests(id)[0];
      });
      test('it should be called with userId', () => {
        expect(mentorshipService.getUserMentorshipsRequests).toBeCalledWith(
          getUserMentorshipsRequestsStub()[0].senderId,
        );
      });
      test('it should return all sended requests', () => {
        expect(requests).toEqual(getUserMentorshipsRequestsStub);
      });
    });
  });

  describe('getReceivedMentorshipsRequests', () => {
    describe('when getReceivedMentorshipsRequestsStub is called', () => {
      let requests: Mentorships[];
      beforeEach(async () => {
        requests = await mentorshipController.getReceivedMentorshipsRequests(
          getReceivedMentorshipsRequestsStub()[0].mentorId,
        );
      });
      test('it should be called with userId', () => {
        expect(mentorshipService.getReceivedMentorshipsRequests).toBeCalledWith(
          getReceivedMentorshipsRequestsStub()[0].mentorId,
        );
      });
      test('it should return received requests', () => {
        expect(requests).toEqual(getReceivedMentorshipsRequestsStub);
      });
    });
  });

  describe('verifyPendingMentorships', () => {
    describe('when verifyPendingMentorships is called', () => {
      let requests: Mentorships;
      const status: StatusType = StatusType.Accepted;
      beforeEach(async () => {
        requests = await mentorshipController.verifyPendingMentorships(
          verifyPendingMentorshipsStub().mentorId,
          verifyPendingMentorshipsStub().id,
          StatusType.Accepted,
        );
      });
      test('it should be called with mentorId, requestId and status', () => {
        expect(mentorshipService.verifyPendingMentorships).toBeCalledWith(
          verifyPendingMentorshipsStub().mentorId,
          verifyPendingMentorshipsStub().id,
          status,
        );
      });
    });
  });
});
