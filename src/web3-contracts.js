import { useEffect, useRef, useState, useCallback } from 'react'
import { Contract as EthersContract } from 'ethers'
import { getKnownContract } from './known-contracts'
import { useWeb3Connect } from './web3-connect'
import { bigNum } from './utils'

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
  const { account } = useWeb3Connect()
  const [balance, setBalance] = useState(bigNum(-1))
  const tokenContract = useKnownContract(`TOKEN_${symbol}`)

  const cancelBalanceUpdate = useRef(null)

  const updateBalance = useCallback(() => {
    let cancelled = false

    if (cancelBalanceUpdate.current) {
      cancelBalanceUpdate.current()
      cancelBalanceUpdate.current = null
    }

    if (!account || !tokenContract) {
      setBalance(bigNum(-1))
      return
    }

    cancelBalanceUpdate.current = () => {
      cancelled = true
    }

    tokenContract.balanceOf(account).then(balance => {
      if (!cancelled) {
        setBalance(balance)
      }
    })
  }, [account, tokenContract])

  useEffect(() => {
    // Always update the balance if updateBalance() has changed
    updateBalance()

    if (!tokenContract || !account) {
      return
    }

    const onTransfer = (from, to, value) => {
      if (from === account || to === account) {
        updateBalance()
      }
    }
    tokenContract.on('Transfer', onTransfer)

    // Filter transfers from and to the account
    // const filters = [
    //   tokenContract.filters.Transfer(account),
    //   tokenContract.filters.Transfer(null, account),
    // ]
    // filters.forEach(filter => tokenContract.on(filter, onTransfer))

    return () => {
      tokenContract.removeListener('Transfer', onTransfer)

      // filters.forEach(filter =>
      //   tokenContract.removeListener(filter, onTransfer)
      // )
    }
  }, [account, tokenContract, updateBalance])

  return balance
}

export function useJurorRegistryAnjBalance() {
  const { account } = useWeb3Connect()
  const [balance, setBalance] = useState(bigNum(-1))

  const tokenContract = useKnownContract('TOKEN_ANJ')
  const jurorsRegistryContract = useKnownContract('JURORS_REGISTRY')
  const wrapperContract = useKnownContract('WRAPPER')

  const cancelBalanceUpdate = useRef(null)

  const updateBalance = useCallback(() => {
    let cancelled = false

    if (cancelBalanceUpdate.current) {
      cancelBalanceUpdate.current()
      cancelBalanceUpdate.current = null
    }

    if (!account || !tokenContract || !jurorsRegistryContract) {
      setBalance(bigNum(-1))
      return
    }

    cancelBalanceUpdate.current = () => {
      cancelled = true
    }

    jurorsRegistryContract.balanceOf(account).then(([activeBalance]) => {
      if (!cancelled) {
        setBalance(activeBalance)
      }
    })
  }, [account, tokenContract, jurorsRegistryContract])

  useEffect(() => {
    // Always update the balance if updateBalance() has changed
    updateBalance()

    if (!wrapperContract || !account) {
      return
    }

    const onBoughtAndActivated = (from, to, value) => {
      if (from === account) {
        updateBalance()
      }
    }
    wrapperContract.on('BoughtAndActivated', onBoughtAndActivated)

    return () => {
      wrapperContract.removeListener('BoughtAndActivated', onBoughtAndActivated)
    }
  }, [account, wrapperContract, updateBalance])

  return balance
}

// Convert ANT to ANJ action
export function useConvertAntToAnj() {
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

export function usePostEmail() {
  const { account } = useWeb3Connect() || ''

  return useCallback(async email => {
    await fetch('https://court-backend.eth.aragon.network/subscriptions', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        address: account,
      }),
    })
      .then(res => res.json())
      .then(responseJson => {
        return responseJson
      })
      .catch(error => {
        console.error(error)
      })
    return
  })
}
