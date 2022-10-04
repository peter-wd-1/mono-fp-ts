const nxPreset = require('@nrwl/jest/preset').default

module.exports = {
  ...nxPreset,
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      compiler: 'ttypescript',
    },
  },
  setupFiles: ['<rootDir>/../../jest-auto-mock.config.ts'],
}
