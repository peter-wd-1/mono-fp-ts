import { Data } from '@rfiready/data'

const a: Data = {
  test: 'testing value',
}

describe('data', () => {
  it('should import data', () => {
    expect(a.test).toEqual('testing value')
  })
})
