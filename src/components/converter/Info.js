import React from 'react'
import styled from 'styled-components'

const InfoSection = () => (
  <Info>
    <h6 className="title">Please read</h6>
    <div>
      <h6>- Minimum 10,000 ANJ is required to become a juror</h6>
      <h6>- The pre-activation period ends in early February </h6>
      <h6>- 1 ANT = 100 ANJ during pre-activation period only</h6>
      <h6>- ANT will be converted to ANJ</h6>
      <h6>
        - ANJ will automatically be activated, you can change this later if you
        choose
      </h6>
    </div>
  </Info>
)

const Info = styled.div`
  padding: 30px 0;
  h6.title {
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 23px;
    background: linear-gradient(to right, #ff7c7c 0%, #ffc58f 100%);
    background-clip: text;
    text-fill-color: transparent;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  h6 {
    font-weight: 400;
    font-size: 18px;
    line-height: 23px;
    color: #8a96a0;
    margin: 0;
  }
`

export default InfoSection
