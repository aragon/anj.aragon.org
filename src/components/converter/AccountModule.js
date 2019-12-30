import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  Overlay,
  OverlayTrigger,
  Popover,
  ButtonToolbar,
} from 'react-bootstrap'
import { useWeb3Connect } from '../../web3-connect'
import {
  useJurorRegistryAnjBalance,
  useTokenBalance,
  useTokenDecimals,
} from '../../web3-contracts'
import {
  formatUnits,
  shortenAddress,
  useTokenBalanceToUsd,
} from '../../web3-utils'
import Token from './Token'
import EthIdenticon from './EthIdenticon'

function AccountModule({ compact }) {
  const { account } = useWeb3Connect()
  return account ? <ConnectedMode /> : null
}

AccountModule.propTypes = {
  compact: PropTypes.bool,
}

function ConnectedMode() {
  const {
    account,
    networkName,
    web3ReactContext,
    deactivate,
  } = useWeb3Connect()
  const balanceAnj = useJurorRegistryAnjBalance()
  const balanceAnt = useTokenBalance('ANT')
  const antDecimals = useTokenDecimals('ANT')
  const anjDecimals = useTokenDecimals('ANJ')
  const antToUsd = useTokenBalanceToUsd('ANT', antDecimals, balanceAnt)

  const containerRef = useRef()

  return (
    <Container ref={containerRef}>
      <OverlayTrigger
        trigger="click"
        rootClose
        placement="bottom"
        overlay={
          <StyledPopover>
            <section>
              <div className="header">
                <button onClick={deactivate}>Deactivate account</button>
                <h1>Connected to {networkName}</h1>
              </div>
              <Row>
                <Token symbol="ANT" />
                <div>
                  <p>{formatUnits(balanceAnt, { digits: antDecimals })}</p>
                  <h3>${antToUsd}</h3>
                </div>
              </Row>
              <Row>
                <Token symbol="ANJ" />
                <div>
                  <p>
                    {formatUnits(balanceAnj, { digits: anjDecimals }) || '0'}
                  </p>
                  <h3 />
                </div>
              </Row>
            </section>
          </StyledPopover>
        }
      >
        <ButtonBase>
          <div
            css={`
              position: relative;
            `}
          >
            <EthIdenticon address={account} scale={1} radius={1} />
          </div>
          <Address>{shortenAddress(account)}</Address>
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            color="#8fa4b5"
          >
            <path
              fill="currentColor"
              d="M18.785 8.782a.725.725 0 00-1.038 0L12 14.632l-5.746-5.85a.725.725 0 00-1.039 0 .757.757 0 000 1.057l6.266 6.38a.726.726 0 001.038 0l6.266-6.38a.757.757 0 000-1.057z"
            />
          </svg>
        </ButtonBase>
      </OverlayTrigger>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  height: 40px;
`
const StyledPopover = styled(Popover)`
  overflow: hidden;
  background: #fff;
  box-shadow: 0px 7px 24px rgba(0, 0, 0, 0.25);
  border: 0 solid transparent;
  width: 450px;
  max-width: 90vw;

  &.bs-popover-bottom .arrow::after {
    border-bottom-color: #f9fafc;
  }
  &.bs-popover-bottom .arrow::before {
    border-bottom-color: transparent;
  }

  div.header {
    background: #f9fafc;
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    h1 {
      line-height: 32px;
      padding: 0;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      text-align: right;
      color: #7fdfa6;
      margin: 0;
    }
    button {
      background: transparent;
      border: 0;
      cursor: pointer;
      color: #637381;
    }
    button:hover {
      color: #212b36;
    }
  }
  span {
    top: 0px;
  }
`
const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 15px 15px 0;
  border-top: 1px solid #dde6ed;
  div {
    text-align: right;
  }
  p {
    font-size: 18px;
    color: #1c1c1c;
    margin: 0;
  }
  h3 {
    margin: 0;
    font-size: 12px;
    color: #8a95a0;
  }
`

const Address = styled.div`
  font-size: 18px;
  line-height: 31px;
  color: #1c1c1c;
  padding-left: 8px;
  padding-right: 4px;
  font-family: 'FontMono', monospace;
`
const ButtonBase = styled.div`
  display: flex;
  align-items: center;
  text-align: left;
  padding: 0 8px 0 16px;
  background: #ffffff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  cursor: pointer;
`

export default AccountModule
