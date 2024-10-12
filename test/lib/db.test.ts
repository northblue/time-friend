import connectDB from '@/lib/db';
import { expect, test } from '@jest/globals';
import mongoose from 'mongoose';

const runFullTests = process.env.RUN_FULL_TESTS === 'true';

describe('MongoDB Connection', () => {
  beforeAll(async () => {
    if (runFullTests) {
      await connectDB();
    }
  });

  afterAll(async () => {
    if (runFullTests) {
      await mongoose.connection.close();
    }
  });

  if (runFullTests) {
    test('should connect to MongoDB', async () => {
      expect(mongoose.connection.readyState).toBe(1); // 1 means connected
    });
  } else {
    test.skip('MongoDB connection test skipped', () => {});
  }
});