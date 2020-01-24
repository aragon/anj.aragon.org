import { useEffect, useRef, useState, useCallback } from 'react'
import { Contract as EthersContract } from 'ethers'
import { getKnownContract } from './known-contracts'
import tokenBalanceOfAbi from './token-balanceof.json'
import { useWeb3Connect } from './web3-connect'
import Web3EthContract from 'web3-eth-contract'
import { bigNum } from './utils'

const PRESALE_ADDR = '0xf89c8752d82972f94a4d1331e010ed6593e8ec49'
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

export function useEthBalance() {
  const { account, web3ReactContext } = useWeb3Connect()
  const [balance, setBalance] = useState(bigNum(-1))

  const cancelBalanceUpdate = useRef(null)

  const updateBalance = useCallback(() => {
    let cancelled = false

    if (cancelBalanceUpdate.current) {
      cancelBalanceUpdate.current()
      cancelBalanceUpdate.current = null
    }

    if (!account || !web3ReactContext) {
      setBalance(bigNum(-1))
      return
    }

    cancelBalanceUpdate.current = () => {
      cancelled = true
    }

    web3ReactContext.library.getBalance(account).then(balance => {
      if (!cancelled) {
        setBalance(balance)
      }
    })
  }, [account, web3ReactContext])

  useEffect(() => {
    // Always update the balance if updateBalance() has changed
    updateBalance()

    if (!web3ReactContext || !account) {
      return
    }

    const onTransfer = (from, to, value) => {
      if (from === account || to === account) {
        updateBalance()
      }
    }
    web3ReactContext.library.on('Transfer', onTransfer)

    return () => {
      web3ReactContext.library.removeListener('Transfer', onTransfer)
    }
  }, [account, web3ReactContext, updateBalance])

  return balance
}

export function useTokenBalance(symbol) {
  const { account, web3ReactContext } = useWeb3Connect()
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
        gasLimit: 1000000,
      })
    },
    [antContract, wrapperAddress]
  )
}

// export function useConvertEthToAnj() {
// const { account } = useWeb3Connect()
// const [wrapperAddress] = getKnownContract('WRAPPER')
// // for making this line usable we need to have the ABI
// const wrapperContract = useContract(wrapperContract, wrapperAbi)

// return useCallback(
// async ethAmount => {
// if (!wrapperContract) {
// return false
// }
// const tx = await wrapperContract.methods
// .contributeEth(0, 60, true)
// .send({ from: account, value: ethAmount })
// if (tx.error) {
// return false
// }
// return true
// },
// [account]
// )
// }

export function useAntStaked() {
  const [antStaked, setAntStaked] = useState('0')
  useEffect(() => {
    async function fetchAntStaked() {
      Web3EthContract.setProvider('wss://mainnet.eth.aragon.network/ws')
      const ANT_ADDR = getKnownContract('TOKEN_ANT')[0]
      const ant = new Web3EthContract(tokenBalanceOfAbi, ANT_ADDR)
      const antStaked = await ant.methods.balanceOf(PRESALE_ADDR).call()
      setAntStaked(String(antStaked))
    }
    fetchAntStaked()
  }, [])
  return antStaked
}
