import styled from "styled-components";

export const DivContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

export const DivTitle = styled.div`
  margin-bottom: 1.5rem;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #333;
`;

export const Timer = styled.h2`
  font-size: 5rem;  /* aumenta bastante */
  font-weight: bold;
  color: #000;
  margin-bottom: 2rem;
`;

export const Button = styled.button`
  background-color: #555;  /* cinza */
  color: #ffcc00;          /* amarelo */
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background-color: #444;
  }
`;

export const DivLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

export const Links = styled.span`
  font-size: 1.1rem;
  color: #007bff;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const ProgressBarContainer = styled.div`
  width: 80%;
  height: 20px;
  background-color: #ddd;
  border-radius: 10px;
  overflow: hidden;
`;

export const ProgressBar = styled.div`
  height: 100%;
  background-color: #ffcc00;
  border-radius: 10px;
  transition: width 0.1s linear;
`;
