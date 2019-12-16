import React from 'react'
import styled from 'styled-components'

const Token = ({ symbol, badge }) => (
  <TokenSection className={badge ? 'badge' : undefined}>
    <h2>
      <img src={require(`./assets/${symbol.toLowerCase()}.svg`)} />
      {symbol}
    </h2>
  </TokenSection>
)

const TokenSection = styled.div`
  padding: 8px 8px 1px 8px;
  position: relative;
  &.badge {
    margin: 0 15px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
    border-radius: 100px;
  }
  img {
    padding: 0 6px 0 2px;
    position: relative;
    top: -3px;
  }
  h2 {
    font-family: 'FontRegular', sans-serif;
    font-size: 22px;
    line-height: 1;
    color: #8a96a0;
    margin: 0;
  }
`

export default Token
