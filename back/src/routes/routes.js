const { Router } = require("express");
const equipeRoutes = require("./equipeRoutes");
const tentativaRoutes = require("./tentativaRoutes");
const rankingRoutes = require("./rankingRoutes");
const sorteioRoutes = require("./sorteioRoutes");
const lizRoutes = require("./lizRoutes");

const routes = Router();

routes
    .use("/equipe", equipeRoutes)
    .use("/tentativa", tentativaRoutes)
    .use("/ranking", rankingRoutes)
    .use("/liz", lizRoutes)
    .use("/sorteio", sorteioRoutes);

module.exports = routes;