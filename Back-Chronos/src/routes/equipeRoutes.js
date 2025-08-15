const { Router } = require("express");
const { listarEquipes, criarEquipe, deletarEquipe, atualizarEquipe, listarEquipe, listarEquipesPorCategoria } = require("../controllers/equipeController");

const equipeRoutes = Router();

equipeRoutes.get("", listarEquipes);
equipeRoutes.get("/c/:categoria", listarEquipesPorCategoria);
equipeRoutes.get("/:id_equipe", listarEquipe);
equipeRoutes.post("", criarEquipe);
equipeRoutes.delete("/:id_equipe", deletarEquipe);
equipeRoutes.put("/:id_equipe", atualizarEquipe);

module.exports = equipeRoutes;