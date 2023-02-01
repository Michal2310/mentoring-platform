import { Countries, Users } from '@prisma/client';

export interface AccountExtendedInfo extends Users {
  country: Countries[];
  languages: {
    language: string;
  }[];
  skills: {
    skill: string;
  }[];
  image: {
    fileUrl: string;
  }[];
}
