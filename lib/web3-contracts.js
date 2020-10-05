import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { Contract as EthersContract, providers as Providers } from 'ethers'
import { getKnownContract } from './known-contracts'
import tokenBalanceOfAbi from './token-balanceof.json'
import { useWeb3Connect } from './web3-connect'
import Web3EthContract from 'web3-eth-contract'
import { calculateSlippageAmount, bigNum } from './utils'

const NETWORK_RESERVE_ADDR = '0xec0dd1579551964703246becfbf199c27cb84485'

const MAINNET_ETH_ENDPOINT = 'wss://mainnet.eth.aragon.network/ws'

const MAINNET_CONNECTOR_WEIGHT = 250000

const RETRY_EVERY = 1000

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

export function useContractReadOnly(address, abi) {
  const ethEndpoint = 'https://mainnet.eth.aragon.network/'
  const ethProvider = useMemo(
    () => (ethEndpoint ? new Providers.JsonRpcProvider(ethEndpoint) : null),
    [ethEndpoint]
  )

  return useMemo(() => {
    if (!address) {
      return null
    }
    return new EthersContract(address, abi, ethProvider)
  }, [abi, address, ethProvider])
}

export function useKnownContract(name, signer = true) {
  const [address, abi] = getKnownContract(name)
  return useContract(address, abi, signer)
}

export function useKnownContractReadOnly(name) {
  const [address, abi] = getKnownContract(name)
  return useContractReadOnly(address, abi)
}

export function useTokenDecimals(symbol) {
  const [decimals, setDecimals] = useState(-1)
  const tokenContract = useKnownContract(`TOKEN_${symbol}`)

  useEffect(() => {
    let cancelled = false
    setDecimals(-1)

    if (symbol === 'ETH') {
      setDecimals(18)
    } else if (tokenContract) {
      tokenContract.decimals().then(decimals => {
        if (!cancelled) {
          setDecimals(decimals)
        }
      })
    }

    return () => (cancelled = true)
  }, [symbol, tokenContract])

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

export function useTokenBalanceReadOnly(symbol, address = '') {
  const [balance, setBalance] = useState(bigNum(-1))
  const tokenContract = useKnownContractReadOnly(`TOKEN_${symbol}`)

  const cancelBalanceUpdate = useRef(null)

  const updateBalance = useCallback(() => {
    let cancelled = false

    if (cancelBalanceUpdate.current) {
      cancelBalanceUpdate.current()
      cancelBalanceUpdate.current = null
    }

    if ((!address) || !tokenContract) {
      setBalance(bigNum(-1))
      return
    }

    cancelBalanceUpdate.current = () => {
      cancelled = true
    }
    const requestedAddress = address
    tokenContract.balanceOf(requestedAddress).then(balance => {
      if (!cancelled) {
        setBalance(balance)
      }
    })
  }, [address, tokenContract])

  useEffect(() => {
    // Always update the balance if updateBalance() has changed
    updateBalance()

    if ((!address) || !tokenContract) {
      return
    }

    const onTransfer = (from, to, value) => {
      if (
        from === address ||
        to === address
      ) {
        updateBalance()
      }
    }
    tokenContract.on('Transfer', onTransfer)

    return () => {
      tokenContract.removeListener('Transfer', onTransfer)
    }
  }, [address, tokenContract, updateBalance])

  return balance
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

    const onBought = (from, to, value) => {
      if (from === account) {
        updateBalance()
      }
    }
    wrapperContract.on('Bought', onBought)

    return () => {
      wrapperContract.removeListener('Bought', onBought)
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

export function useConvertTokenToAnj(selectedToken) {
  const { account } = useWeb3Connect()
  const tokenContract = useKnownContract(`TOKEN_${selectedToken}`)
  const wrapperContract = useKnownContract(`WRAPPER`)
  const [tokenAddress] = getKnownContract(`TOKEN_${selectedToken}`)
  const [wrapperAddress] = getKnownContract('WRAPPER')

  return useCallback(
    async (amount, estimatedAnj, activate = true) => {
      if ((!tokenContract && selectedToken !== 'ETH') || !wrapperAddress) {
        throw new Error('Could not get the token and wrapper contract.')
      }

      // now + 60s * 120min
      const twoHourExpiry = Math.floor(Date.now() / 1000) + 60 * 120
      const minAnj = calculateSlippageAmount(estimatedAnj).toString()

      // As minAnj already ensures the amount of tokens received,
      // we can safely ignore this value by setting it to 1
      const minEth = bigNum(1)
      // If the user has selected ETH, we can just send the ETH to the function
      if (selectedToken === 'ETH') {
        return await wrapperContract.contributeEth(
          minAnj,
          twoHourExpiry,
          true,
          {
            gasLimit: 850000,
            value: amount,
          }
        )
      }

      // If the user has selected ANT, we can directly
      // approve and call the wrapper using ANT's approveAndCall
      if (selectedToken === 'ANT') {
        // We're padding to 64 as we want to create a 32-byte word.
        const encodedActivation = (activate ? '1' : '0').padStart(64, '0')
        // bigNumbers can be converted to hex strings directly;
        // however, as they're returned with '0x' appended at the start,
        // we shave off the first two characters with '.slice(2)'
        const encodedMinTokens = bigNum(minAnj)
          .toHexString()
          .slice(2)
          .padStart(64, '0')
        const encodedMinEth = minEth
          .toHexString()
          .slice(2)
          .padStart(64, '0')
        // .toString() has an optional parameter to set the base for representing the number;
        // As we need a hexadecimal string, we set it to base 16.
        // Note that this method does not append 0x.
        const encodedDeadline = twoHourExpiry.toString(16).padStart(64, '0')

        const data = `0x${encodedActivation}${encodedMinTokens}${encodedMinEth}${encodedDeadline}`

        return tokenContract.approveAndCall(wrapperAddress, amount, data, {
          gasLimit: 1000000,
        })
      }

      // else, we may need two transactions:
      //   1. the approval if we don't have enough allowance,
      //   2. the token contribution
      const allowance = await tokenContract.allowance(account, wrapperAddress)
      if (allowance.lt(bigNum(amount))) {
        try {
          await tokenContract.approve(wrapperAddress, amount, {
            gasLimit: 200000,
          })
          // Don't wait for the approval to be mined before showing second transaction
        } catch (err) {
          throw new Error('User did not approve transaction')
        }
      }

      return await wrapperContract.contributeExternalToken(
        amount,
        tokenAddress,
        minAnj,
        minEth,
        twoHourExpiry,
        activate,
        {
          gasLimit: 850000,
        }
      )
    },
    [
      selectedToken,
      tokenAddress,
      tokenContract,
      wrapperAddress,
      wrapperContract,
      account,
    ]
  )
}

export function useAntStaked() {
  const [antStaked, setAntStaked] = useState('0')
  useEffect(() => {
    async function fetchAntStaked() {
      Web3EthContract.setProvider(MAINNET_ETH_ENDPOINT)
      const ANT_ADDR = getKnownContract('TOKEN_ANT')[0]
      const ant = new Web3EthContract(tokenBalanceOfAbi, ANT_ADDR)
      const antInVault = await ant.methods
        .balanceOf(NETWORK_RESERVE_ADDR)
        .call()
      const totalAntStaked = bigNum(antInVault)
      setAntStaked(totalAntStaked)
    }

    fetchAntStaked()
  }, [])
  return antStaked
}

export function useBondingCurvePrice(amount, forwards = true) {
  const [loading, setLoading] = useState(false)
  const [price, setPrice] = useState(bigNum(-1))
  const anjContract = useKnownContractReadOnly('TOKEN_ANJ')
  const bancorContract = useKnownContractReadOnly('BANCOR_FORMULA')

  const [treasuryAddress] = getKnownContract('BONDING_CURVE_TREASURY')
  const antTreasuryBalance = useTokenBalanceReadOnly('ANT', treasuryAddress)
  const connectorWeight = MAINNET_CONNECTOR_WEIGHT
  console.log(anjContract, bancorContract)
  useEffect(() => {
    let cancelled = false
    let retryTimer

    if (!anjContract || antTreasuryBalance.eq(-1) || !bancorContract) {
      return
    }

    const getSalePrice = async () => {
      try {
        setLoading(true)
        const anjTotalSupply = await anjContract.totalSupply()
        const salePrice = await (forwards
          ? bancorContract.calculatePurchaseReturn(
              anjTotalSupply,
              antTreasuryBalance,
              connectorWeight,
              amount
            )
          : bancorContract.calculateSaleReturn(
              anjTotalSupply,
              antTreasuryBalance,
              connectorWeight,
              amount
            ))
        if (!cancelled) {
          setLoading(false)
          setPrice(salePrice)
        }
      } catch (err) {
        if (!cancelled) {
          retryTimer = setTimeout(getSalePrice, RETRY_EVERY)
        }
      }
    }

    getSalePrice()

    return () => {
      cancelled = true
      clearTimeout(retryTimer)
    }
  }, [
    amount,
    anjContract,
    antTreasuryBalance,
    bancorContract,
    connectorWeight,
    forwards,
  ])

  return useMemo(() => ({ loading, price }), [loading, price])
}
