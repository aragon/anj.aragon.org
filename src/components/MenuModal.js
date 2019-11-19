import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from 'react-bootstrap/Modal';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-static';
import { useViewport } from '@aragon/ui'

const MenuModal = () => {
  const { breakpoints, width } = useViewport()
  const [modalShow, setModal] = useState(false);

  console.log(useViewport(), breakpoints);

  return (
      <ButtonToolbar>
        <Button
          className={modalShow == true ? "hamburger hamburger-spin is-active" : "hamburger hamburger-spin"}
          type="button"
          onClick={() => setModal(!modalShow)}
        >
          <span className="hamburger-box">
            <span className="hamburger-inner"></span>
          </span>
        </Button>
        <StyledModal
          size="lg"
          aria-labelledby="title"
          show={modalShow}
        >
          <LinksBox>
            <div className="links">
              <ul>
              <li>
                <a href={'/#team'} onClick={() => setModal(false)}>Get ANJ</a>
              </li>
                <li>
                  <a href={'/#about'} onClick={() => setModal(false)}>About</a>
                </li>

                <li>
                  <a href={'/#jobs'} onClick={() => setModal(false)}>Support</a>
                </li>
              </ul>
            </div>
          </LinksBox>
        </StyledModal>
      </ButtonToolbar>
    );
}

const MenuHeader = styled.div`
  width: 100%;
  height: 70px;
  border-bottom: solid 1px #3a3a3a;
  display: flex;
  justify-content: flex-end;
  div {
    width: 70px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-left: solid 1px #3a3a3a;
  }
`

// ${large('width: calc(100% - 400px);')};
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
    color: white!important;
    text-decoration: none!important;
  }
  h6 {
    position: absolute;
    right: 0;
    transform-origin: 0 50%;
    text-transform: uppercase;
    font-size: 1rem;
    line-height: 1;
    letter-spacing: 6px;
    color: white;
    transform: rotate(-90deg) translate(-50%,calc(100% + 278px));
  }
`
// ${large('display: flex; text-align: center; flex-direction: column;')};
const ImageBox = styled.div`
  width: 400px;
  border-right: solid 1px #3a3a3a;
  display: none;

  .image-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(100% - 70px);
  }
`
const StyledModal = styled(Modal)`
  background: black;
  transition: all .25s linear;
  .modal-dialog {
    max-width: 80%;
    width: 1000px;
    min-width: 50%;
    margin: 100px auto;
  }
  .modal-content {
    background: black;
    border: solid 1px #3a3a3a;
    border-radius: 0;
    display: flex;
    flex-direction: row;
    align-items: stretch;

    img {
      max-width: 350px;
    }
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


export default MenuModal;
