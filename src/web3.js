import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { Web3Provider as EthersWeb3Provider } from '@ethersproject/providers'
import { Contract as EthersContract } from '@ethersproject/contracts'
import { Web3ReactProvider, useWeb3React } from '@web3-react/core'
import InjectedConnector, {
  NoEthereumProviderError as InjectedNoEthereumProviderError,
  UserRejectedRequestError as InjectedUserRejectedRequestError,
} from '@web3-react/injected-connector'
import FrameConnector, {
  UserRejectedRequestError as FrameUserRejectedRequestError,
} from '@web3-react/frame-connector'
import FortmaticConnector from '@web3-react/fortmatic-connector'
import PortisConnector from '@web3-react/portis-connector'
import env from './environment'
import KNOWN_CONTRACTS_ALL from './known-contracts'

import balanceOfAbi from './abi/token-balanceof.json'

const CHAIN_ID = env('CHAIN_ID')
const KNOWN_CONTRACTS = KNOWN_CONTRACTS_ALL.get(CHAIN_ID) || {}

const WEB3_REACT_CONNECTORS = new Map([
  [
    'injected',
    new InjectedConnector({ supportedChainIds: [Number(CHAIN_ID)] }),
  ],
  ['frame', new FrameConnector({ supportedChainIds: [CHAIN_ID] })],
  ['fortmatic', new FortmaticConnector({ apiKey: '', chainId: CHAIN_ID })],
  [
    'portis',
    new PortisConnector({
      dAppId: '',
      networks: [{ chainId: CHAIN_ID }],
    }),
  ],
])

function getNetworkName(chainId) {
  if (chainId === '1') return 'Mainnet'
  if (chainId === '4') return 'Rinkeby'
  return 'Unknown'
}

function balanceFrom(value) {
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
  const { account, ethersProvider } = useWeb3()
  const [balance, setBalance] = useState(balanceFrom(-1))

  const contractAddress = KNOWN_CONTRACTS[symbol]

  useEffect(() => {
    if (!account || !ethersProvider) {
      setBalance(balanceFrom(-1))
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
      setBalance(balanceFrom(balance.div(BigNumber.from(10).pow(decimals))))
    })
  }, [account, ethersProvider, contractAddress])

  return balance
}

export function useWeb3() {
  const web3ReactContext = useWeb3React()

  const activate = useCallback(
    type => {
      const connector = WEB3_REACT_CONNECTORS.get(type)

      if (connector) {
        web3ReactContext.activate(connector, err => {
          console.error('err', err)
        })
      }
    },
    [web3ReactContext]
  )

  const {
    chainId,
    account,
    library: ethersProvider,
    deactivate,
  } = web3ReactContext

  return {
    account,
    activate,
    deactivate,
    ethersProvider,
    networkName: getNetworkName(chainId),
    web3ReactContext,
  }
}

export function identifyProvider(provider) {
  if (provider && provider.isMetaMask) {
    return 'metamask'
  }
  return 'unknown'
}

export function Web3Provider({ children }) {
  const getLibrary = useCallback(
    provider => new EthersWeb3Provider(provider),
    []
  )
  return (
    <Web3ReactProvider getLibrary={getLibrary}>{children}</Web3ReactProvider>
  )
}
