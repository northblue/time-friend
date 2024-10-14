import TaskModel from '@/models/Task';
import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

describe('Task Model', () => {
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
    await TaskModel.deleteMany({});
  });

  test('should create a new task', async () => {
    const task = new TaskModel({
      title: 'Test Task',
      description: 'This is a test task',
      userId: new mongoose.Types.ObjectId(),
      planId: new mongoose.Types.ObjectId(),
    });

    await task.save();

    expect(task._id).toBeDefined();
    expect(task.title).toBe('Test Task');
    expect(task.description).toBe('This is a test task');
    expect(task.userId).toBeDefined();
    expect(task.planId).toBeDefined();
    expect(task.completed).toBe(false);
    expect(task.previousTaskId).toBeUndefined();
    expect(task.nextTaskId).toBeUndefined();
  }, 10000); // 增加超时时间为 10 秒

  test('should find a task by title', async () => {
    const task = new TaskModel({
      title: 'Test Task',
      description: 'This is a test task',
      userId: new mongoose.Types.ObjectId(),
      planId: new mongoose.Types.ObjectId(),
    });

    await task.save();

    const foundTask = await TaskModel.findOne({ title: 'Test Task' });

    expect(foundTask).toBeDefined();
    expect(foundTask?.title).toBe('Test Task');
    expect(foundTask?.description).toBe('This is a test task');
    expect(foundTask?.userId).toBeDefined();
    expect(foundTask?.planId).toBeDefined();
    expect(foundTask?.completed).toBe(false);
    expect(foundTask?.previousTaskId).toBeUndefined();
    expect(foundTask?.nextTaskId).toBeUndefined();
  }, 10000); // 增加超时时间为 10 秒

  test('should update a task', async () => {
    const task = new TaskModel({
      title: 'Test Task',
      description: 'This is a test task',
      userId: new mongoose.Types.ObjectId(),
      planId: new mongoose.Types.ObjectId(),
    });

    await task.save();

    const foundTask = await TaskModel.findOne({ title: 'Test Task' });

    if (foundTask) {
      foundTask.description = 'This is an updated test task';
      foundTask.completed = true;
      await foundTask.save();

      const updatedTask = await TaskModel.findOne({ title: 'Test Task' });

      expect(updatedTask?.description).toBe('This is an updated test task');
      expect(updatedTask?.completed).toBe(true);
    }
  }, 10000); // 增加超时时间为 10 秒

  test('should link previous and next tasks', async () => {
    const previousTask = new TaskModel({
      title: 'Previous Task',
      description: 'This is the previous task',
      userId: new mongoose.Types.ObjectId(),
      planId: new mongoose.Types.ObjectId(),
    });

    await previousTask.save();

    const nextTask = new TaskModel({
      title: 'Next Task',
      description: 'This is the next task',
      userId: new mongoose.Types.ObjectId(),
      planId: new mongoose.Types.ObjectId(),
      previousTaskId: previousTask._id,
    });

    await nextTask.save();

    const foundNextTask = await TaskModel.findOne({ title: 'Next Task' }).populate('previousTaskId');

    expect(foundNextTask).toBeDefined();
    expect(foundNextTask?.title).toBe('Next Task');
    expect(foundNextTask?.description).toBe('This is the next task');

    if (foundNextTask?.previousTaskId) {
      const previousTaskDocument = await TaskModel.findById(foundNextTask.previousTaskId);
      expect(previousTaskDocument?.title).toBe('Previous Task');
      expect(previousTaskDocument?.description).toBe('This is the previous task');
    }
  }, 10000); // 增加超时时间为 10 秒
});