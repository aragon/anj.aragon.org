import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  Overlay,
  OverlayTrigger,
  Popover,
  ButtonToolbar,
} from 'react-bootstrap'
import { shortenAddress } from './converter-logic'
import { useAccount } from './converter-logic'
import Token from './Token'
import EthIdenticon from './EthIdenticon'

function getNetworkName(networkId) {
  if (networkId === 'main') return 'Mainnet'
  if (networkId === 'rinkeby') return 'Rinkeby'
  return networkId
}

function AccountModule({ compact }) {
  const { connected } = useAccount()
  return connected ? <ConnectedMode /> : ''
}

AccountModule.propTypes = {
  compact: PropTypes.bool,
}

function ConnectedMode() {
  const { address, label, networkId } = useAccount()
  const containerRef = useRef()
  const networkName = getNetworkName(networkId)

  return (
    <Container ref={containerRef}>
      <OverlayTrigger
        trigger="click"
        rootClose
        placement="bottom"
        overlay={
          <StyledPopover>
            <section>
              <h1>Connected to {networkName}</h1>
              <Row>
                <Token title="ant" />
                <div>
                  <p>3.595,14</p>
                  <h3>$1.200</h3>
                </div>
              </Row>
              <Row>
                <Token title="anj" />
                <div>
                  <p>3.595,14</p>
                  <h3>$1.200</h3>
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
            <EthIdenticon address={address} scale={1} radius={1} />
          </div>
          <Address>{shortenAddress(address)}</Address>
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
  background: #ffffff;
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
  h1 {
    background: #f9fafc;
    line-height: 32px;
    padding: 10px 15px;
    font-size: 13px;
    font-weight: 600;
    text-transform: 'uppercase';
    text-align: right;
    color: #7fdfa6;
    margin: 0;
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
`

export default AccountModule
