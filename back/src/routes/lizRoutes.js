const { Router } = require("express");
const LizController = require("../controllers/lizController");

const lizRoutes = Router();

lizRoutes.get("/", LizController.index);    // retorna algo simples
lizRoutes.post("/", LizController.create);  // cria recurso
lizRoutes.delete("/", LizController.delete); // remove recurso

module.exports = lizRoutes;
