/* eslint-disable */
export default {
  displayName: 'cicd',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      compiler: 'ttypescript',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/cicd',
  setupFiles: ['<rootDir>/jest-auto-mock.config.ts'],
}
