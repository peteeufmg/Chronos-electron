const db = require("../database");

// Adiciona uma tentativa
const adicionarTentativa = (req, res) => {
    const { checkpoints } = req.body;
    const { id_equipe, etapa, bateria, tentativa } = req.query;

    try{
        // Ver se tentativa existe
        const tentativaExiste = db.prepare("SELECT 1 FROM tentativas WHERE id_equipe = ? AND etapa = ? AND bateria = ? AND tentativa = ?").get(id_equipe, etapa, bateria, tentativa);
        if (tentativaExiste) return res.status(409).json({ message: "Tentativa já existente"});

        // Criar tentativa
        const inserirTentativa = db.prepare("INSERT INTO tentativas (id_equipe, etapa, bateria, tentativa) VALUES (?, ?, ?, ?)").run(id_equipe, etapa, bateria, tentativa);
        const id_tentativa = inserirTentativa.lastInsertRowid;
        
        // Adicionar checkpoints a tentaiva
        const inserirCheckpoint = db.prepare("INSERT INTO checkpoints (id_tentativa, num, tempo) VALUES (?, ?, ?)");
        const inserirCheckpoints = db.transaction((e) => {
            e.forEach((tempo, index) => {
                inserirCheckpoint.run(id_tentativa, index, tempo);
            });
        });
        inserirCheckpoints(checkpoints);

        console.log("Tentativa adicionada");
        res.status(201).json({ message: "Tentativa criada com sucesso"});
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Erro ao criar a tentativa"});
    }
}

// Lista a tentativa relativa a equipe
const listarTentativa = (req, res) => {
    const { id_equipe } = req.params;
    const { etapa, bateria, tentativa } = req.query;

    try {
        // Pega dados da tentativa
        const stmt = db.prepare("SELECT * FROM tentativas WHERE id_equipe = ? AND etapa = ? AND bateria = ? AND tentativa = ?").get(id_equipe, etapa, bateria, tentativa);
        if (!stmt) return res.status(204).json([]);
        
        // Pega todos os checkpoints da tentativa
        const checkpoints = db.prepare("SELECT * FROM checkpoints WHERE id_tentativa = ? ORDER BY num").all(stmt.id);

        const tentativaCompleta = {
            ...stmt,
            checkpoints
        };

        res.status(200).json(tentativaCompleta);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar tentativa" });
    }
}

// Lista TODAS as tentativas
const listarTentativas = (req, res) => {
    const { categoria, etapa, bateria, tentativa } = req.query;
    
    try {
        // Pegar as tentativas de todas as equipes
        const tentativas = db.prepare(`
            SELECT t.* 
            FROM tentativas t
            JOIN equipes e ON t.id_equipe = e.id
            WHERE t.etapa = ? AND t.bateria = ? AND t.tentativa = ? AND e.categoria = ?
            ORDER BY t.id_equipe
        `).all(etapa, bateria, tentativa, categoria);

        if (!tentativas || tentativas.length === 0) 
            return res.status(404).json({ message: "Não há tentativas nesta categoria" });

        // Pegar todos os checkpoints para as tentativas;
        const tentativaComCheckpoint = tentativas.map( e => {
            const checkpoints = db.prepare("SELECT * FROM checkpoints WHERE id_tentativa = ? ORDER BY num").all(e.id);

            return {
                ...e,
                checkpoints
            } 
        });

        res.status(200).json(tentativaComCheckpoint);
    } catch (error) {
        res.status(500).json({ message: "Erro ao listar tentativas" });
    }
}

// Editar tentativa
const atualizarTentativas = (req, res) => {
    const { id_equipe } = req.params;
    const { etapa, bateria, tentativa, checkpoints } = req.body;

    try {
        // Verifica se a tentativa existe
        const tentativaEncontrada = db.prepare(
            "SELECT * FROM tentativas WHERE id_equipe = ? AND etapa = ? AND bateria = ? AND tentativa = ?"
        ).get(id_equipe, etapa, bateria, tentativa);

        if (!tentativaEncontrada) {
            return res.status(404).json({ message: "Tentativa não existe" });
        }

        const id_tentativa = tentativaEncontrada.id;

        // Transação para remover antigos e inserir novos checkpoints
        const atualizarCheckpoints = db.transaction((novosCheckpoints) => {
            // Remove todos checkpoints antigos
            db.prepare("DELETE FROM checkpoints WHERE id_tentativa = ?").run(id_tentativa);

            // Prepara o insert
            const inserirCheckpoint = db.prepare(
                "INSERT INTO checkpoints (id_tentativa, num, tempo) VALUES (?, ?, ?)"
            );

            // Insere cada checkpoint novo
            novosCheckpoints.forEach((tempo, index) => {
                inserirCheckpoint.run(id_tentativa, index, tempo);
            });
        });

        atualizarCheckpoints(checkpoints);

        console.log("Tentativa atualizada com sucesso");
        res.status(200).json({ message: "Tentativa atualizada com sucesso" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar a tentativa" });
    }
}

//Apagar tentativa
const deletarTentativa = (req, res) => {
    const { id_equipe } = req.params;
    const { etapa, bateria, tentativa } = req.query;

    try {
        // Verifica se a tentativa existe
        const tentativaEncontrada = db.prepare(
            "SELECT id FROM tentativas WHERE id_equipe = ? AND etapa = ? AND bateria = ? AND tentativa = ?"
        ).get(id_equipe, etapa, bateria, tentativa);

        if (!tentativaEncontrada) {
            return res.status(404).json({ message: "Tentativa não existe" });
        }

        // Deleta a tentativa (checkpoints serão removidos pelo ON DELETE CASCADE)
        db.prepare("DELETE FROM tentativas WHERE id = ?").run(tentativaEncontrada.id);

        console.log("Tentativa deletada com sucesso");
        res.status(200).json({ message: "Tentativa deletada com sucesso" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao deletar tentativa" });
    }
};


module.exports = { listarTentativa, listarTentativas, adicionarTentativa, atualizarTentativas, deletarTentativa }