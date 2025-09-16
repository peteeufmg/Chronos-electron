import { DivContainer, DivTitle, DivLinks, Title, Links} from './style';
import { Link } from 'react-router-dom';
import React from "react";

function Home() {
    return (
            <DivContainer>
                <DivTitle>
                    <Title>Chronos</Title>
                </DivTitle>
                <DivLinks>
                    <Link to='/cronometro'><Links>Cronômetro</Links></Link>
                    <Link to='/sorteio'><Links>Sorteios</Links></Link>
                    <Link to='/classificacao'><Links>Ranking</Links></Link>
                    <Link to='/equipes'><Links>Equipes</Links></Link>
                    <Link to='/liz'><Links>Sumô</Links></Link>

                </DivLinks>
            </DivContainer>
    )
}

export default Home;