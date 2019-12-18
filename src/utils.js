import { BigNumber } from '@ethersproject/bignumber'

export function noop() {}

// `value` is a big int represented as a string.
export function balanceFromBigInt(value) {
  value = BigNumber.from(value)
  return {
    value,
    toString() {
      // BigInt is not really needed since the max amount of ANT or ANJ should
      // be far below Number.MAX_SAFE_INTEGER, but let’s use it if available.
      const bigIntValue =
        typeof BigInt === 'undefined' ? value.toNumber() : BigInt(value)

      if (bigIntValue < 0) {
        return '−'
      }

      return (
        Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        })
          .format(bigIntValue)

          // We only want to get the USD-style format, without the symbol.
          .replace('$', '')
          .trim()
      )
    },
  }
}

export const CSS_UNSELECTABLE = `
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`
