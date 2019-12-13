import React, { useCallback, useMemo, useState } from 'react'

function noop() {}

function done() {
  console.log('DONEEEE')
}

// Convert tokens action
export function useConvertTokensAction(onDone = done) {
  return useCallback(
    async amount => {
      console.log('Amount', amount)
      onDone()
    },
    [onDone]
  )
}

export function useEnableAccountAction(onDone = noop) {
  console.log('Enable account')
}

// Handles the main logic of the app.
export function useConverterLogic() {
  const actions = {
    convertTokens: useConvertTokensAction(),
    EnableAccount: useEnableAccountAction(),
  }

  return {
    actions,
  }
}

export function shortenAddress(address, charsLength = 4) {
  const prefixLength = 2 // "0x"
  if (!address) {
    return ''
  }
  if (address.length < charsLength * 2 + prefixLength) {
    return address
  }
  return (
    address.slice(0, charsLength + prefixLength) +
    '…' +
    address.slice(-charsLength)
  )
}

export function useAccount() {
  const account = 'bla'
  const balance = 15.345
  const isContract = false
  const enableWallet = false
  const walletNetwork = 'Metamask'
  const walletProviderId = 'Rinkeby'

  return {
    balance,
    isContract,
    address: account,
    connected: Boolean(account),
    enable: enableWallet,
    networkId: walletNetwork,
    providerInfo: walletProviderId,
  }
}
