const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes');

function startServer() {
    const app = express();

    // Middlewares
    app.use(cors());
    app.use(express.json());

    // Rotas da aplicação
    app.use("/", routes);

    const PORT = 3000;
    const server = app.listen(PORT, () => {
        console.log(`Servidor executando na porta ${PORT}`);
    });

    // Curativo: Comentamos a parte do Electron temporariamente para conseguirmos testar pelo Chrome
    // const { app: electronApp } = require('electron');
    // electronApp.on('will-quit', () => {
    //     server.close(() => console.log('Servidor Express fechado.'));
    // });
}

// Exporta a função e JÁ LIGA O SERVIDOR na mesma hora!
module.exports = startServer;
startServer();