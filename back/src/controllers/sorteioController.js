const db = require("../database.js"); // Importa a conexão com o banco de dados

const SorteioController = {
    /**
     * Controller para criar um novo sorteio e armazenar a ordem das equipes.
     * Espera um corpo de requisição (req.body) no formato:
     * {
     * "categoria": 0,
     * "etapa": 1,
     * "bateria": 2,
     * "equipesSorteadas": [ { "id": 5 }, { "id": 2 }, { "id": 8 } ]
     * }
     */
    criar: (req, res) => {
        const { categoria, etapa, bateria, equipesSorteadas } = req.body;

        // Validação básica dos dados de entrada
        if (categoria == null || etapa == null || bateria == null || !Array.isArray(equipesSorteadas) || equipesSorteadas.length === 0) {
            return res.status(400).json({ message: "Dados inválidos. Forneça categoria, etapa, bateria e uma lista de equipes." });
        }

        // Usamos uma transação para garantir a integridade dos dados.
        // Se qualquer inserção falhar, todas serão desfeitas (rollback).
        try {
            const transaction = db.transaction(() => {
                // 1. Insere o evento do sorteio na tabela 'sorteios'
                const stmtSorteio = db.prepare(
                    "INSERT INTO sorteios (categoria, etapa, bateria) VALUES (?, ?, ?)"
                );
                const info = stmtSorteio.run(categoria, etapa, bateria);
                const id_sorteio = info.lastInsertRowid;

                // 2. Prepara a inserção para a tabela 'sorteio_equipes'
                const stmtEquipe = db.prepare(
                    "INSERT INTO sorteio_equipes (id_sorteio, id_equipe, ordem) VALUES (?, ?, ?)"
                );

                // 3. Itera sobre as equipes sorteadas e as insere com sua ordem
                for (let i = 0; i < equipesSorteadas.length; i++) {
                    const equipe = equipesSorteadas[i];
                    const ordem = i + 1; // A ordem é a posição no array (1, 2, 3...)
                    stmtEquipe.run(id_sorteio, equipe.id, ordem);
                }

                return { id: id_sorteio };
            });

            const resultado = transaction();
            return res.status(201).json({ message: "Sorteio armazenado com sucesso!", sorteioId: resultado.id });

        } catch (error) {
            console.error("Erro ao salvar sorteio:", error.message);

            // Se o erro for de violação da restrição UNIQUE, significa que o sorteio já existe.
            if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                return res.status(409).json({ message: "Este sorteio (combinação de categoria, etapa e bateria) já existe." });
            }

            return res.status(500).json({ message: "Erro interno no servidor ao salvar o sorteio." });
        }
    },
    
    buscar: (req, res) => {
        const { categoria, etapa, bateria } = req.query;

        if (categoria == null || etapa == null || bateria == null) {
            return res.status(400).json({ message: "Categoria, etapa e bateria são obrigatórios." });
        }

        try {
            // 1. Encontra o ID do sorteio principal
            const sorteio = db.prepare(
                "SELECT id FROM sorteios WHERE categoria = ? AND etapa = ? AND bateria = ?"
            ).get(categoria, etapa, bateria);

            if (!sorteio) {
                // Se não encontrar, retorna 404, o que é esperado e não um erro.
                return res.status(404).json({ message: "Nenhum sorteio encontrado." });
            }

            // 2. Busca as equipes e suas ordens, juntando com a tabela de equipes para pegar o nome
            const equipes = db.prepare(`
                SELECT E.id, E.nome, E.categoria, SE.ordem 
                FROM sorteio_equipes SE
                JOIN equipes E ON SE.id_equipe = E.id
                WHERE SE.id_sorteio = ?
                ORDER BY SE.ordem ASC
            `).all(sorteio.id);
            
            return res.status(200).json(equipes);

        } catch (error) {
            console.error("Erro ao buscar sorteio:", error.message);
            return res.status(500).json({ message: "Erro interno no servidor." });
        }
    },

    apagar: (req, res) => {
        const { categoria, etapa, bateria } = req.query;

        if (categoria == null || etapa == null || bateria == null) {
            return res.status(400).json({ message: "Categoria, etapa e bateria são obrigatórios para apagar." });
        }

        try {
            // A restrição "ON DELETE CASCADE" no banco de dados garante que ao apagar o sorteio,
            // todas as entradas em 'sorteio_equipes' relacionadas também serão apagadas.
            const stmt = db.prepare(
                "DELETE FROM sorteios WHERE categoria = ? AND etapa = ? AND bateria = ?"
            );
            const info = stmt.run(categoria, etapa, bateria);

            if (info.changes === 0) {
                return res.status(404).json({ message: "Nenhum sorteio encontrado para apagar." });
            }

            return res.status(200).json({ message: "Sorteio apagado com sucesso." });

        } catch (error) {
            console.error("Erro ao apagar sorteio:", error.message);
            return res.status(500).json({ message: "Erro interno no servidor." });
        }
    }
};

module.exports = SorteioController;