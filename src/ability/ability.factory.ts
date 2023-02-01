import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { PrismaAbility } from '@casl/prisma';

import { Injectable } from '@nestjs/common';
import { UserAbility } from '../auth/dto';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

enum Role {
  User = 'User',
  Admin = 'Admin',
}

type Subjects = InferSubjects<typeof UserAbility> | 'all';

export type AppAbility = PrismaAbility<[Action, Subjects]>;
const AppAbility = PrismaAbility as AbilityClass<AppAbility>;

@Injectable()
export class AbilityFactory {
  createForUser(user: UserAbility) {
    const { can, cannot, build } = new AbilityBuilder(AppAbility);

    if (user.role === 'Admin') {
      can(Action.Manage, 'all');
    } else {
      can(Action.Manage, 'all', { id: user.id });
      can(Action.Delete, 'all', { userId: user.id });
    }

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
