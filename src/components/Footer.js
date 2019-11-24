import React from 'react'
import styled from 'styled-components'
import { breakpoint } from '../microsite-logic'
import logo from './assets/logo.svg'

const medium = css => breakpoint('medium', css)

class Footer extends React.Component {
  render() {
    return (
      <Container>
        <CourtFooter>
          <Left>
            <LogoLink href="/">
              <img src={logo} />
            </LogoLink>
          </Left>
          <LinksBox>
            <a href="./#get-anj">Get ANJ</a>
            <a href="./#about">About</a>
            <a href="./#support">Support</a>
            <a href="https://aragon.org/network/" target="_blank">
              Network
            </a>
          </LinksBox>
        </CourtFooter>
      </Container>
    )
  }
}

const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`
const LinksBox = styled.div`
  display: none;
  ${medium('display: block;')};
  a {
    font-family: 'FontMedium';
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    color: #ffffff;
    padding: 15px;
  }
`
const Container = styled.div`
  width: 100%;
  height: 65px;
  background: #1c1c1c;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
`

const CourtFooter = styled.div`
  width: 80%;
  height: 65px;
  background: transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 3000;
`
const LogoLink = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  height: 100%;
  padding-right: 15px;
  img {
    height: 50px;
  }
`

export default Footer
