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

// Handles the main logic of the app.
export function useConverterLogic() {
  const actions = {
    convertTokens: useConvertTokensAction(),
  }

  return {
    actions,
  }
}
