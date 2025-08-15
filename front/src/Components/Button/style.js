import styled from "styled-components";

export const ButtonContainer = styled.button`
    display: flex;
    flex-direction: row;

    align-items: center;
    padding: 3px 10px;
    gap: 10px;
    border-radius: 5px;

    background-color: #464540;

    &:active {
        background-color: grey;
    }
    &:disabled{
        background-color: #ccc;
        color: #666;
        cursor: not-allowed;
        border: 2px solid #999;
        opacity: 0.7;
    }
`;

export const ButtonText = styled.div`
    font-size: 1.4rem;
    
    color: white;
    text-transform: uppercase;
    font-weight: 600;
`;
