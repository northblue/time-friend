import connectDB from '@/lib/db';
import { expect, test } from '@jest/globals';
import mongoose from 'mongoose';

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});

test('should connect to MongoDB', async () => {
  expect(mongoose.connection.readyState).toBe(1); // 1 means connected
});