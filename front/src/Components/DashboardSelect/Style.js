import {styled} from 'styled-components';

export const DivRow2 = styled.div`
    display: flex;
    flex-direction: row;
    width: 75%;
    justify-content: space-between;
    align-items: center;

    @media (max-width: 650px) {
    width: 25%;
    flex-direction: column;
    justify-content: space-between;
    align-items: baseline;
    }
`;
export const DivRow3 = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    gap: 4%;

    @media (max-width: 650px) {
        justify-content: space-between;    
        width: 100%;
    }
 
`;

export const DivRow6 = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: start;
    width: 100%;
    gap: 2rem;
    align-items: center;

    @media (max-width: 650px) {
    }
`;