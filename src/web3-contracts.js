import { useEffect, useRef, useState, useCallback } from 'react'
import { Contract as EthersContract } from 'ethers'
import { getKnownContract } from './known-contracts'
import tokenBalanceOfAbi from './token-balanceof.json'
import { useWeb3Connect } from './web3-connect'
import Web3EthContract from 'web3-eth-contract'
import { bigNum, useUniswapTokenRate } from './utils'
import { fromWei, toWei } from 'web3-utils'

const NETWORK_AGENT_ADDR = '0x5E8c17A6065C35b172B10E80493D2266e2947DF4'
const NETWORK_RESERVE_ADDR = '0xec0dd1579551964703246becfbf199c27cb84485'
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
  const ethToAntRate = useUniswapTokenRate('ETH')

  return useCallback(
    async (amount, estimatedAnt) => {
      if ((!tokenContract && selectedToken !== 'ETH') || !wrapperAddress) {
        throw new Error('Could not get the token and wrapper contract.')
      }

      // now + 60s * 120min
      const twoHourExpiry = Math.floor(Date.now() / 1000) + 60 * 120
      const underestimatedAnt = estimatedAnt
        .mul(95)
        .div(100)
        .toString()

      // If the user has selected ETH, we can just send the ETH to the function
      if (selectedToken === 'ETH') {
        return await wrapperContract.contributeEth(
          underestimatedAnt,
          twoHourExpiry,
          true,
          {
            gasLimit: 1000000,
            value: amount,
          }
        )
      }

      // If the user has selected ANT, we can directly
      // approve and call the wrapper using ANT's approveAndCall
      if (selectedToken === 'ANT') {
        return tokenContract.approveAndCall(wrapperAddress, amount, '0x00', {
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

      const estimatedEth = bigNum(
        toWei(
          String(
            parseFloat(ethToAntRate.rateInverted.toString()) *
              parseFloat(fromWei(estimatedAnt.toString(), 'ether'))
          )
        )
      )
        .mul(95)
        .div(100)
      return await wrapperContract.contributeExternalToken(
        tokenAddress,
        amount,
        underestimatedAnt,
        estimatedEth,
        twoHourExpiry,
        true,
        {
          gasLimit: 1000000,
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
      ethToAntRate,
    ]
  )
}

export function useAntStaked() {
  const [antStaked, setAntStaked] = useState('0')
  useEffect(() => {
    async function fetchAntStaked() {
      Web3EthContract.setProvider('wss://mainnet.eth.aragon.network/ws')
      const ANT_ADDR = getKnownContract('TOKEN_ANT')[0]
      const ant = new Web3EthContract(tokenBalanceOfAbi, ANT_ADDR)
      const antStakedInAgent = bigNum(
        await ant.methods.balanceOf(NETWORK_AGENT_ADDR).call()
      )
      const antStakedInVault = bigNum(
        await ant.methods.balanceOf(NETWORK_RESERVE_ADDR).call()
      )
      const totalAntStaked = antStakedInAgent.add(antStakedInVault).toString()
      setAntStaked(totalAntStaked)
    }
    fetchAntStaked()
  }, [])
  return antStaked
}
