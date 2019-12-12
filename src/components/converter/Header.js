import React from 'react'
import styled from 'styled-components'
import Token from './Token'

const HeaderSection = () => (
  <Header>
    <h1>
      Convert <Token title="ant" badge /> to <Token title="anj" badge />
    </h1>
  </Header>
)

const Header = styled.div`
  border-bottom: solid 1px #ededed;
  height: 100px;
  padding: 35px;
  h1 {
    font-family: 'FontMedium', sans-serif;
    font-size: 38px;
    line-height: 1.1;
    display: flex;
    align-items: flex-start;
    color: #1c1c1c;
    margin: 0;
  }
`

export default HeaderSection
