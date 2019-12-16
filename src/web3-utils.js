import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { Contract as EthersContract } from '@ethersproject/contracts'
import env from './environment'
import KNOWN_CONTRACTS_ALL from './known-contracts'
import { useWeb3Connect } from './web3-connect'

import balanceOfAbi from './abi/token-balanceof.json'

const KNOWN_CONTRACTS = KNOWN_CONTRACTS_ALL.get(env('CHAIN_ID')) || {}
const ADDRESS_REGEX = /^0x[0-9a-fA-F]{40}$/

// `value` is a big int represented as a string.
function balanceFromBigInt(value) {
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

export function useTokenBalance(symbol) {
  const { account, ethersProvider } = useWeb3Connect()
  const [balance, setBalance] = useState(balanceFromBigInt(-1))

  const contractAddress = KNOWN_CONTRACTS[symbol]

  useEffect(() => {
    if (!account || !ethersProvider) {
      setBalance(balanceFromBigInt(-1))
      return
    }

    const tokenContract = new EthersContract(
      contractAddress,
      balanceOfAbi,
      ethersProvider
    )

    Promise.all([
      tokenContract.balanceOf(account),
      tokenContract.decimals(),
    ]).then(([balance, decimals]) => {
      setBalance(
        balanceFromBigInt(balance.div(BigNumber.from(10).pow(decimals)))
      )
    })
  }, [account, ethersProvider, contractAddress])

  return balance
}

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
