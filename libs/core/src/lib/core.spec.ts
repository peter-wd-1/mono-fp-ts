import { core } from './core'
import { Data } from '@rfiready/data'

const a: Data = {
  test: 'testing value',
}

describe('core', () => {
  it('should work', () => {
    expect(core()).toEqual('core')
  })
  it('should import data', () => {
    expect(a.test).toEqual('testing value')
  })
})
