import React from 'react'
import styled from 'styled-components/macro'
import { breakpoint } from 'lib/microsite-logic'

import infoBackground from './assets/info-background.svg'
import anj from './assets/anj-logo.svg'

const large = css => breakpoint('large', css)
const medium = css => breakpoint('medium', css)

function Info() {
  return (
    <InfoSection>
      <InfoWrapper>
        <TextContainer>
          <TitleWrapper>
            <Img src={anj} alt="" />
            <h2 className="pink header">Aragon Court has launched</h2>
          </TitleWrapper>
          <br />
          <p className="content">
            As a juror, you can now access your ANJ by using the{' '}
            <a className="pink" href="https://court.aragon.org/">
              court dashboard.
            </a>{' '}
            You can still check your active balance by connecting your wallet to
            the conversion module.
          </p>
          <br />
          <p className="content">
            ANJ is now available at a variable rate, based on supply and demand.
            Price discovery is automated by a{' '}
            <a
              className="pink"
              href="https://help.aragon.org/article/44-how-to-get-anj-and-become-an-aragon-court-juror#bonding-curve"
            >
              bonding curve
            </a>
            .
          </p>
          <br />
          <p className="content">
            You can visit the{' '}
            <a
              className="pink"
              href="https://help.aragon.org/article/48-aragon-court-faq"
            >
              Aragon Court FAQ
            </a>{' '}
            for more information on frequent questions and answers on all Court
            related topics.
          </p>
        </TextContainer>
      </InfoWrapper>
    </InfoSection>
  )
}

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

  p {
    font-size: 24px;
    line-height: 1.58;
    color: #8a96a0;
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
  a {
    display: inline;
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
    ${medium('display: inline;')};
  }
`

const Img = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 8px;
`

const InfoWrapper = styled.div`
  position: relative;
  z-index: 2;
  padding-top: 50px;
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
