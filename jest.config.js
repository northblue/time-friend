const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',  // 项目根目录
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
  },

  testEnvironment: 'jest-environment-jsdom',

  testMatch: ['<rootDir>/test/**/*.test.(js|jsx|ts|tsx)'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json',
    },
  },
};

module.exports = createJestConfig(customJestConfig);
