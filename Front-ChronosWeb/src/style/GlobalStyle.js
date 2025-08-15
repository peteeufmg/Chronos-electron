// GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /* Reset CSS */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* Body styling */
  body, html {
    font-family: 'Jura', sans-serif;
    display: flex;
    background-color: white !important;
    display: flex;
    color: black;
    line-height: 1;

    font-size: 16px;  /* 1rem = 16px */
    @media (max-width: 1200px) {
        font-size: 13px;  
    }
    @media (max-width: 900px) {
        font-size: 11px;  
    }
    @media (max-width: 800px) {
        font-size: 9px; 
    }
    @media(max-width: 600px){
        font-size: 8px;
    }
  }

  /* Anchor styling */
  a {
    color: inherit;
    text-decoration: none;
  }

  /* List styling */
  ul {
    list-style: none;
  }

  /* Button styling */
  button {
    font-family: inherit;
    cursor: pointer;
    border-style: none;
  }

  button:active {
    border-style: none;
  }

  /* Additional global styles can go here */
  h1, h2, h3, h4, h5, h6 {
    margin: 0 0 0 0;
    font-weight: 600;
  }

  p {
    margin: 0 0 0 0;
  }
`;

export default GlobalStyle;
