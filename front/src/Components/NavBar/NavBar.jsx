import { NavLink } from "react-router-dom";
import { Container, NavTitle, NavLinks } from "./style";

export default function NavBar() {
    return(
        <div style={{ paddingBottom: "30px" }}>
            <Container>
                <NavTitle>
                    <NavLink to="/">
                        Chronos Web
                    </NavLink>
                </NavTitle>
                <NavLinks>
                    <NavLink to="/cronometro">Cronômetro</NavLink>
                    <NavLink to="/classificacao">Ranking</NavLink>
                    <NavLink to="/equipes">Equipes</NavLink>
                    <NavLink to="/sorteio">Sorteio</NavLink>
                </NavLinks>
            </Container>
        </div>
    )
}