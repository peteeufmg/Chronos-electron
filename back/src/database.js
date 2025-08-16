const Database = require("better-sqlite3");
const path = require('path');
const { app } = require("electron");

// Caminho do banco dentro da pasta de dados do usuário
const dbPath = path.join(app.getPath('userData'), 'exemple.db');
// const dbPath = '../exemple.db';
const db = new Database(dbPath);

// Inicializar as tabelas do banco de dados
db.prepare(`
    CREATE TABLE IF NOT EXISTS equipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        categoria INTEGER NOT NULL
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS participantes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_equipe INTEGER NOT NULL,
        nome TEXT NOT NULL,
        capitao BOOLEAN NOT NULL,
        FOREIGN KEY(id_equipe) REFERENCES equipes(id) ON DELETE CASCADE
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS tentativas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_equipe INTEGER NOT NULL,
        etapa INTEGER NOT NULL CHECK(etapa BETWEEN 0 AND 3),
        bateria INTEGER NOT NULL CHECK(bateria BETWEEN 0 AND 2),
        tentativa INTEGER NOT NULL CHECK(tentativa BETWEEN 0 AND 1),
        FOREIGN KEY(id_equipe) REFERENCES equipes(id) ON DELETE CASCADE
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS checkpoints (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_tentativa INTEGER NOT NULL,
        num INTEGER NOT NULL,
        tempo TEXT NOT NULL,
        FOREIGN KEY(id_tentativa) REFERENCES tentativas(id) ON DELETE CASCADE
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS sorteios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        categoria INTEGER NOT NULL,
        etapa INTEGER NOT NULL,
        bateria INTEGER NOT NULL,
        data_sorteio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(categoria, etapa, bateria)
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS sorteio_equipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_sorteio INTEGER NOT NULL,
        id_equipe INTEGER NOT NULL,
        ordem INTEGER NOT NULL,
        FOREIGN KEY(id_sorteio) REFERENCES sorteios(id) ON DELETE CASCADE,
        FOREIGN KEY(id_equipe) REFERENCES equipes(id) ON DELETE CASCADE,
        UNIQUE(id_sorteio, id_equipe),
        UNIQUE(id_sorteio, ordem)
    )
`).run();

// Função para fechar o DB com segurança
const fecharDB = () => {
    if (db.open) {
        console.log("Fechando banco de dados...");
        db.close();
        console.log("Banco fechado!");
    }
};

// Fechamento seguro com Electron
// app.on('will-quit', fecharDB);

// Fechamento seguro em sinais do processo
process.on('SIGINT', () => { fecharDB(); process.exit(0); });
process.on('SIGTERM', () => { fecharDB(); process.exit(0); });
process.on('exit', (code) => { fecharDB(); console.log(`Processo finalizado com código ${code}`); });

module.exports = db;
