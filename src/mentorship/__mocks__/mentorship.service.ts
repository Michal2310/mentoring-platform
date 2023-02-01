import {
  sendMentorshipRequestStub,
  getUserMentorshipsRequestsStub,
  getReceivedMentorshipsRequestsStub,
  verifyPendingMentorshipsStub,
} from '../test/stubs/mentorship.stub';

export const MentorshipService = jest.fn().mockReturnValue({
  sendMentorshipRequest: jest.fn().mockResolvedValue(sendMentorshipRequestStub),
  getUserMentorshipsRequests: jest.fn().mockResolvedValue(getUserMentorshipsRequestsStub),
  getReceivedMentorshipsRequests: jest
    .fn()
    .mockResolvedValue(getReceivedMentorshipsRequestsStub),
  verifyPendingMentorships: jest.fn().mockResolvedValue(verifyPendingMentorshipsStub),
});
