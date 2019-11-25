import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-static'
import { breakpoint } from '../microsite-logic'
import background from './assets/subscribe-background.svg'
import feature1 from './assets/features1.svg'
import feature2 from './assets/features2.svg'
import feature3 from './assets/features3.svg'
const medium = css => breakpoint('medium', css)

const Features = () => (
  <FeaturesSection>
    <Container>
      <div>
        <img src={feature1} />
        <h3>Earn income online</h3>
        <p>
          Want to earn an online income? Jurors can earn rewards from anywhere
          with an internet connection.
        </p>
      </div>
      <div>
        <img src={feature2} />
        <h3>Flexible scheduling</h3>
        <p>
          Have lots of free time? Busy schedule? Serve on as many or few juries
          as your time allows.
        </p>
      </div>
      <div>
        <img src={feature3} />
        <h3>Meaningful work</h3>
        <p>
          Like helping others? Save people the hassle of going to court in real
          life by resolving their disputes over the internet.
        </p>
      </div>
    </Container>
  </FeaturesSection>
)

const FeaturesSection = styled.section`
  background: white;
  padding: 95px 0 85px 0;
`
const Container = styled.div`
  width: 80%;
  margin: auto;
  text-align: center;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  div {
    padding: 15px;
    text-align: left;
  }
  img {
  }
  p {
    font-weight: normal;
    text-align: left;
    margin: 0;
    font-family: 'FontRegular';
    font-size: 20px;
    line-height: 31px;
    color: #8a96a0;
    max-width: 355px;
  }
  h3 {
    text-align: left;
    font-family: 'FontRegular', sans-serif;
    font-weight: 400;
    font-size: 27px;
    line-height: 38px;
    color: #000;
    margin: 25px 0 7px 0;
  }
  ${medium('flex-direction: row;')};
`

export default Features
