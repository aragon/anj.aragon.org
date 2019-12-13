import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  EthIdenticon,
  Popover,
  IconDown,
  IconConnect,
  textStyle,
  useTheme,
  IdentityBadge,
} from '@aragon/ui'
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
  const theme = useTheme()
  const containerRef = useRef()
  const networkName = getNetworkName(networkId)

  return (
    <Container ref={containerRef}>
      <ButtonBase>
        <div
          css={`
            position: relative;
          `}
        >
          <EthIdenticon address={address} radius={4} />
          <div
            css={`
              position: absolute;
              bottom: -3px;
              right: -3px;
              width: 10px;
              height: 10px;
              background: ${theme.positive};
              border: 2px solid ${theme.surface};
              border-radius: 50%;
            `}
          />
        </div>
        <div
          css={`
            padding-left: ${1 * 8}px;
            padding-right: ${0.5 * 8}px;
          `}
        >
          <div
            css={`
              margin-bottom: -5px;
              ${textStyle('body2')};
            `}
          >
            <div>{shortenAddress(address)}</div>
          </div>
          <div
            css={`
              font-size: 11px;
              color: ${theme.surfaceContentSecondary};
            `}
          >
            Connected {networkName ? `to ${networkName}` : ''}
          </div>
        </div>
        {null && (
          <IconDown
            size="small"
            css={`
              color: ${theme.surfaceIcon};
            `}
          />
        )}
      </ButtonBase>
      <Popover
        closeOnOpenerFocus
        placement="bottom-end"
        onClose={close}
        visible={false}
        opener={containerRef.current}
      >
        <section>
          <h1
            css={`
              display: flex;
              align-items: center;
              height: ${4 * 8}px;
              padding: 0 ${2 * 8}px;
              ${textStyle('label2')};
              color: ${theme.surfaceContentSecondary};
              border-bottom: 1px solid ${theme.border};
            `}
          >
            Ethereum connection
          </h1>
          <div
            css={`
              padding: ${3 * 8}px ${2 * 8}px;
            `}
          >
            <IdentityBadge entity={address} compact />
          </div>
        </section>
      </Popover>
    </Container>
  )
}

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
