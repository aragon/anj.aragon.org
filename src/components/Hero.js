import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-static'
import background from './assets/hero-background.svg'

const Hero = () => (
  <HeroSection>
    <TextContainer>
      <h1>Become a Juror</h1>
      <div className="h1-animated-box">
        <h1>
          for <span className="pink">Aragon Court</span>
        </h1>
      </div>
      <h2>
        Aragon Court handles subjective disputes that require the judgement of
        human jurors. These jurors stake a token called ANJ which allows them to
        be drafted into juries and earn fees for successfully adjudicating
        disputes.
      </h2>
    </TextContainer>
  </HeroSection>
)

const HeroSection = styled.section`
  position: relative;
  z-index: 1;
  background: #1c1c1c;
  padding-top: 64px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  overflow: hidden;
  padding-bottom: 0px;
  min-height: 550px;
  background-image: url(${background});
  background-position: 100% center;
  background-repeat: no-repeat;
`

const TextContainer = styled.div`
  width: 80%;
  margin: auto;
  h1 {
    font-family: 'FontBold';
    font-weight: bold;
    font-size: 86px;
    line-height: 1;
    margin: 0;
    text-align: left;
    letter-spacing: -0.447059px;
    color: #ffffff;
  }
  .h1-animted-box {
    display: flex;
    justify-content: flex-start;
  }
  @keyframes shine {
    to {
      background-position: 200% center;
    }
  }
  .pink {
    color: rgba(1, 191, 227);
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
  h2 {
    font-family: 'FontRegular';
    font-weight: 500;
    font-size: 24px;
    line-height: 1.58;
    display: flex;
    align-items: left;
    color: white;
    max-width: 750px;
  }
`
export default Hero
