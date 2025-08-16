import {
    createHashRouter, // <--- ALTERADO
    createRoutesFromElements,
    Route,
    RouterProvider,
    Outlet,
} from "react-router-dom";

import Home from "./Pages/Home";
import Equipes from "./Pages/Equipes";
import Ranking from "./Pages/Ranking";
import Sorteio from "./Pages/Sorteio";
import Cronometro from "./Pages/Cronometro";
import NavBar from "./Components/NavBar";

// Layout com Navbar
function MainLayout() {
    return (
        <>
            <NavBar />
            <Outlet /> {/* Aqui vão aparecer as páginas dentro desse layout */}
        </>
    );
}

const router = createHashRouter(
    createRoutesFromElements(
        <Route>
            {/* Rota sem navbar */}
            <Route path="/" element={<Home />} />

            {/* Rota com navbar */}
            <Route element={<MainLayout />}>
                <Route path="/equipes" element={<Equipes />} />          
                <Route path="/classificacao" element={<Ranking />} />
                <Route path="/sorteio" element={<Sorteio />} />
                <Route path="/cronometro" element={<Cronometro />} />
            </Route>
        </Route>
    )
);

export default function Routes() {
    return <RouterProvider router={router} />
}