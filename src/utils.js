import React, { useState, useEffect, useCallback } from 'react'
import { utils as EthersUtils } from 'ethers'
import * as Sentry from '@sentry/browser'
import { useWeb3Connect } from './web3-connect'
import env from './environment'
import { request } from 'graphql-request'
import { toBN } from 'web3-utils'
const GQL_ENDPOINT =
  'https://api.thegraph.com/subgraphs/name/aragon/aragon-court'

export function noop() {}

export function bigNum(value) {
  return new EthersUtils.BigNumber(value)
}

export function useAnJurors() {
  const [jurors, setJurors] = useState(0)
  const [activeAnj, setActiveAnj] = useState('0')
  useEffect(() => {
    async function fetchJurors() {
      const { jurors } = await request(
        GQL_ENDPOINT,
        `
          {
            jurors {
              activeBalance
            }
          }
        `
      )
      const anjActivated = jurors.reduce(
        (acc, { activeBalance }) => acc.add(toBN(activeBalance)),
        toBN(0)
      )
      setJurors(jurors.length)
      setActiveAnj(anjActivated)
    }
    fetchJurors()
  }, [])

  return [jurors, activeAnj]
}

export function usePostEmail() {
  const { account } = useWeb3Connect() || ''
  return useCallback(
    async email => {
      let result
      try {
        const response = await fetch(env('SUBSCRIPTIONS_URL'), {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, address: account }),
        })
        if (!response.ok) {
          throw new Error(
            `Received a wrong status when trying to subscribe: ${response.status}.`
          )
        }
      } catch (err) {
        Sentry.withScope(scope => {
          scope.setUser({ email, username: account })
          Sentry.captureException(err)
        })
      }
    },
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

export const ACTIVATION_START = new Date('January 7, 2020 18:00:00 GMT+0000')
export const ACTIVATION_END = new Date('February 10, 2020 00:00:00 GMT+0000')
