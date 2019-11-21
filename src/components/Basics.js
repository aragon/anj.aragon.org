import React, { useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-static'
import { breakpoint } from '@aragon/ui'
import background from './assets/subscribe-background.svg'
import basics1 from './assets/basics1.svg'
import basics2 from './assets/basics2.svg'
import basics3 from './assets/basics3.svg'
import basics4 from './assets/basics4.svg'
import basics5 from './assets/basics5.svg'
import basics6 from './assets/basics6.svg'
const medium = css => breakpoint('medium', css)

const Basics = () => {
  const [active, setActive] = useState('1')
  return (
    <BasicsSection>
      <Container>
        <h3>The basics of being a juror</h3>
        <p>Learn the basic action stages for jurors in Aragon Court</p>
      </Container>
      <Process>
        <div>
          <Buttons>
            <div
              className={active == '1' ? 'active' : ''}
              onClick={() => setActive('1')}
            >
              1- DISPUTE IS RAISED
            </div>
            <div
              className={active == '2' ? 'active' : ''}
              onClick={() => setActive('2')}
            >
              2- JURORS ARE SELECTED
            </div>
            <div
              className={active == '3' ? 'active' : ''}
              onClick={() => setActive('3')}
            >
              3- JURORS REVIEW EVIDENCE
            </div>
            <div
              className={active == '4' ? 'active' : ''}
              onClick={() => setActive('4')}
            >
              4- RULING (COMMIT / REVEAL)
            </div>
            <div
              className={active == '5' ? 'active' : ''}
              onClick={() => setActive('5')}
            >
              5- DISPUTE IS SETTLED
            </div>
            <div
              className={active == '6' ? 'active' : ''}
              onClick={() => setActive('6')}
            >
              6- EARN REWARDS
            </div>
          </Buttons>
          <Text>
            <p className={active == '1' ? 'active' : ''} src={basics1}>
              A company has two members, Bob and Alice. Bob submits a proposal
              to transfer company funds into his personal wallet. Alice
              disagrees and raises a dispute against the proposal in Aragon
              Court.
            </p>
            <p className={active == '2' ? 'active' : ''}>
              You and two other jurors are drafted to adjudicate Bob and Alice’s
              dispute, where the chance of being drafted is proportional to the
              amount of ANJ you have activated.
            </p>
            <p className={active == '3' ? 'active' : ''}>
              Bob claims the fund transfer is his yearly bonus, citing his good
              performance. Alice submits their employment agreement and
              historical payroll records that show Bob's bonus isn't due until
              next month.
            </p>
            <p className={active == '4' ? 'active' : ''}>
              You and one other juror decide to vote in favor of Alice and one
              votes in favor of Bob. This means Alice has the majority required
              to win this ruling. All rulings at this stage are preliminary and
              can be appealed by the loser for additional fees.
            </p>
            <p className={active == '5' ? 'active' : ''}>
              Bob decides not to appeal the preliminary ruling making the final
              ruling in favor of Alice. Now all the adjudication rounds in the
              dispute can be settled and rewards allocated.
            </p>
            <p className={active == '6' ? 'active' : ''}>
              Since one of the jurors did not vote in favor of Alice - who won
              the final ruling - their activated ANJ will be distributed to you
              and the other juror who voted for Alice as a reward. This reward
              is in addition to the rewards earned from Subscription and Dispute
              Fees, all of which will automatically be added to your staked and
              activated ANJ balance.
            </p>
          </Text>
        </div>
        <Images>
          <img className={active == '1' ? 'active' : ''} src={basics1} />
          <img className={active == '2' ? 'active' : ''} src={basics2} />
          <img className={active == '3' ? 'active' : ''} src={basics3} />
          <img className={active == '4' ? 'active' : ''} src={basics4} />
          <img className={active == '5' ? 'active' : ''} src={basics5} />
          <img className={active == '6' ? 'active' : ''} src={basics6} />
        </Images>
      </Process>
    </BasicsSection>
  )
}

const BasicsSection = styled.section`
  background: white;
  padding: 80px;
`
const Container = styled.div`
  width: 80%;
  margin: auto;
  text-align: center;

  p {
    font-family: 'FontRegular';
    font-size: 24px;
    line-height: 34px;
    text-align: center;
    color: #8a96a0;
    margin: 0 0 50px 0;
  }
  h3 {
    font-family: 'FontMedium', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 37px;
    line-height: 1;
    text-align: center;
    color: #1c1c1c;
    margin: 0 0 10px 0;
  }
`
const Images = styled.div`
  position: relative;
  height: auto;
  width: calc(100% - 300px);
  margin: 0 auto;

  img {
    position: absolute;
    right: 0;
    opacity: 0;
    transition: opacity 0.25s ease-in-out;
  }

  img.active {
    opacity: 1;
  }
`
const Text = styled.div`
  p {
    font-family: 'FontRegular', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    line-height: 27px;
    max-width: 315px;
    padding: 30px 0 0 15px;
    color: #1c1c1c;
    opacity: 0;
    transition: opacity 0.25s ease-in-out;
    display: none;
  }
  p.active {
    opacity: 1;
    display: block;
  }
`

const Process = styled.div`
  width: 80%;
  margin: auto;
  display: flex;
  justify-content: space-between;
`

const Buttons = styled.div`
  width: 300px;
  padding: 15px 0;
  div {
    font-family: 'FontRegular', sans-serif;
    line-height: 2;
    font-size: 20px;
    color: #8a96a0;
    cursor: pointer;
    padding: 4px 15px 0 15px;
    margin: 15px 0;
    transition: all 0.25s ease-in-out;
    border-radius: 6px;
    position: relative;
    z-index: 1;
    background: linear-gradient(to bottom, white, white);
  }
  div.active {
    color: white;
  }
  div::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(193.3deg, #ffb36d 6.08%, #ff8888 93.18%);
    opacity: 0;
    border-radius: 6px;
    transition: opacity 0.25s;
    z-index: -1;
  }
  div.active::before {
    opacity: 1;
  }
`

export default Basics
