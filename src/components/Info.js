import React from 'react'
import styled from 'styled-components'
import { breakpoint } from '../microsite-logic'
import infoBackground from './assets/info-background.svg'
import anj from './assets/anj-logo.png'

const large = css => breakpoint('large', css)
const medium = css => breakpoint('medium', css)

const Info = () => (
  <InfoSection>
    <InfoWrapper>
      <TextContainer>
        <TitleWrapper>
          <Img src={anj} alt="" />
          <h2 className="pink header">
            Pre-activation ends when Aragon Court Launches on Feb 10th
          </h2>
        </TitleWrapper>
        <br />
        <h2 className="content">
          On February 10th, when Aragon Court's first term begins, jurors will
          be able to deactivate and unstake ANJ using the jurors dashboard. In
          the meantime, you can check your active balance by connecting your
          wallet to the{' '}
          <a className="pink" href="#get-anj">
            conversion module.
          </a>
        </h2>
        <br />
        <h2 className="content">
          When the pre-activation phase ends, ANJ will be available at a
          variable rate. Price discovery will be automated by a bonding curve
          and it will vary based on supply and demand.
        </h2>
      </TextContainer>
    </InfoWrapper>
  </InfoSection>
)

const InfoSection = styled.section`
  background: linear-gradient(210.76deg, #fffaf1 -3.6%, #ffebeb 216.17%);
`

const TitleWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
`
const TextContainer = styled.div`
  width: 80%;
  margin: auto;
  grid-column-start: 2;
  h2 {
    font-size: 24px;
    line-height: 1.58;
  }
  .content {
    color: #8a96a0;
  }

  .header {
    font-weight: bold;
    text-transform: uppercase;
    line-height: 1;
    margin: 0;
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
    display: block;
    ${medium('display: inline;')};
  }
`

const Img = styled.img`
  width: 50px;
  height: 50px;
  margin: auto;
  margin-right: 8px;
`

const InfoWrapper = styled.div`
  position: relative;
  z-index: 2;
  padding-top: 32px;
  padding-bottom: 32px;
  overflow: hidden;
  min-height: 600px;
  ${large(`
  background-image: url(${infoBackground});
  background-repeat: no-repeat;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
  `)}
`

export default Info
