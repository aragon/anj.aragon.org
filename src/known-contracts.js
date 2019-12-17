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
      WRAPPER: '0x',
      JURORS_REGISTRY: '0xf9dda954adf5e54b89f988c1560553a0a387cce1',
    },
  ],
  [
    '4',
    {
      TOKEN_ANT: '0x5cC7986D7A793b9930BD80067ca54c3E6D2F261B',
      TOKEN_ANJ: '0x975Ef6B5fde81C24C4Ec605091f2e945872b6036',
      WRAPPER: '0xE7C706BB93b87e0cA63D61Be96Ebd88806E35A55',
      JURORS_REGISTRY: '0xe089e929fff1912796f55a0f09fa23190f94ed78',
    },
  ],
])

const ABIS = new Map([
  ['TOKEN_ANT', tokenAbi],
  ['TOKEN_ANJ', tokenAbi],
  ['WRAPPER', wrapperAbi],
  ['JURORS_REGISTRY', jurorsRegistryAbi],
])

export function getKnownContract(name) {
  const knownContracts = KNOWN_CONTRACTS_BY_ENV.get(env('CHAIN_ID')) || {}
  return [knownContracts[name] || null, ABIS.get(name) || []]
}

export default KNOWN_CONTRACTS_BY_ENV
