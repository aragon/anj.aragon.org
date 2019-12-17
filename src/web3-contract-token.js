import { useEffect, useState, useCallback } from 'react'
import { Contract as EthersContract } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'
import { useWeb3Connect } from './web3-connect'
import { balanceFromBigInt } from './utils'
import KNOWN_CONTRACTS_ALL from './known-contracts'
import env from './environment'
import balanceOfAbi from './abi/token-balanceof.json'
import jurorsRegistryAbi from './abi/jurors-registry.json'
import approveAndCallAbi from './abi/wrapper.json'

const KNOWN_CONTRACTS = KNOWN_CONTRACTS_ALL.get(env('CHAIN_ID')) || {}

export function useTokenBalance(symbol) {
  const { account, ethersProvider } = useWeb3Connect()
  const [balance, setBalance] = useState(balanceFromBigInt(-1))

  const contractAddress = KNOWN_CONTRACTS[`TOKEN_${symbol}`]

  useEffect(
    () => {
      if (!account || !ethersProvider || !contractAddress) {
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
    },
    [account, ethersProvider, contractAddress]
  )

  return balance
}

export function useJurorRegistryAnjBalance() {
  const { account, ethersProvider } = useWeb3Connect()
  const [balance, setBalance] = useState(balanceFromBigInt(-1))

  const tokenAddress = KNOWN_CONTRACTS['TOKEN_ANJ']
  const jurorsRegistryAddress = KNOWN_CONTRACTS['JURORS_REGISTRY']

  useEffect(
    () => {
      if (!account || !ethersProvider || !tokenAddress) {
        setBalance(balanceFromBigInt(-1))
        return
      }

      const tokenContract = new EthersContract(
        tokenAddress,
        balanceOfAbi,
        ethersProvider
      )

      const jurorsRegistryContract = new EthersContract(
        jurorsRegistryAddress,
        jurorsRegistryAbi,
        ethersProvider
      )

      Promise.all([
        jurorsRegistryContract.balanceOf(account),
        tokenContract.decimals(),
      ]).then(([balances, decimals]) => {
        setBalance(
          balanceFromBigInt(balances[0].div(BigNumber.from(10).pow(decimals)))
        )
      })
    },
    [account, ethersProvider, tokenAddress]
  )

  return balance
}

// Convert ANT to ANJ action
export function useConvertAntToAnj(onDone = done) {
  const { ethersProvider } = useWeb3Connect()
  return useCallback(
    async amount => {
      if (!ethersProvider) {
        return
      }
      const antAddress = KNOWN_CONTRACTS['TOKEN_ANT']
      const wrapperAddress = KNOWN_CONTRACTS['WRAPPER']
      const antContract = new EthersContract(
        antAddress,
        approveAndCallAbi,
        ethersProvider.getSigner()
      )
      let overrides = {
        gasLimit: 7500000,
      }
      antContract
        .approveAndCall(wrapperAddress, amount, '0x00', overrides)
        .then(onDone)
    },
    [onDone, ethersProvider]
  )
}

function done() {
  console.log('done')
}

export function useConvertLogic() {
  const actions = {
    convertAntToAnj: useConvertAntToAnj(),
  }

  return {
    actions,
  }
}

export function useTokenToUsd(token, balance) {
  const [usd, setUsd] = useState('-')
  useEffect(
    () => {
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
            https: setUsd(
              balanceFromBigInt(
                balance.value
                  .mul(BigNumber.from(parseInt(price.USD * 1000000, 10)))
                  .div(1000000)
              ).toString()
            )
          }
        })
    },
    [balance]
  )

  return usd
}
