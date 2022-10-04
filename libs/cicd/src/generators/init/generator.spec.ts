import {
  eqPort,
  getFindPortFromCfg,
  getRootServiceCfg,
  validatePort,
  validateServiceName,
  validateUserConfiguration,
} from './features/generateServiceConfig'
import assert from 'assert'
import * as E from 'fp-ts/Either'

describe('Init Generator', () => {
  it('can', () => {
    assert.deepStrictEqual(eqPort.equals({ PORT: 'testing' }, { PORT: 'testing' }), true)

    assert.deepStrictEqual(eqPort.equals({ PORT: 'testing2' }, { PORT: 'testing' }), false)

    assert.deepStrictEqual(getRootServiceCfg()._tag, 'Right')

    assert.deepStrictEqual(
      getFindPortFromCfg('3005'),
      E.right([{ PORT: '3005', SERVICE_NAME: 'authapi' }]),
    )

    assert.deepStrictEqual(validatePort('99999'), E.right('99999'))
    assert.deepStrictEqual(
      validateUserConfiguration({ port: 99999, serviceName: 'testing' }),
      E.right({ PORT: '99999', SERVICE_NAME: 'testing' }),
    )
    // assert.deepStrictEqual(validateServiceName('apiproxy'), E.right('99999'))
    expect(true).toBe(true)
  })
})
