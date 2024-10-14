import UserModel from '@/models/User';
import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

describe('User Model', () => {
  let mongoServer: MongoMemoryServer; // 显式指定类型

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  }, 10000); // 增加超时时间为 10 秒

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
  }, 10000); // 增加超时时间为 10 秒

  beforeEach(async () => {
    // 在每个测试用例开始前清理数据
    await UserModel.deleteMany({});
  });

  test('should create a new user', async () => {
    const user = new UserModel({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
    });

    await user.save();

    expect(user._id).toBeDefined();
    expect(user.username).toBe('testuser');
    expect(user.email).toBe('testuser@example.com');
  }, 10000); // 增加超时时间为 10 秒

  test('should find a user by username', async () => {
    const user = new UserModel({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
    });

    await user.save();

    const foundUser = await UserModel.findOne({ username: 'testuser' });

    expect(foundUser).toBeDefined();
    expect(foundUser?.username).toBe('testuser');
    expect(foundUser?.email).toBe('testuser@example.com');
  }, 10000); // 增加超时时间为 10 秒

  test('should update a user', async () => {
    const user = new UserModel({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
    });

    await user.save();

    const foundUser = await UserModel.findOne({ username: 'testuser' });

    if (foundUser) {
      foundUser.email = 'updateduser@example.com';
      await foundUser.save();

      const updatedUser = await UserModel.findOne({ username: 'testuser' });

      expect(updatedUser?.email).toBe('updateduser@example.com');
    }
  }, 10000); // 增加超时时间为 10 秒
});