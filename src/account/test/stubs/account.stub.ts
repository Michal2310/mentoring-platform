import { Users } from '@prisma/client';
import { AccountExtendedInfo } from '../../types';

const date = new Date();

export const getUserAccountStub = (): AccountExtendedInfo => {
  return {
    id: 1,
    firstname: '',
    lastname: '',
    email: '',
    about: '',
    role: 'User',
    isMentor: false,
    isVerified: false,
    title: '',
    refreshToken: '',
    password: '',
    verifyToken: '',
    becameMentor: date,
    favoritesCoaches: 1,
    languages: [{ language: '' }],
    skills: [{ skill: '' }],
    image: [{ fileUrl: '' }],
    country: [
      {
        id: 1,
        country: '',
      },
    ],
  };
};

export const changePasswordAccountStub = (): Users => {
  return {
    id: 1,
    firstname: '',
    lastname: '',
    email: '',
    about: '',
    role: 'User',
    isMentor: false,
    isVerified: false,
    title: '',
    refreshToken: '',
    password: '',
    verifyToken: '',
    becameMentor: date,
    favoritesCoaches: 1,
  };
};
