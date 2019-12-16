import React, { useCallback } from 'react'
import { Web3Provider as EthersWeb3Provider } from '@ethersproject/providers'
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
import { getNetworkName } from './web3-utils'

const CHAIN_ID = Number(env('CHAIN_ID'))

const WEB3_REACT_CONNECTORS = new Map([
  ['injected', new InjectedConnector({ supportedChainIds: [CHAIN_ID] })],
  ['frame', new FrameConnector({ supportedChainIds: [CHAIN_ID] })],
  ['fortmatic', new FortmaticConnector({ apiKey: '', chainId: [CHAIN_ID] })],
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

export function Web3ConnectProvider({ children }) {
  const getLibrary = useCallback(
    provider => new EthersWeb3Provider(provider),
    []
  )
  return (
    <Web3ReactProvider getLibrary={getLibrary}>{children}</Web3ReactProvider>
  )
}
