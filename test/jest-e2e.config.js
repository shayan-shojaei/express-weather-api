const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('../tsconfig')


module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  moduleNameMapper: pathsToModuleNameMapper(
    compilerOptions.paths,
    {
      prefix: '<rootDir>/../'
    }
  ),
  globalSetup: './globalSetup.ts',
  globalTeardown: './globalTeardown.ts',
  maxWorkers: 1,
} 