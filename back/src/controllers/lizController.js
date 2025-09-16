// controllers/lizController.js
module.exports = {
    index: (req, res) => {
      res.send("Rota GET /liz funcionando 🚀");
    },
  
    create: (req, res) => {
      const data = req.body;
      res.json({ message: "Recurso criado!", data });
    },
  
    delete: (req, res) => {
      res.json({ message: "Recurso deletado!" });
    },
  };
  