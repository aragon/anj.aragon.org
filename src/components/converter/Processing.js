import React from 'react'
import styled from 'styled-components'
import processing from './assets/loader'

function Processing({ signing }) {
  return (
    <ProcessingIn>
      <div>
        <img src={processing} />
        {signing ? (
          <>
            <p className="black">Please sign the transaction</p>
            <p>Sign the transaction in your provider so it can get processed.</p>
          </>
        ) : (
          <>
            <p className="black">Processing your transaction</p>
            <p>Your transaction is being processed, please be patient.</p>
          </>
        )}
      </div>
    </ProcessingIn>
  )
}

const ProcessingIn = styled.div`
  min-width: 1109px;
  height: 530px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  text-align: center;
  img {
    margin-bottom: 15px;
    height: 100px;
  }
  p {
    max-width: 410px;
    margin: 0;
  }
  p.black {
    color: #000;
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

export default Processing
