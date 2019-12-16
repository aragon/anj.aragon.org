import React, { useCallback, useMemo, useState } from 'react'
const ADDRESS_REGEX = /^0x[0-9a-fA-F]{40}$/

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
