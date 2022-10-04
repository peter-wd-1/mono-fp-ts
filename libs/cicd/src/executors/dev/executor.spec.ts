import { DevExecutorSchema } from './schema'
import { mainPipeline } from './executor'
import { createMock, createHydratedMock } from 'ts-auto-mock'
import { ExecutorContext, ProjectConfiguration } from '@nrwl/devkit'
import { ChildProcess, exec } from 'child_process'
import * as utils from '@rfiready/utils'

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

describe('Lib Dependency', () => {
  it('can dependent on @rfiready/utils', () => {
    expect(utils).toBeDefined()
  })
})

describe('Dev Executor Pipe line Task', () => {
  it('can define', async () => {
    expect(mainPipeline(options, context)).toBeInstanceOf(Object)
  })
})

describe('Dev Executor', () => {
  it('can run', async () => {
    const promisfy = (child: ChildProcess) =>
      new Promise((resolve, reject) => {
        child.addListener('error', reject)
        child.addListener('exit', resolve)
      })
    const child = exec('yarn nx run cicd:execute-dev')
    child.stdin?.write('\uE007')
    child.stdout?.setEncoding('utf-8')
    child.stdout?.on('data', (data: string) => {
      if (data.includes('Done.')) expect(true).toBe(true)
    })
    child.stdin?.end()
    expect(await promisfy(child)).toBe(0)
  })
})
