import React, { useCallback } from 'react'
import { utils as EthersUtils } from 'ethers'
import { useWeb3Connect } from './web3-connect'
import env from './environment'

export function noop() {}

export function bigNum(value) {
  return new EthersUtils.BigNumber(value)
}

export function usePostEmail() {
  const { account } = useWeb3Connect() || ''
  return useCallback(
    async email =>
      fetch(env('SUBSCRIPTIONS_URL'), {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, address: account }),
      }),
    [account]
  )
}

export const CSS_UNSELECTABLE = `
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`

export const ENABLE_CONVERTER_AT = new Date('January 7, 2020 18:00:00 GMT+0000')
