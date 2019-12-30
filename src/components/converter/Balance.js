import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import {
  Overlay,
  OverlayTrigger,
  Popover,
  ButtonToolbar,
} from 'react-bootstrap'
import Token from './Token'
import { breakpoint } from '../../microsite-logic'
import { useWeb3Connect } from '../../web3-connect'
import { formatUnits } from '../../web3-utils'
import {
  useJurorRegistryAnjBalance,
  useTokenDecimals,
} from '../../web3-contracts'

const medium = css => breakpoint('medium', css)

function Balance() {
  const { account } = useWeb3Connect()
  const anjBalance = useJurorRegistryAnjBalance()
  const anjDecimals = useTokenDecimals('ANJ')

  return (
    <BalanceSection>
      <p>Your account’s active balance</p>
      <h3>
        <span className="mono">
          {(account && formatUnits(anjBalance, { digits: anjDecimals })) ||
            '0.00'}
        </span>{' '}
        <Token symbol="ANJ" />
      </h3>
    </BalanceSection>
  )
}

const BalanceSection = styled.div`
  h3 {
    font-size: 54px;
    line-height: 38px;
    display: flex;
    align-items: baseline;
    letter-spacing: -3px;
    color: #1c1c1c;
  }
  h3 span.mono {
    font-family: 'FontMono';
  }
`

export default Balance
