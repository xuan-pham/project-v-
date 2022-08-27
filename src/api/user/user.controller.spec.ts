import { Query } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService]
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService)
  });

  describe('getAllUser', () => {
    it('should return an array of user', async () => {
      const filter = 'xuanpham'
      const page = 1;
      const limit = 10;

    })
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
