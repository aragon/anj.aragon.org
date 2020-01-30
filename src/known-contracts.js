import env from './environment'

import tokenAbi from './abi/token.json'
import ercTokenAbi from './abi/erctoken.json'
import jurorsRegistryAbi from './abi/jurors-registry.json'
import wrapperAbi from './abi/wrapper.json'

const KNOWN_CONTRACTS_BY_ENV = new Map([
  [
    '1',
    {
      TOKEN_ANT: '0x960b236A07cf122663c4303350609A66A7B288C0',
      TOKEN_ANJ: '0xcD62b1C403fa761BAadFC74C525ce2B51780b184',
      TOKEN_DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      TOKEN_USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      WRAPPER: '0x47F0622dE95ed6FC707Ee8EEcb967d79d84cE344',
      JURORS_REGISTRY: '0xf9dda954adf5e54b89f988c1560553a0a387cce1',
    },
  ],
  [
    '4',
    {
      TOKEN_ANT: '0x2D23F49a6C1B60e614952d8b0D53bd7a2DbF6433',
      TOKEN_ANJ: '0x2f61FfC3C1d058212Cd08077fc84D883916F74E3',
      TOKEN_DAI: '0x55Ab9B236CDC9e2CecBD41ADa45D8261f8A6049b',
      TOKEN_USDC: '',
      WRAPPER: '0x86DFD24835732c1283b259155AaE0F8ffD9E0715',
      JURORS_REGISTRY: '0x13474160a55a4579B9fE79e6aF8E28727516098A',
    },
  ],
])

const ABIS = new Map([
  ['TOKEN_ANT', tokenAbi],
  ['TOKEN_ANJ', tokenAbi],
  ['TOKEN_DAI', ercTokenAbi],
  ['TOKEN_USDC', ercTokenAbi],
  ['JURORS_REGISTRY', jurorsRegistryAbi],
  ['WRAPPER', wrapperAbi],
])

export function getKnownContract(name) {
  const knownContracts = KNOWN_CONTRACTS_BY_ENV.get(env('CHAIN_ID')) || {}
  return [knownContracts[name] || null, ABIS.get(name) || []]
}

export default KNOWN_CONTRACTS_BY_ENV
