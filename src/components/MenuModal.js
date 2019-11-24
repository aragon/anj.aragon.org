import React, { useState } from 'react'
import styled from 'styled-components'
import Modal from 'react-bootstrap/Modal'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-static'

const MenuModal = () => {
  const [modalShow, setModal] = useState(false)

  return (
    <ButtonToolbar>
      <Button
        className={
          modalShow == true
            ? 'hamburger hamburger-spin is-active'
            : 'hamburger hamburger-spin'
        }
        type="button"
        onClick={() => setModal(!modalShow)}
      >
        <span className="hamburger-box">
          <span className="hamburger-inner" />
        </span>
      </Button>
      <StyledModal size="lg" aria-labelledby="title" show={modalShow}>
        <LinksBox>
          <div className="links">
            <ul>
              <li>
                <a href={'./#get-anj'} onClick={() => setModal(false)}>
                  Get ANJ
                </a>
              </li>
              <li>
                <a href={'./#about'} onClick={() => setModal(false)}>
                  About
                </a>
              </li>

              <li>
                <a href={'./#support'} onClick={() => setModal(false)}>
                  Support
                </a>
              </li>
            </ul>
          </div>
        </LinksBox>
      </StyledModal>
    </ButtonToolbar>
  )
}

const LinksBox = styled.div`
  width: 100%;
  .links {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30px 0;
    background-size: 126% 124%;
    position: relative;
  }
  a {
    color: white !important;
    text-decoration: none !important;
  }
`

const StyledModal = styled(Modal)`
  background: #1c1c1c;
  transition: all 0.25s linear;
  .modal-dialog {
    max-width: 80%;
    width: 1000px;
    min-width: 50%;
    margin: 100px auto;
  }
  .modal-content {
    background: #1c1c1c;
    display: flex;
    flex-direction: row;
    align-items: stretch;

    ul {
      list-style-type: none;
      padding: 60px 0;
    }
    li {
      font-family: 'FontBold';
      font-size: 2.92rem;
      line-height: 4.42rem;
    }
  }
`

export default MenuModal
