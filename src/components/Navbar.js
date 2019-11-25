import React from 'react'
import styled from 'styled-components'
import { breakpoint } from '../microsite-logic'
import logo from './assets/logo.svg'
import MenuModal from './MenuModal'

const medium = css => breakpoint('medium', css)

class Navbar extends React.Component {
  render() {
    return (
      <Container>
        <CourtNavbar>
          <Left>
            <LogoLink to="/">
              <img src={logo} />
            </LogoLink>
            <LinksBox>
              <a href="./#get-anj">Get ANJ</a>
              <a href="./#about">About</a>
              <a href="./#support">Support</a>
            </LinksBox>
          </Left>
          <Button href="./#get-anj">
            <span>Become a Juror</span>
          </Button>
          <MenuModalBox>
            <MenuModal />
          </MenuModalBox>
        </CourtNavbar>
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
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
`

const CourtNavbar = styled.div`
  width: 80%;
  height: 65px;
  background: transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 3000;
`
const MenuModalBox = styled.div`
  display: block;
  ${medium('display: none;')};
`
const Button = styled.a`
  display: none;
  background: #262626;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  font-family: 'FontMedium';
  padding: 7px 16px 4px 16px;
  line-height: 1;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  ${medium('display: flex; justify-content: center;')};
  &:hover {
    background: #323232;
  }
  @keyframes shine {
    to {
      background-position: 200% center;
    }
  }
  span {
    color: #ff9a84;
  }
  span:hover {
    background: linear-gradient(
      to right,
      #ff7c7c 20%,
      #ffc58f 40%,
      #ffc58f 60%,
      #ff7c7c 80%
    );
    background-size: 200% auto;
    background-clip: text;
    text-fill-color: transparent;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    animation: shine 4s linear infinite;
  }
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

export default Navbar
