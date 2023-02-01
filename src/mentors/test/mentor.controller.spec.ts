import { Test } from '@nestjs/testing';
import { MentorDto } from '../dto';
import { MentorController } from '../mentor.controller';
import { MentorService } from '../mentor.service';
import { MentorExtendedInfo, MentorInfo } from '../types';
import { sendMentorRequestStub, getMentorsStub, getMentorStub } from './stubs/mentor.stub';

jest.mock('../mentor.service.ts');

describe('MentorController', () => {
  let mentorController: MentorController;
  let mentorService: MentorService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      controllers: [MentorController],
      providers: [MentorService],
    }).compile();
    mentorController = module.get<MentorController>(MentorController);
    mentorService = module.get<MentorService>(MentorService);

    jest.clearAllMocks();
  });

  describe('getMentors', () => {
    describe('when getMentors is called', () => {
      let mentors: MentorExtendedInfo[];
      const page: number = 2;
      beforeEach(async () => {
        mentors = await mentorController.getAllMentors(page);
      });
      test('it should be called with passed page number', () => {
        expect(mentorService.getAllMentors).toBeCalledWith(page);
      });
      test('it should return mentors', () => {
        expect(mentors).toEqual(getMentorsStub);
      });
    });
  });

  describe('getMentor', () => {
    describe('when getMentor is called', () => {
      let mentor: MentorInfo[];
      const { id } = getMentorStub()[0];
      beforeEach(async () => {
        mentor = await mentorController.getMentor(id)[0];
      });

      test('it should be called with userId', () => {
        expect(mentorService.getMentor).toBeCalledWith(id);
      });

      test('it should return user', () => {
        expect(mentor).toEqual(getMentorStub[0]);
      });
    });
  });

  describe('becomeMentor', () => {
    describe('when getMentor is called', () => {
      let mentor: { message: string };
      const dto: MentorDto = {
        firstname: sendMentorRequestStub().firstname,
        lastname: sendMentorRequestStub().lastname,
        about: sendMentorRequestStub().about,
        title: sendMentorRequestStub().title,
        country: sendMentorRequestStub().country[0].country,
        languages: sendMentorRequestStub().languages.map((language) => {
          return language.language;
        }),
        skills: sendMentorRequestStub().skills.map((skill) => {
          return skill.skill;
        }),
      };
      beforeEach(async () => {
        mentor = await mentorController.sendMentorRequest(sendMentorRequestStub().id, dto);
      });
      test('it should be called with userId and dto', () => {
        expect(mentorService.sendMentorRequest).toHaveBeenCalledWith(
          sendMentorRequestStub().id,
          dto,
        );
      });
    });
  });
});
