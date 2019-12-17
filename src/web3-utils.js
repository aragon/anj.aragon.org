import { useEffect, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'

const ADDRESS_REGEX = /^0x[0-9a-fA-F]{40}$/

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

  const multiplier = BigNumber.from(10)
    .pow(decimals)
    .toString()

  const parts = value.split('.')

  const intPart = BigNumber.from(parts[0] || '0').mul(multiplier)
  const decPart = BigNumber.from(
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
      .then(response => {
        return response.json()
      })
      .then(price => {
        if (parseFloat(balance) > 0) {
          setUsd(
            balanceFromBigInt(
              balance.value
                .mul(BigNumber.from(parseInt(price.USD * 1000000, 10)))
                .div(1000000)
            ).toString()
          )
        }
      })
  }, [balance])

  return usd
}
