import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
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

const CHAIN_ID = env('CHAIN_ID')

const WEB3_REACT_CONNECTORS = new Map([
  ['injected', new InjectedConnector({ supportedChainIds: [CHAIN_ID] })],
  ['frame', new InjectedConnector({ supportedChainIds: [CHAIN_ID] })],
  ['fortmatic', new InjectedConnector({ apiKey: '', chainId: CHAIN_ID })],
  [
    'portis',
    new InjectedConnector({ networks: [{ chainId: String(CHAIN_ID) }] }),
  ],
])

export function useWeb3() {
  const web3ReactContext = useWeb3React()

  const activate = useCallback(
    type => {
      const connector = WEB3_REACT_CONNECTORS.get(type)
      if (connector) {
        web3ReactContext.activate(connector)
      }
    },
    [web3ReactContext]
  )

  return {
    account: web3ReactContext.account,
    activate,
    deactivate: web3ReactContext.deactivate,
    web3ReactContext,
  }
}
