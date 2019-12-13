import React from 'react'
import styled from 'styled-components'
import Token from './Token'
import AccountModule from './AccountModule'
import { breakpoint } from '../../microsite-logic'

const large = css => breakpoint('large', css)

const HeaderSection = () => (
  <Header>
    <h1>
      Convert <Token title="ant" badge /> to <Token title="anj" badge />
    </h1>
    <AccountModule />
  </Header>
)

const Header = styled.div`
  border-bottom: solid 1px #ededed;
  height: 100px;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${large('padding: 35px;')};

  h1 {
    font-family: 'FontMedium', sans-serif;
    font-size: 38px;
    line-height: 1.1;
    display: flex;
    align-items: flex-start;
    color: #1c1c1c;
    margin: 0;
    flex-wrap: wrap;
    max-width: 84%;
  }
`

export default HeaderSection
