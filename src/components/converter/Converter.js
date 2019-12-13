import React from 'react'
import styled from 'styled-components'
import { breakpoint } from '../../microsite-logic'
import Header from './Header'
import ConverterContent from './ConverterContent'
import Success from './Processing'

const large = css => breakpoint('large', css)

const Converter = () => {
  const success = true
  return (
    <OuterSection>
      <ConverterSection>
        <Header />
        {success ? <Success amount={5600} /> : <ConverterContent />}
      </ConverterSection>
    </OuterSection>
  )
}

const ConverterSection = styled.div`
  background: #ffffff;
  box-shadow: 0px 5px 13px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  max-width: 1109px;
  min-height: 642px;
  max-width: 95%;
  p {
    font-family: 'FontRegular', sans-serif;
    font-size: 24px;
    line-height: 38px;
    color: #8a96a0;
  }
  ${large('max-width: 1109px;')};
`
const OuterSection = styled.section`
  background: linear-gradient(
    to top,
    #fff 0%,
    #fff 83.5%,
    #1c1c1c 83.5%,
    #1c1c1c 100%
  ) !important;
  height: auto;
  min-height: 670px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding-bottom: 30px;
`

export default Converter
