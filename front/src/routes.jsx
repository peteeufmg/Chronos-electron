import { lazy, Suspense } from "react";
import {
    createHashRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
    Outlet,
} from "react-router-dom";

import NavBar from "./Components/NavBar";


const Home = lazy(() => import("./Pages/Home"));
const Equipes = lazy(() => import("./Pages/Equipes"));
const Ranking = lazy(() => import("./Pages/Ranking"));
const Sorteio = lazy(() => import("./Pages/Sorteio"));
const Cronometro = lazy(() => import("./Pages/Cronometro"));
const Liz = lazy(() => import("./Pages/Liz"));

// Layout com Navbar
function MainLayout() {
    return (
        <>
            <NavBar />
            <Outlet />
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
                <Route path="/liz" element={<Liz />} />
            </Route>
        </Route>
    )
);

export default function Routes() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <RouterProvider router={router} />
        </Suspense>
    );
}