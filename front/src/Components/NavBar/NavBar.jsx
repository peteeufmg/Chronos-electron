import { NavLink } from "react-router-dom";
import { Container, NavTitle, NavLinks } from "./style";
import logo from "../../assets/icons/Logo.png"; // ajuste o caminho da sua imagem
import PETEElogo from "../../assets/icons/PETEElogo.png";

export default function NavBar() {
    return(
        <div style={{ paddingBottom: "30px" }}>
            <Container>

                <NavTitle>
               
                    <NavLink style={{ display: "flex", alignItems: "center" }} to="/">
                    <span>Chronos</span>
                        <img 
                            src={logo}  
                            alt="Logo Chronos" 
                            style={{ width: "100px", height: "90px", objectFit: "cover" }} 
                        />
                        <img
                        src={PETEElogo}
                        alt="Logo PETEE"
                        style={{ width: "40px", height: "56px", objectFit: "cover", marginRight: "15px" }}
                        ></img>
                     
                    </NavLink>
                </NavTitle>
                <NavLinks>
                    <NavLink to="/cronometro">Cronômetro</NavLink>
                    <NavLink to="/classificacao">Ranking</NavLink>
                    <NavLink to="/equipes">Equipes</NavLink>
                    <NavLink to="/sorteio">Sorteio</NavLink>
                    <NavLink to="/liz">Sumô</NavLink>
                </NavLinks>
            </Container>
        </div>
    )
}