const { Router } = require("express");
const equipeRoutes = require("./equipeRoutes");
const tentativaRoutes = require("./tentativaRoutes");
const rankingRoutes = require("./rankingRoutes");
const sorteioRoutes = require("./sorteioRoutes");

const routes = Router();

routes
    .use("/equipe", equipeRoutes)
    .use("/tentativa", tentativaRoutes)
    .use("/ranking", rankingRoutes)
    .use("/sorteio", sorteioRoutes);

module.exports = routes;