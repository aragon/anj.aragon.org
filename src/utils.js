import React, { useState, useEffect, useCallback } from 'react'
import { utils as EthersUtils } from 'ethers'
import * as Sentry from '@sentry/browser'
import { request } from 'graphql-request'
import { toBN } from 'web3-utils'
import { useWeb3Connect } from './web3-connect'
import env from './environment'

const GQL_ENDPOINT =
  'https://api.thegraph.com/subgraphs/name/aragon/aragon-court'

const FETCH_JURORS_RETRY_DELAY = 1000

export function noop() {}

export function bigNum(value) {
  return new EthersUtils.BigNumber(value)
}

export function useAnJurors() {
  const [jurors, setJurors] = useState(0)
  const [activeAnj, setActiveAnj] = useState('0')

  useEffect(() => {
    let retryTimer

    async function fetchJurors() {
      let response

      try {
        response = await request(
          GQL_ENDPOINT,
          `
            {
              jurors(first: 1000) {
                activeBalance
              }
            }
          `
        )
        if (!response.jurors) {
          throw new Error('Wrong response')
        }
      } catch (err) {
        retryTimer = setTimeout(fetchJurors, FETCH_JURORS_RETRY_DELAY)
        return
      }

      const { jurors } = response

      const anjActivated = jurors.reduce(
        (acc, { activeBalance }) => acc.add(toBN(activeBalance)),
        toBN(0)
      )

      setJurors(jurors.length)
      setActiveAnj(anjActivated)
    }

    fetchJurors()

    return () => {
      clearTimeout(retryTimer)
    }
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
