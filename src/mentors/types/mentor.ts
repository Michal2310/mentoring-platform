import { Countries, Languages, Mentors, Skills, Users } from '@prisma/client';

export interface MentorExtendedInfo extends Mentors {
  user: {
    firstname: string;
    lastname: string;
    title: string;
    about: string;
    skills: Skills[];
    languages: Languages[];
    image: {
      fileUrl: string;
    }[];
  };
}

export interface MentorInfo {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  title: string;
  about: string;
  skills: Skills[];
  languages: Languages[];
  image: {
    fileUrl: string;
  }[];
}

export interface BecomeMentorExtendedInfo extends Users {
  skills: Skills[];
  country: Countries[];
  languages: Languages[];
}

export enum StatusType {
  Accepted = 'Accepted',
  Rejected = 'Rejected',
}
