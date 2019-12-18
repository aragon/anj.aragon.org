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
import {
  useTokenBalance,
  useJurorRegistryAnjBalance,
} from '../../web3-contracts'
import { identifyProvider } from '../../web3-utils'

const large = css => breakpoint('large', css)
const medium = css => breakpoint('medium', css)

const Providers = () => {
  const { account, activate, deactivate } = useWeb3Connect()
  const [show, setShow] = useState(false)
  const [target, setTarget] = useState(null)
  const ref = useRef(null)

  const isMetamask = identifyProvider(window.ethereum) === 'metamask'

  return (
    <Content>
      <p className="title">Enable your account</p>
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
  )
}

const Content = styled.div`
  min-height: 450px;
  width: 100%;
  flex-direction: column;
  align-items: baseline;
  justify-content: space-between;
  margin-top: 130px;
  ${large('padding-right: 30px; margin-top: 0;')};

  p.title {
    font-size: 22px;
    font-family: 'FontRegular', sans-serif;
    color: #1c1c1c;
    line-height: 38px;
    padding: 20px 0;
    margin: 0;
    max-width: 90vw;
  }
  div {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    button {
      border: solid 0 transparent;
      background: #ffffff;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
      border-radius: 4px;
      width: 100%;
      min-width: 137px;
      ${medium('min-width: 170px;')};
      margin: 5px;
      padding: 15px 15px 10px 15px;
      display: flex;
      align-items: center;
      p {
        font-family: 'FontRegular', sans-serif;
        color: #1c1c1c;
        font-size: 20px;
        line-height: 25px;
        margin: 0;
      }
      img {
        margin: 0 20px 10px 0;
      }
    }
  }
`

export default Providers
