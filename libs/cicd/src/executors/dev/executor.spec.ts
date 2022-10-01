import { DevExecutorSchema } from './schema'
import executor from './executor'
import { createMock, createHydratedMock } from 'ts-auto-mock'
import { ExecutorContext, ProjectConfiguration } from '@nrwl/devkit'

const options: DevExecutorSchema = {}
const context: ExecutorContext = createMock<ExecutorContext>({
  workspace: {
    projects: {
      testproj1: createHydratedMock<ProjectConfiguration>(),
      testproj2: createHydratedMock<ProjectConfiguration>(),
      testproj3: createHydratedMock<ProjectConfiguration>(),
    },
  },
})

describe('Dev Executor', () => {
  it('can run', async () => {
    const output = await executor(options, context)
    expect(output.success).toBe(true)
  })
})
