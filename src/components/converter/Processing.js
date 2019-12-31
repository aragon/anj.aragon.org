import React from 'react'
import styled from 'styled-components'
import processing from './assets/loader'

function Processing({ signing }) {
  return (
    <ProcessingIn>
      <div>
        <img src={processing} alt="" />
        {signing ? (
          <>
            <p className="black">Please sign the transaction</p>
            <p>
              Sign the transaction in your provider so it can get processed.
            </p>
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

export default Processing
