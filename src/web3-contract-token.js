import { useEffect, useState } from 'react'
import { Contract as EthersContract } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'
import { useWeb3Connect } from './web3-connect'
import { balanceFromBigInt } from './utils'
import KNOWN_CONTRACTS_ALL from './known-contracts'
import env from './environment'
import balanceOfAbi from './abi/token-balanceof.json'

const KNOWN_CONTRACTS = KNOWN_CONTRACTS_ALL.get(env('CHAIN_ID')) || {}

export function useTokenBalance(symbol) {
  const { account, ethersProvider } = useWeb3Connect()
  const [balance, setBalance] = useState(balanceFromBigInt(-1))

  const contractAddress = KNOWN_CONTRACTS[`TOKEN_${symbol}`]

  useEffect(() => {
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
  }, [account, ethersProvider, contractAddress])

  return balance
}

export function useConvertAntToAnj(amount) {
  const a = useWeb3Connect()
  return function convert() {}
}