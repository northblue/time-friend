import MilestoneModel from '@/models/Milestone';
import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

describe('Milestone Model', () => {
  let mongoServer: MongoMemoryServer;

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
    await MilestoneModel.deleteMany({});
  });

  test('should create a new milestone', async () => {
    const milestone = new MilestoneModel({
      title: 'Test Milestone',
      description: 'This is a test milestone',
      dueDate: new Date(),
      taskId: new mongoose.Types.ObjectId(),
    });

    await milestone.save();

    expect(milestone._id).toBeDefined();
    expect(milestone.title).toBe('Test Milestone');
    expect(milestone.description).toBe('This is a test milestone');
    expect(milestone.dueDate).toBeDefined();
    expect(milestone.taskId).toBeDefined();
    expect(milestone.completed).toBe(false);
  }, 10000); // 增加超时时间为 10 秒

  test('should find a milestone by title', async () => {
    const milestone = new MilestoneModel({
      title: 'Test Milestone',
      description: 'This is a test milestone',
      dueDate: new Date(),
      taskId: new mongoose.Types.ObjectId(),
    });

    await milestone.save();

    const foundMilestone = await MilestoneModel.findOne({ title: 'Test Milestone' });

    expect(foundMilestone).toBeDefined();
    expect(foundMilestone?.title).toBe('Test Milestone');
    expect(foundMilestone?.description).toBe('This is a test milestone');
    expect(foundMilestone?.dueDate).toBeDefined();
    expect(foundMilestone?.taskId).toBeDefined();
    expect(foundMilestone?.completed).toBe(false);
  }, 10000); 

  test('should update a milestone', async () => {
    const milestone = new MilestoneModel({
      title: 'Test Milestone',
      description: 'This is a test milestone',
      dueDate: new Date(),
      taskId: new mongoose.Types.ObjectId(),
    });

    await milestone.save();

    const foundMilestone = await MilestoneModel.findOne({ title: 'Test Milestone' });

    if (foundMilestone) {
      foundMilestone.description = 'This is an updated test milestone';
      foundMilestone.completed = true;
      await foundMilestone.save();

      const updatedMilestone = await MilestoneModel.findOne({ title: 'Test Milestone' });

      expect(updatedMilestone?.description).toBe('This is an updated test milestone');
      expect(updatedMilestone?.completed).toBe(true);
    }
  }, 10000); 
});