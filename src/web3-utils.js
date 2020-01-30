import sha3 from 'js-sha3'
import { useEffect, useState } from 'react'
import { utils as EthersUtils } from 'ethers'
import { bigNum } from './utils'

const ADDRESS_REGEX = /^0x[0-9a-fA-F]{40}$/
const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000'
const TRUST_WALLET_BASE_URL =
  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum'
const { keccak_256: keccak256 } = sha3

export function isAddress(address) {
  return ADDRESS_REGEX.test(address)
}

/**
 * Converts to a checksum address
 *
 * This function is taken from web3-utils:
 * https://github.com/ethereum/web3.js/blob/22df832303e349f8ae02f0392e56abe10e1dfaac/packages/web3-utils/src/index.js#L287-L315
 * And was adapted to use js-sha3 rather than soliditySha3.js from web3.js, in
 * order to avoid adding the BN.js and underscore dependencies.
 *
 * @method toChecksumAddress
 * @param {String} address the given HEX address
 * @return {String}
 */
function toChecksumAddress(address) {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    throw new Error(
      'Given address "' + address + '" is not a valid Ethereum address.'
    )
  }

  address = address.toLowerCase().replace(/^0x/i, '')

  const addressHash = keccak256(address).replace(/^0x/i,'')
  let checksumAddress = '0x'

  for (let i = 0; i < address.length; i++) {
    // If ith character is 9 to f then make it uppercase
    if (parseInt(addressHash[i], 16) > 7) {
      checksumAddress += address[i].toUpperCase()
    } else {
      checksumAddress += address[i]
    }
  }

  return checksumAddress
} 

export function tokenIconUrl(address = '') {
  try {
    address = toChecksumAddress(address.trim())
  } catch (err) {
    return ''
  }

  if (address === EMPTY_ADDRESS) {
    return `${TRUST_WALLET_BASE_URL}/info/logo.png`
  }

  return `${TRUST_WALLET_BASE_URL}/assets/${address}/logo.png`
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

/**
 * Convert a token into a USD price
 *
 * @param {String} symbol The symbol of the token to convert from.
 * @param {Number} decimals The amount of decimals for the token.
 * @param {BigNumber} balance The balance to convert into USD.
 */
export function useTokenBalanceToUsd(symbol, decimals, balance) {
  const [usd, setUsd] = useState('-')
  useEffect(() => {
    let cancelled = false

    fetch(
      `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD`
    )
      .then(res => res.json())
      .then(price => {
        if (cancelled || !balance || !(parseFloat(price.USD) > 0)) {
          return
        }

        const usdDigits = 2
        const precision = 6

        const usdBalance = balance
          .mul(bigNum(parseInt(price.USD * 10 ** (precision + usdDigits), 10)))
          .div(10 ** precision)
          .div(bigNum(10).pow(decimals))

        setUsd(formatUnits(usdBalance, { digits: usdDigits }))
      })

    return () => {
      cancelled = true
    }
  }, [balance, decimals, symbol])

  return usd
}

/**
 * Parse a unit set for an input and return it as a BigNumber.
 *
 * @param {String} value Value to parse into an amount of units.
 * @param {Number} options.digits Amount of digits on the token.
 * @return {BigNumber}
 */
export function parseUnits(value, { digits = 18 } = {}) {
  value = value.replace(/,/g, '').trim()
  try {
    return EthersUtils.parseUnits(value || '0', digits)
  } catch (err) {
    return bigNum(-1)
  }
}

/**
 * Format an amount of units to be displayed.
 *
 * @param {BigNumber} value Amount of units to format.
 * @param {Number} options.digits Amount of digits on the token.
 * @param {Boolean} options.commas Use comma-separated groups.
 * @param {Boolean} options.replaceZeroBy The string to be returned when value is zero.
 */
export function formatUnits(
  value,
  { digits = 18, commas = true, replaceZeroBy = '' } = {}
) {
  if (value.lt(0) || digits < 0) {
    return ''
  }

  let valueBeforeCommas = EthersUtils.formatUnits(value.toString(), digits)

  // Replace 0 by an empty value
  if (valueBeforeCommas === '0.0') {
    return replaceZeroBy
  }

  // EthersUtils.formatUnits() adds a decimal even when 0, this removes it.
  valueBeforeCommas = valueBeforeCommas.replace(/\.0$/, '')

  return commas ? EthersUtils.commify(valueBeforeCommas) : valueBeforeCommas
}
