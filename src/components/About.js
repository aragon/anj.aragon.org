import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-static'
import background from './assets/about-background.svg'
import Entry from './Entry'
import { breakpoint } from '@aragon/ui'
const medium = css => breakpoint('medium', css)

const About = () => (
  <AboutSection id="about">
    <Container>
      <RoadmapContainer>
        <Entry entrypoint>
          <Title>Key dates & Term 0</Title>
          <Subtitle>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore.
          </Subtitle>
        </Entry>
        <Entry entrypoint>
          <Title>Draw as a juror</Title>
          <Subtitle>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore.
          </Subtitle>
        </Entry>
        <Entry entrypoint>
          <Title>Dispute</Title>
          <Subtitle>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore.
          </Subtitle>
        </Entry>
        <Entry lastpoint />
      </RoadmapContainer>
    </Container>
  </AboutSection>
)

const AboutSection = styled.section`
  padding: 207px 15px 207px 15px;
  background: #f9fafc;
  background-image: url(${background});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  min-height: 700px;
`
const Container = styled.div`
  text-align: center;
  margin: auto;
  width: 525px;
`

const RoadmapContainer = styled.div`
  margin-top: 50px;
  width: 100%;
  max-width: 870px;
  padding: 0;
  position: relative;
  margin: auto;
  ${medium('padding: 5px 50px;')};

  &:before {
    content: '';
    position: absolute;
    top: 12px;
    left: 9px;
    bottom: 20px;
    width: 2px;
    background: #ff9780;
    ${medium('left: 21.5px;')};
  }
  &:after {
    content: '';
    display: table;
    clear: both;
  }
`

const Title = styled.h1`
  margin: 0;
  margin-bottom: 10px;
  font-family: 'FontMedium';
  font-weight: 500;
  font-size: 37px;
  line-height: 38px;
  display: flex;
  align-items: center;
  color: #1c1c1c;
  padding-left: 40px;
`

const Subtitle = styled.h6`
  max-width: 350px;
  padding-left: 40px;
  font-family: 'FontRegular';
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 31px;
  color: #8a96a0;
  margin: 0 0 100px 0;
`

export default About
