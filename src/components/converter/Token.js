import React from 'react'
import styled from 'styled-components'

const TokenSection = ({ title, badge }) => (
  <Token className={badge ? 'badge' : undefined}>
    <h2>
      <img src={require(`./assets/${title}.svg`)} />
      {title}
    </h2>
  </Token>
)

const Token = styled.div`
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
    text-transform: uppercase;
    margin: 0;
  }
`

export default TokenSection
