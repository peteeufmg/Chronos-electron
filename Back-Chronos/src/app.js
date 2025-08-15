const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes');

const app = express();

app.use(cors());

app.use(express.json());

app.use("", routes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor executando na porta ${PORT}`);
});