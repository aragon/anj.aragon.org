import React from 'react'
import styled from 'styled-components'
import content from './assets/convert-module.png'
import comingSoon from './assets/coming-soon.svg'
import contentMobile from './assets/convert-module-mobile.png'
import comingSoonMobile from './assets/coming-soon-mobile.svg'

import { breakpoint } from '../microsite-logic'
const medium = css => breakpoint('medium', css)
const large = css => breakpoint('large', css)

const GetAnj = () => (
  <GetAnjSection id="get-anj">
    <Content className="medium" src={content} />
    <Content className="mobile" src={contentMobile} />
    <a href="https://blog.aragon.org/announcing-aragon-ui-1-0/" target="_blank">
      <img className="medium" src={comingSoon} />
      <img className="mobile" src={comingSoonMobile} />
    </a>
  </GetAnjSection>
)

const GetAnjSection = styled.section`
  background: linear-gradient(
    to top,
    #fff 0%,
    #fff 83.5%,
    #1c1c1c 83.5%,
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
    width: 56vw;
    ${medium('width: 24vw;')};
  }
  a img {
    width: 100%;
  }
  .mobile {
    display: inline;
    ${medium('display: none;')};
  }
  .medium {
    display: none;
    ${medium('display: inline;')};
  }
`
const Content = styled.img`
  margin: 0 auto;
  max-width: 90%;
  ${medium('max-width: calc(80% + 30px);')};
`

export default GetAnj
