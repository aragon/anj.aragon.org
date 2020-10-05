import env from './environment'

import tokenAbi from './abi/token.json'
import ercTokenAbi from './abi/erctoken.json'
import jurorsRegistryAbi from './abi/jurors-registry.json'
import wrapperAbi from './abi/wrapper.json'
import bancorAbi from './abi/bancor.json'
import fundraisingAbi from './abi/fundraising.json'

const KNOWN_CONTRACTS_BY_ENV = new Map([
  [
    '1',
    {
      BANCOR_FORMULA: '0x274Aac49b63F07Bf6998964aD20020b18383a09D',
      BONDING_CURVE_TREASURY: '0xEc0DD1579551964703246BeCfbF199C27Cb84485',
      FUNDRAISING: '0x0b4D742d52EE0C4391439f80822B26fDF1ad6Ee7',
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
      BANCOR_FORMULA: '0x274Aac49b63F07Bf6998964aD20020b18383a09D',
      BONDING_CURVE_TREASURY: '0xEc0DD1579551964703246BeCfbF199C27Cb84485',
      FUNDRAISING: '0x0b4D742d52EE0C4391439f80822B26fDF1ad6Ee7',
      TOKEN_ANT: '0x960b236A07cf122663c4303350609A66A7B288C0',
      TOKEN_ANJ: '0xcD62b1C403fa761BAadFC74C525ce2B51780b184',
      TOKEN_DAI: '0xe9A083D88Eed757B1d633321Ce0519F432c6284d',
      TOKEN_USDC: '0xB9DE9Fa099E1415B491ed6072B4F947955e6B596',
      WRAPPER: '0xf338b32da0708Cc69Fe1385A853aE1e546Ca6679',
      JURORS_REGISTRY: '0xE93d5c00E939BddF4962371AEcBBCBD39Bf9925f',
    },
  ],
])

const ABIS = new Map([
  ['JURORS_REGISTRY', jurorsRegistryAbi],
  ['BANCOR_FORMULA', bancorAbi],
  ['FUNDRAISING', fundraisingAbi],
  ['TOKEN_ANT', tokenAbi],
  ['TOKEN_ANJ', tokenAbi],
  ['TOKEN_DAI', ercTokenAbi],
  ['TOKEN_USDC', ercTokenAbi],
  ['WRAPPER', wrapperAbi],
])

export function getKnownContract(name) {
  const knownContracts = KNOWN_CONTRACTS_BY_ENV.get(env('CHAIN_ID')) || {}
  return [knownContracts[name] || null, ABIS.get(name) || []]
}

export default KNOWN_CONTRACTS_BY_ENV
