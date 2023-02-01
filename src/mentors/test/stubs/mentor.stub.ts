import { BecomeMentorExtendedInfo, MentorExtendedInfo, MentorInfo } from '../../types';

const date = new Date();

export const getMentorsStub = (): MentorExtendedInfo[] => {
  return [
    {
      id: 1,
      status: 'Accepted',
      userId: 1,
      views: 10,
      user: {
        firstname: '',
        lastname: '',
        about: '',
        title: '',
        languages: [{ language: '', id: 1 }],
        skills: [{ skill: '', id: 1 }],
        image: [{ fileUrl: '' }],
      },
    },
  ];
};

export const getMentorStub = (): MentorInfo[] => {
  return [
    {
      id: 1,
      firstname: '',
      lastname: '',
      email: '',
      about: '',
      title: '',
      languages: [{ language: '', id: 1 }],
      skills: [{ skill: '', id: 1 }],
      image: [{ fileUrl: '' }],
    },
  ];
};

export const sendMentorRequestStub = (): BecomeMentorExtendedInfo => {
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
    languages: [{ language: '', id: 1 }],
    skills: [{ skill: '', id: 1 }],
    country: [{ id: 1, country: '' }],
  };
};
