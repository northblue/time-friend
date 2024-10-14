import PlanModel from '@/models/Plan';
import TaskModel from '@/models/Task';
import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

describe('Plan Model', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  }, 10000); 

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
  }, 10000); 

  beforeEach(async () => {
    // 在每个测试用例开始前清理数据
    await PlanModel.deleteMany({});
    await TaskModel.deleteMany({});
  });

  test('should create a new plan', async () => {
    const plan = new PlanModel({
      title: 'Test Plan',
      description: 'This is a test plan',
      userId: new mongoose.Types.ObjectId(),
    });

    await plan.save();

    expect(plan._id).toBeDefined();
    expect(plan.title).toBe('Test Plan');
    expect(plan.description).toBe('This is a test plan');
    expect(plan.userId).toBeDefined();
    expect(plan.tasks).toHaveLength(0);
  }, 10000); 

  test('should find a plan by title', async () => {
    const plan = new PlanModel({
      title: 'Test Plan',
      description: 'This is a test plan',
      userId: new mongoose.Types.ObjectId(),
    });

    await plan.save();

    const foundPlan = await PlanModel.findOne({ title: 'Test Plan' });

    expect(foundPlan).toBeDefined();
    expect(foundPlan?.title).toBe('Test Plan');
    expect(foundPlan?.description).toBe('This is a test plan');
    expect(foundPlan?.userId).toBeDefined();
    expect(foundPlan?.tasks).toHaveLength(0);
  }, 10000); 

  test('should update a plan', async () => {
    const plan = new PlanModel({
      title: 'Test Plan',
      description: 'This is a test plan',
      userId: new mongoose.Types.ObjectId(),
    });

    await plan.save();

    const foundPlan = await PlanModel.findOne({ title: 'Test Plan' });

    if (foundPlan) {
      foundPlan.description = 'This is an updated test plan';
      await foundPlan.save();

      const updatedPlan = await PlanModel.findOne({ title: 'Test Plan' });

      expect(updatedPlan?.description).toBe('This is an updated test plan');
    }
  }, 10000); 

  test('should add tasks to a plan', async () => {
    const plan = new PlanModel({
      title: 'Test Plan',
      description: 'This is a test plan',
      userId: new mongoose.Types.ObjectId(),
    });

    await plan.save();

    const task1 = new TaskModel({
      title: 'Task 1',
      description: 'This is task 1',
      userId: new mongoose.Types.ObjectId(),
      planId: plan._id,
    });

    const task2 = new TaskModel({
      title: 'Task 2',
      description: 'This is task 2',
      userId: new mongoose.Types.ObjectId(),
      planId: plan._id,
    });

    await task1.save();
    await task2.save();

    plan.tasks.push(task1._id, task2._id);
    await plan.save();

    const foundPlan = await PlanModel.findOne({ title: 'Test Plan' }).populate('tasks');

    expect(foundPlan).toBeDefined();
    expect(foundPlan?.tasks).toHaveLength(2);

    //Will solve this type issue later
    // expect(foundPlan?.tasks[0].title).toBe('Task 1');
    // expect(foundPlan?.tasks[1].title).toBe('Task 2');
  }, 10000); 
});