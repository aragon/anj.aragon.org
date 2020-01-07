import env from './environment'

import tokenAbi from './abi/token.json'
import jurorsRegistryAbi from './abi/jurors-registry.json'
import wrapperAbi from './abi/wrapper.json'

const KNOWN_CONTRACTS_BY_ENV = new Map([
  [
    '1',
    {
      TOKEN_ANT: '0x960b236A07cf122663c4303350609A66A7B288C0',
      TOKEN_ANJ: '0xcD62b1C403fa761BAadFC74C525ce2B51780b184',
      WRAPPER: '0xe208809De93a9DE444952b644c84C8FE7f64f8a5',
      JURORS_REGISTRY: '0xf9dda954adf5e54b89f988c1560553a0a387cce1',
    },
  ],
  [
    '4',
    {
      TOKEN_ANT: '0x5cC7986D7A793b9930BD80067ca54c3E6D2F261B',
      TOKEN_ANJ: '0x2f61FfC3C1d058212Cd08077fc84D883916F74E3',
      WRAPPER: '0x671970d3fee809727D1D7D5709b6bb9033E3E877',
      JURORS_REGISTRY: '0x13474160a55a4579B9fE79e6aF8E28727516098A',
    },
  ],
])

const ABIS = new Map([
  ['TOKEN_ANT', tokenAbi],
  ['TOKEN_ANJ', tokenAbi],
  ['JURORS_REGISTRY', jurorsRegistryAbi],
  ['WRAPPER', wrapperAbi],
])

export function getKnownContract(name) {
  const knownContracts = KNOWN_CONTRACTS_BY_ENV.get(env('CHAIN_ID')) || {}
  return [knownContracts[name] || null, ABIS.get(name) || []]
}

export default KNOWN_CONTRACTS_BY_ENV
