import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import {
  Overlay,
  OverlayTrigger,
  Popover,
  ButtonToolbar,
} from 'react-bootstrap'
import Token from './Token'
import enable from './assets/enable.svg'
import metamask from './assets/metamask.svg'
import frame from './assets/frame.svg'
import portis from './assets/portis.svg'
import fortmatic from './assets/fortmatic.svg'
import { breakpoint } from '../../microsite-logic'
import { useWeb3Connect } from '../../web3-connect'
import { useTokenBalance } from '../../web3-contract-token'
import { identifyProvider } from '../../web3-utils'

const medium = css => breakpoint('medium', css)

function EnableAccount() {
  const { account, activate, deactivate } = useWeb3Connect()
  const [show, setShow] = useState(false)
  const [target, setTarget] = useState(null)
  const ref = useRef(null)

  const isMetamask = identifyProvider(window.ethereum) === 'metamask'

  return (
    <OverlayTrigger
      trigger="click"
      rootClose
      placement="bottom"
      overlay={
        <StyledPopover>
          <Content>
            <p className="title">Wallet connect</p>
            <div>
              <button onClick={() => activate('injected')}>
                <img src={metamask} alt="" />
                <p>{isMetamask ? 'Metamask' : 'Wallet'}</p>
              </button>
              <button onClick={() => activate('frame')}>
                <img src={frame} alt="" />
                <p>Frame</p>
              </button>
              <button onClick={() => activate('fortmatic')}>
                <img src={fortmatic} alt="" />
                <p>Fortmatic</p>
              </button>
              <button onClick={() => activate('portis')}>
                <img src={portis} alt="" />
                <p>Portis</p>
              </button>
            </div>
          </Content>
        </StyledPopover>
      }
    >
      <Button>
        <img src={enable} />
        Enable account
      </Button>
    </OverlayTrigger>
  )
}

const Balance = () => {
  const { account } = useWeb3Connect()
  const balanceAnj = useTokenBalance('ANJ')
  return (
    <BalanceSection>
      <p>Your account's active balance</p>
      {account ? (
        <h3>
          <span className="mono">{balanceAnj.toString()} </span>
          <Token symbol="ANJ" />
        </h3>
      ) : (
        <EnableAccount />
      )}
    </BalanceSection>
  )
}

const Button = styled.button`
  background: #ffffff;
  border: 1px solid #c7d1da;
  box-sizing: border-box;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  width: 100%;
  height: 52px;
  text-align: center;
  font-size: 20px;
  line-height: 31px;
  text-align: center;
  color: #1c1c1c;
  cursor: pointer;
  img {
    padding-right: 10.5px;
  }
  &:hover {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  }
`
const Content = styled.div`
  min-width: 450px;
  max-width: 90vw;
  p.title {
    font-size: 22px;
    font-family: 'FontRegular', sans-serif;
    color: #1c1c1c;
    line-height: 38px;
    padding: 20px 20px 12px 20px;
    background: #f9fafc;
    margin: 0;
    max-width: 90vw;
  }
  div {
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    max-width: 90vw;
    width: 449px;
    button {
      background: #ffffff;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
      border-radius: 4px;
      width: calc(50% - 10px);
      min-width: 137px;
      ${medium('min-width: 170px;')};
      margin: 5px;
      padding: 20px 20px 13px 20px;
      p {
        font-family: 'FontRegular', sans-serif;
        color: #1c1c1c;
        font-size: 20px;
        line-height: 25px;
        margin: 0;
      }
      img {
        margin: 0 20px 10px 20px;
      }
    }
  }
`

const StyledPopover = styled(Popover)`
  max-width: 500px;
  background: #ffffff;
  box-shadow: 0px 7px 24px rgba(0, 0, 0, 0.25);
  border: 0 solid transparent;
  max-width: 90vw;

  &.bs-popover-bottom .arrow::after {
    border-bottom-color: #f9fafc;
  }
  &.bs-popover-bottom .arrow::before {
    border-bottom-color: transparent;
  }
`
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
