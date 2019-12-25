import React, { useCallback } from 'react'
import { providers as EthersProviders } from 'ethers'
import {
  UnsupportedChainIdError,
  Web3ReactProvider,
  useWeb3React,
} from '@web3-react/core'
import {
  InjectedConnector,
  NoEthereumProviderError as InjectedNoEthereumProviderError,
  UserRejectedRequestError as InjectedUserRejectedRequestError,
} from '@web3-react/injected-connector'
import {
  FrameConnector,
  UserRejectedRequestError as FrameUserRejectedRequestError,
} from '@web3-react/frame-connector'
import { FortmaticConnector } from '@web3-react/fortmatic-connector'
import { PortisConnector } from '@web3-react/portis-connector'
import env from './environment'
import { getNetworkName } from './web3-utils'

const { Web3Provider: EthersWeb3Provider } = EthersProviders

const CHAIN_ID = Number(env('CHAIN_ID'))

const WEB3_REACT_CONNECTORS = new Map([
  ['injected', new InjectedConnector({ supportedChainIds: [CHAIN_ID] })],
  ['frame', new FrameConnector({ supportedChainIds: [CHAIN_ID] })],
  [
    'fortmatic',
    new FortmaticConnector({
      apiKey: 'pk_test_50DDF49A7D38FE07',
      chainId: [CHAIN_ID],
    }),
  ],
  [
    'portis',
    new PortisConnector({
      dAppId: 'fab3d0cb-ef4b-4530-a14f-e6c979a05ced',
      networks: [CHAIN_ID],
    }),
  ],
])

export function useWeb3Connect() {
  const web3ReactContext = useWeb3React()

  const activate = useCallback(
    async type => {
      const connector = WEB3_REACT_CONNECTORS.get(type)
      if (connector) {
        try {
          await web3ReactContext.activate(connector, null, true)
        } catch (err) {
          const log = typeof window !== 'undefined' ? window.alert : console.log

          if (err instanceof UnsupportedChainIdError) {
            log(
              `Unsupported chain: please connect to the network called ${getNetworkName(
                CHAIN_ID
              )} in your Ethereum Provider.`
            )
            return
          }

          log('Unknown error, please try again.')
        }
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

export function Web3ConnectProvider({ children }) {
  const getLibrary = useCallback(
    provider => new EthersWeb3Provider(provider),
    []
  )
  return (
    <Web3ReactProvider getLibrary={getLibrary}>{children}</Web3ReactProvider>
  )
}
