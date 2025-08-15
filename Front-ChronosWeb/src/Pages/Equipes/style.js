import {styled} from 'styled-components';
import { Button, List, Select } from 'antd';

export const Container = styled.div`
    display: flex;
    flex-direction: column;

    width: 100vw;
    height: 100vh;

    color: black;
    text-transform: uppercase;
    gap: 5% ;
`;
export const Frame = styled.div`
    display: flex;
    flex-direction: column;
    padding: .5rem 10% 0 10%;
`;
export const Title = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const TitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 1%;
`;

export const Text = styled.div`
    margin: 0;
    font-size: 2rem;
`;

export const StyledList = styled(List)`
    display: flex;
    flex-direction: column;
    
    color:black; 
    font-size: 1.5rem;
`;

export const Selection = styled(Select)`
    width: 150px;
`;

export const SelectContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 1%;
    margin: 1.5% 0 1.5% 0;
`;

export const Description = styled(List.Item.Meta)`
    display: flex;
    flex-direction: row;
    padding: 0.7% 1.5% 0.7% 1.5%;
    margin: 0;
`;

export const Info = styled.p`
    font-family: 'Jura', sans-serif;
    color:black; 
    font-weight: 400;
    font-size: 1.5rem;
    margin: 0;
`;



