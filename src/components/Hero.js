import React from "react";
import styled from "styled-components";
import { Link } from "react-static";

const Hero = () => (
  <HeroSection>
    <TextContainer>
      <h1>Become a Juror</h1>
      <div className="h1-animated-box">
         <h1>for <span className="pink">Aragon Court</span></h1>
      </div>
      <h2>
        Aragon Court handles subjective disputes that require the judgement of
        human jurors. These jurors stake a token called ANJ which allows them to
        be drafted into juries and earn fees for successfully adjudicating
        disputes.
      </h2>
    </TextContainer>
  </HeroSection>
);

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
  min-height: 500px;
`;

const TextContainer = styled.div`
  width: 80%;
  margin: auto;
  h1 {
    font-family: "FontBold";
    font-weight: bold;
    font-size: 86px;
    line-height: 1;
    margin: 0;
    text-align: left;
    letter-spacing: -0.447059px;
    color: #FFFFFF;
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
      #FF7C7C 20%,
      #FFC58F 40%,
      #FFC58F 60%,
      #FF7C7C 80%
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
`;
export default Hero;
