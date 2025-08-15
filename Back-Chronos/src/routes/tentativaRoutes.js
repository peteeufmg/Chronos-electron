const { Router } = require("express");
const { listarTentativa, adicionarTentativa, listarTentativas, atualizarTentativas, deletarTentativa } = require("../controllers/tentativaController");

const tentativaRoutes = Router();

tentativaRoutes.post("/add", adicionarTentativa);
tentativaRoutes.get("/:id_equipe", listarTentativa);
tentativaRoutes.get("/", listarTentativas);
tentativaRoutes.put("/update/:id_equipe", atualizarTentativas);
tentativaRoutes.delete("/:id_equipe", deletarTentativa);

module.exports = tentativaRoutes;
