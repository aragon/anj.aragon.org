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
import { useJurorRegistryAnjBalance } from '../../web3-contracts'

const medium = css => breakpoint('medium', css)

const Balance = () => {
  const { account } = useWeb3Connect()
  const anjBalance = useJurorRegistryAnjBalance()
  return (
    <BalanceSection>
      <p>Your account's active balance</p>
      <h3>
        <span className="mono">{account ? anjBalance.toString() : '0.00'}</span>{' '}
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
    align-items: flex-start;
    letter-spacing: -3px;
    color: #1c1c1c;
  }
  h3 span.mono {
    font-family: 'FontMono';
  }
`

export default Balance
