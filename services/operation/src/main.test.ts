import { createMock } from 'ts-auto-mock'

interface Test {
  a: string
  b: number
}
describe('ts-auto-mock-setup', () => {
  const a = createMock<Test>()
  it('has setup correctly', () => {
    expect(a.a).toBe('')
    expect(a.b).toBe(0)
  })
})
