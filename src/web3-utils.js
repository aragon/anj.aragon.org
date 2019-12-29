import { useEffect, useState } from 'react'
import { utils as EthersUtils } from 'ethers'
import { bigNum } from './utils'

const ADDRESS_REGEX = /^0x[0-9a-fA-F]{40}$/
const NUM_DIGIT_REGEX = /^\d$/

export function isAddress(address) {
  return ADDRESS_REGEX.test(address)
}

export function shortenAddress(address, charsLength = 4) {
  const prefixLength = 2 // "0x"
  if (!address) {
    return ''
  }
  if (address.length < charsLength * 2 + prefixLength) {
    return address
  }
  return (
    address.slice(0, charsLength + prefixLength) +
    '…' +
    address.slice(-charsLength)
  )
}

export function getNetworkName(chainId) {
  chainId = String(chainId)

  if (chainId === '1') return 'Mainnet'
  if (chainId === '4') return 'Rinkeby'

  return 'Unknown'
}

export function identifyProvider(provider) {
  if (provider && provider.isMetaMask) {
    return 'metamask'
  }
  return 'unknown'
}

// Converts a token value from its decimal form
// into its integer form, both as strings.
export function toTokenInteger(value, decimals) {
  if (decimals === undefined) {
    throw new Error('Please specify the number of decimals')
  }

  const multiplier = bigNum(10)
    .pow(decimals)
    .toString()

  const parts = String(value).split('.')

  const intPart = bigNum(parts[0] || '0').mul(multiplier)
  const decPart = bigNum(
    (parts[1] || '').padEnd(decimals, '0').slice(0, decimals)
  )

  return intPart.add(decPart).toString()
}

// Converts a token value from its integer form
// into its decimal form, both as strings.
export function fromTokenInteger(value, decimals) {
  if (decimals === undefined) {
    throw new Error('Please specify the number of decimals')
  }

  value = String(value).padStart(decimals, '0')
  const decPart = value.slice(-decimals).replace(/0+$/, '')

  return (value.slice(0, -decimals) || '0') + (decPart ? `.${decPart}` : '')
}

// Convert a token into a USD price
export function useTokenToUsd(token, balance) {
  const [usd, setUsd] = useState('-')
  useEffect(() => {
    fetch(
      'https://min-api.cryptocompare.com/data/price?fsym=' +
        token +
        '&tsyms=USD'
    )
      .then(res => res.json())
      .then(price => {
        if (parseFloat(balance) > 0) {
          setUsd(
            balanceFromBigInt(
              balance.value
                .mul(bigNum(parseInt(price.USD * 1000000, 10)))
                .div(1000000)
            ).toString()
          )
        }
      })
  }, [balance])

  return usd
}

// Returns an object representing a balance.
// `value` is a big int represented as a string.
export function balanceFromBigInt(value) {
  value = bigNum(value)
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

// Parse a unit set for an input and return it as a BigNumber.
export function parseInputUnits(value, digits = 18) {
  value = value.replace(/,/g, '').trim()
  return EthersUtils.parseUnits(value || '0', digits)
}

export function formatInputUnits(value, digits = 18, commas = true) {
  let valueBeforeCommas = EthersUtils.formatUnits(value.toString(), digits)

  // Replace 0 by an empty value
  if (valueBeforeCommas === '0.0') {
    return ''
  }

  // EthersUtils.formatUnits() adds a decimal even when 0, this removes it.
  valueBeforeCommas = valueBeforeCommas.replace(/\.0$/, '')

  return commas ? EthersUtils.commify(valueBeforeCommas) : valueBeforeCommas
}
