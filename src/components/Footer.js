import React from 'react'
import styled from 'styled-components'
import { Link } from './Router'
import { breakpoint } from '@aragon/ui'
import logo from './assets/logo.svg'

const medium = css => breakpoint('medium', css)

class Footer extends React.Component {
  render() {
    return (
      <Container>
        <CourtFooter>
          <Left>
            <LogoLink to="/">
              <img src={logo} />
            </LogoLink>
          </Left>
          <LinksBox>
            <Link to={'/'}>Get ANJ</Link>
            <Link to={'/#about'}>About</Link>
            <Link to={'/'}>Support</Link>
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
