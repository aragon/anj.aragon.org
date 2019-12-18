import React from 'react'
import styled from 'styled-components'
import Token from './Token'
import AccountModule from './AccountModule'
import { breakpoint } from '../../microsite-logic'

const large = css => breakpoint('large', css)
const medium = css => breakpoint('medium', css)

const HeaderSection = () => (
  <Header>
    <h1>
      Convert <Token symbol="ANT" badge /> to <Token symbol="ANJ" badge />
    </h1>
    <AccountModule />
  </Header>
)

const Header = styled.div`
  display: flex;
  align-items: center;
  height: 160px;
  padding: 15px 20px;
  border-bottom: solid 1px #ededed;
  ${medium(
    'display: flex; align-items: center; justify-content: space-between; height: 100px;'
  )};
  ${large('padding: 35px; height: 100px;')};

  h1 {
    display: flex;
    align-items: center;
    font-family: 'FontMedium', sans-serif;
    font-size: 38px;
    line-height: 1.1;
    color: #1c1c1c;
    margin: 0;
    flex-wrap: wrap;
    max-width: 84%;
  }
`

export default HeaderSection
