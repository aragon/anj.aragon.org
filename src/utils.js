import { BigNumber } from '@ethersproject/bignumber'

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
