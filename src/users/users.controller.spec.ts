import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeAuthService: Partial<AuthService>;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: async (email: string) => {
        return Promise.resolve([<User>{ id: 1, email, password: '1231231' }]);
      },
      findOne: async (id: number) => {
        return Promise.resolve(<User>{
          id,
          email: 'test@test.com',
          password: '1231231',
        });
      },
      // remove: async () => {}
      // update: async () => {}
    };
    fakeAuthService = {
      // signup: async () => {}
      signin: async (email: string, password: string) => {
        return Promise.resolve(<User>{
          id: 1,
          email,
          password,
        });
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('find all users returns a list of users for a given email', async () => {
    const users = await fakeUsersService.find('test@test.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@test.com');
  });

  it('finds a single user with the given id', async () => {
    const user = await fakeUsersService.findOne(1);
    expect(user).toBeDefined();
    expect(user.email).toEqual('test@test.com');
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('signin updates session and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signin(
      { email: 'test@test.com', password: '1234122' },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
