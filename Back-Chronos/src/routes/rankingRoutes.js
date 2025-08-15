const { Router } = require("express");
const { ranking } = require("../controllers/rankingController");

const rankingRoutes = Router();

rankingRoutes.get("", ranking);

module.exports = rankingRoutes;