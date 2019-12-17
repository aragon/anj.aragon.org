import { useEffect, useState, useCallback } from 'react'
import { Contract as EthersContract } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'
import { getKnownContract } from './known-contracts'
import { balanceFromBigInt } from './utils'
import { useWeb3Connect } from './web3-connect'

const contractsCache = new Map()

export function useContract(address, abi, signer = true) {
  const { ethersProvider } = useWeb3Connect()

  if (!address || !ethersProvider) {
    return null
  }

  // TODO: clear the cache when the provider changes
  if (contractsCache.has(address)) {
    return contractsCache.get(address)
  }

  const contract = new EthersContract(
    address,
    abi,
    signer ? ethersProvider.getSigner() : ethersProvider
  )

  contractsCache.set(address, contract)

  return contract
}

export function useKnownContract(name, signer = true) {
  const [address, abi] = getKnownContract(name)
  return useContract(address, abi, signer)
}

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
