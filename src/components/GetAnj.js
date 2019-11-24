import React from 'react'
import styled from 'styled-components'
import content from './assets/convert-module.png'
import comingSoon from './assets/coming-soon.svg'

import { breakpoint } from '../microsite-logic'
const medium = css => breakpoint('medium', css)
const large = css => breakpoint('large', css)

const GetAnj = () => (
  <GetAnjSection id="get-anj">
    <Content src={content} />
    <a href="https://blog.aragon.org/announcing-aragon-ui-1-0/" target="_blank">
      <img src={comingSoon} />
    </a>
  </GetAnjSection>
)

const GetAnjSection = styled.section`
  background: linear-gradient(
    to top,
    #fff 0%,
    #fff 80%,
    #1c1c1c 80%,
    #1c1c1c 100%
  ) !important;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  a {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 43vw;
    ${medium('width: 24vw;')};
  }
  a img {
    width: 100%;
  }
`
const Content = styled.img`
  margin: 0 auto;
  max-width: 90%;
  ${medium('max-width: 80%;')};
`

export default GetAnj
