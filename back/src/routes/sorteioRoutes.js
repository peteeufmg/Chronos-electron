const { Router } = require("express");
const SorteioController = require("../controllers/sorteioController");

const sorteioRoutes = Router();

sorteioRoutes.post("/", SorteioController.criar); //
sorteioRoutes.get("/", SorteioController.buscar);
sorteioRoutes.delete("/", SorteioController.apagar);

module.exports = sorteioRoutes;