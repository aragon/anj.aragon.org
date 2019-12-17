import { useEffect, useState, useCallback } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { getKnownContract } from './known-contracts'
import { balanceFromBigInt } from './utils'
import { useWeb3Connect } from './web3-connect'
import { useKnownContract } from './web3-contract'

export function useTokenDecimals(symbol) {
  const [decimals, setDecimals] = useState(-1)
  const tokenContract = useKnownContract(`TOKEN_${symbol}`)

  useEffect(() => {
    let cancelled = false
    setDecimals(-1)

    if (tokenContract) {
      tokenContract.decimals().then(decimals => {
        if (!cancelled) {
          setDecimals(decimals)
        }
      })
    }

    return () => (cancelled = true)
  }, [tokenContract])

  return decimals
}

export function useTokenBalance(symbol) {
  const { account, ethersProvider } = useWeb3Connect()
  const [balance, setBalance] = useState(balanceFromBigInt(-1))
  const tokenContract = useKnownContract(`TOKEN_${symbol}`)
  const decimals = useTokenDecimals(symbol)

  useEffect(() => {
    let cancelled = false

    if (!account || !tokenContract) {
      setBalance(balanceFromBigInt(-1))
      return
    }

    tokenContract.balanceOf(account).then(balance => {
      if (!cancelled) {
        setBalance(
          balanceFromBigInt(balance.div(BigNumber.from(10).pow(decimals)))
        )
      }
    })

    return () => (cancelled = true)
  }, [account, tokenContract, decimals])

  return balance
}

export function useJurorRegistryAnjBalance() {
  const { account, ethersProvider } = useWeb3Connect()
  const [balance, setBalance] = useState(balanceFromBigInt(-1))

  const tokenContract = useKnownContract('TOKEN_ANJ')
  const jurorsRegistryContract = useKnownContract('JURORS_REGISTRY')

  useEffect(() => {
    if (!account || !tokenContract || !jurorsRegistryContract) {
      setBalance(balanceFromBigInt(-1))
      return
    }

    Promise.all([
      jurorsRegistryContract.balanceOf(account),
      tokenContract.decimals(),
    ]).then(([balances, decimals]) => {
      setBalance(
        balanceFromBigInt(balances[0].div(BigNumber.from(10).pow(decimals)))
      )
    })
  }, [account, tokenContract, jurorsRegistryContract])

  return balance
}

// Convert ANT to ANJ action
export function useConvertAntToAnj() {
  const { ethersProvider } = useWeb3Connect()

  const antContract = useKnownContract('TOKEN_ANT')
  const [wrapperAddress] = getKnownContract('WRAPPER')

  return useCallback(
    async antAmount => {
      if (!antContract || !wrapperAddress) {
        return false
      }

      return antContract.approveAndCall(wrapperAddress, antAmount, '0x00', {
        gasLimit: 7500000,
      })
    },
    [antContract, wrapperAddress]
  )
}
