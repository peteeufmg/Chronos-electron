import { NavLink } from "react-router-dom";
import { Container, NavTitle, NavLinks } from "./style";
import logo from "../../assets/icons/Logo.png"; // ajuste o caminho da sua imagem


export default function NavBar() {
    return(
        <div style={{ paddingBottom: "30px" }}>
            <Container>

                <NavTitle>
                    <NavLink>
                        <img 
                            src={logo} 
                            alt="Logo Chronos" 
                            style={{ width: "32px", height: "32px", objectFit: "cover" }} 
                        />
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