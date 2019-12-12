import React from 'react'
import styled from 'styled-components'
import successImg from './assets/success.svg'

const SuccessSection = ({ amount }) => (
  <Success>
    <div>
      <img src={successImg} />
      <p className="green">The transaction has been successful</p>
      <p>
        Welcome juror. You have successfully activated the total amount of{' '}
        {amount} ANJ
      </p>
      <Button>Continue</Button>
    </div>
  </Success>
)

const Success = styled.div`
  min-width: 1109px;
  height: 530px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  text-align: center;
  img {
    margin-bottom: 15px;
  }
  p {
    max-width: 410px;
    margin: 0;
  }
  p.green {
    color: #7fdfa6;
  }
`

const Button = styled.button`
  background: #ffffff;
  border: 1px solid #c7d1da;
  box-sizing: border-box;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.05);
  margin-top: 30px;
  border-radius: 4px;
  width: 227px;
  height: 52px;
  text-align: center;
  font-size: 20px;
  line-height: 31px;
  text-align: center;
  color: #1c1c1c;
  cursor: pointer;
  &:hover {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  }
`

export default SuccessSection
