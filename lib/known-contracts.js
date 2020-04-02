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
      WRAPPER: '0x0EbDB778b88D73B2C513B53849724d8F30363Cc2',
      JURORS_REGISTRY: '0x0F7471C1df2021fF45f112878F755aAbe7AA16bF',
    },
  ],
  [
    '4',
    {
      TOKEN_ANT: '0x5cC7986D7A793b9930BD80067ca54c3E6D2F261B',
      TOKEN_ANJ: '0x975Ef6B5fde81C24C4Ec605091f2e945872b6036',
      TOKEN_DAI: '0xe9A083D88Eed757B1d633321Ce0519F432c6284d',
      TOKEN_USDC: '0xB9DE9Fa099E1415B491ed6072B4F947955e6B596',
      WRAPPER: '0x81F9338Ac54AFaD73B609ec42333A8A3C80CB293',
      JURORS_REGISTRY: '0xe089e929FFf1912796F55a0f09fA23190F94eD78',
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
