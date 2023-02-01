import { Mentorships } from '@prisma/client';

const date = new Date();

export const sendMentorshipRequestStub = (): Mentorships => {
  return {
    id: 10,
    background: '',
    expectations: '',
    message: '',
    status: 'Accepted',
    senderId: 2,
    mentorId: 1,
    createdAt: date,
  };
};

export const getUserMentorshipsRequestsStub = (): Mentorships[] => {
  return [
    {
      id: 10,
      background: '',
      expectations: '',
      message: '',
      status: 'Accepted',
      senderId: 2,
      mentorId: 1,
      createdAt: date,
    },
    {
      id: 11,
      background: '',
      expectations: '',
      message: '',
      status: 'Accepted',
      senderId: 2,
      mentorId: 3,
      createdAt: date,
    },
  ];
};
export const getReceivedMentorshipsRequestsStub = (): Mentorships[] => {
  return [
    {
      id: 10,
      background: '',
      expectations: '',
      message: '',
      status: 'Pending',
      senderId: 2,
      mentorId: 6,
      createdAt: date,
    },
    {
      id: 11,
      background: '',
      expectations: '',
      message: '',
      status: 'Pending',
      senderId: 2,
      mentorId: 6,
      createdAt: date,
    },
  ];
};

export const verifyPendingMentorshipsStub = (): Mentorships => {
  return {
    id: 12,
    background: '',
    expectations: '',
    message: '',
    status: 'Pending',
    senderId: 3,
    mentorId: 7,
    createdAt: date,
  };
};
