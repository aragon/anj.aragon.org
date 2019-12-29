import { utils as EthersUtils } from 'ethers'

export function noop() {}

export function bigNum(value) {
  return new EthersUtils.BigNumber(value)
}

export const CSS_UNSELECTABLE = `
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`
