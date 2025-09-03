  // NotFound.jsx
  import React from "react";
  import styled, { keyframes } from "styled-components";

  // Animation keyframes
  const glitch = keyframes`
    0% { text-shadow: 2px 0 red, -2px 0 blue; }
    20% { text-shadow: -2px 0 red, 2px 0 blue; }
    40% { text-shadow: 2px 0 red, -2px 0 blue; }
    60% { text-shadow: -2px 0 red, 2px 0 blue; }
    80% { text-shadow: 2px 0 red, -2px 0 blue; }
    100% { text-shadow: 0 0 transparent, 0 0 transparent; }
  `;

  const glitchTop = keyframes`
    0% { clip-path: inset(0 0 80% 0); transform: translate(-2px, -2px); }
    50% { clip-path: inset(0 0 30% 0); transform: translate(2px, 2px); }
    100% { clip-path: inset(0 0 80% 0); transform: translate(0, 0); }
  `;

  const glitchBottom = keyframes`
    0% { clip-path: inset(80% 0 0 0); transform: translate(2px, 2px); }
    50% { clip-path: inset(30% 0 0 0); transform: translate(-2px, -2px); }
    100% { clip-path: inset(80% 0 0 0); transform: translate(0, 0); }
  `;

  const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  `;

  // Styled Components
  const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(to right, #0f2027, #203a43, #2c5364);
    color: white;
    overflow: hidden;
    text-align: center;
    padding: 2rem;
    font-family: 'Courier New', Courier, monospace;
  `;

  const GlitchText = styled.h1`
    font-size: 12rem;
    position: relative;
    font-weight: 900;
    letter-spacing: 10px;
    animation: ${glitch} 1.5s infinite;
    color: #ffffff;

    &::before,
    &::after {
      content: attr(data-text);
      position: absolute;
      left: 0;
      width: 100%;
      overflow: hidden;
    }

    &::before {
      top: 0;
      color: red;
      animation: ${glitchTop} 2.5s infinite linear;
    }

    &::after {
      bottom: 0;
      color: blue;
      animation: ${glitchBottom} 2.5s infinite linear;
    }
  `;



  const SubText = styled.p`
    font-size: 1.5rem;
    color: #e0e0e0;
    margin-top: 1.5rem;
    animation: ${fadeIn} 1s ease-in-out forwards;
    animation-delay: 0.2s;
    opacity: 0;
  `;

  const Button = styled.a`
    margin-top: 2rem;
    padding: 0.8rem 2.5rem;
    background-color: transparent;
    border: 2px solid #fff;
    color: #fff;
    text-decoration: none;
    font-weight: bold;
    font-size: 1rem;
    border-radius: 8px;
    transition: all 0.2s ease;
    animation: ${fadeIn} 1 ease-in-out forwards;
    animation-delay: 1s;
    opacity: 0;

    &:hover {
      background-color: #fff;
      color: #111;
      transform: scale(1.05);
    }
  `;
  

  const NotFound = () => {
    return (
      <Wrapper>

        <GlitchText data-text="404">404</GlitchText>
        <SubText>Oops! Trang bạn tìm không tồn tại hoặc đã bị xoá.</SubText>
        <Button href="/">← Quay lại trang chủ</Button>
      </Wrapper>
    );
  };

  export default NotFound;
