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
          <Popover>
            <section>
              <h1
                css={`
                  display: flex;
                  align-items: center;
                  height: 32px;
                  padding: 0 16px;
                  font-size: 12;
                  font-weight: 600;
                  line-height: 1.5;
                  text-transform: 'uppercase';
                  color: #637381;
                  border-bottom: 1px solid #dde4e9;
                `}
              >
                Ethereum connection
              </h1>
              <div
                css={`
                  padding: 24px 16px;
                `}
              >
                {address}
              </div>
            </section>
          </Popover>
        }
      >
        <ButtonBase>
          <div
            css={`
              position: relative;
            `}
          >
            Identic
            <div
              css={`
                position: absolute;
                bottom: -3px;
                right: -3px;
                width: 10px;
                height: 10px;
                background: #2cc68f;
                border: 2px solid #fff;
                border-radius: 50%;
              `}
            />
          </div>
          <div
            css={`
              padding-left: 8px;
              padding-right: 4px;
            `}
          >
            <div
              css={`
                margin-bottom: -5px;
                font-size: 16px;
                font-weight: 400;
                line-height: 1.5;
              `}
            >
              <div>{shortenAddress(address)}</div>
            </div>
            <div
              css={`
                font-size: 11px;
                color: #637381;
              `}
            >
              Connected {networkName ? `to ${networkName}` : ''}
            </div>
          </div>
          {null && (
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
          )}
        </ButtonBase>
      </OverlayTrigger>
    </Container>
  )
}
// <IdentityBadge entity={address} compact />
// <Popover
//   closeOnOpenerFocus
//   placement="bottom-end"
//   onClose={close}
//   visible={false}
//   opener={containerRef.current}
// />
const Container = styled.div`
  display: flex;
  height: 100%;
`
const ButtonBase = styled.div`
  display: flex;
  align-items: center;
  text-align: left;
  padding: 0 8px 0 16px;
`

export default AccountModule
