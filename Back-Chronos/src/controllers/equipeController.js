const db = require("../database");

const listarEquipes = (req, res) => {
    const { categoria } = req.query;

    let equipesSemMembros;

    try{
        if (categoria) {
            equipesSemMembros = db.prepare("SELECT * FROM equipes WHERE categoria = ?").all(categoria);
        } else {
            equipesSemMembros = db.prepare("SELECT * FROM equipes").all();
        }
        if (!equipesSemMembros) return res.status(404).json({ error: "Equipe não encontrada" });
        const participantes = db.prepare("SELECT * FROM participantes WHERE id_equipe = ? ORDER BY capitao DESC");
    
        const equipesComMembros = equipesSemMembros.map(equipe => {
            const membros = participantes.all(equipe.id);
            // Map to array of names, captain first due to ORDER BY capitao DESC
            const nomes = membros.map(membro => membro.nome);
            return {
                ...equipe,
                participantes: nomes
            };
        });
    
        res.status(200).json(equipesComMembros);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar equipes" });
    }
}

const listarEquipesPorCategoria = (req, res) => {
    const { categoria } = req.params;

    try{
        const equipesSemMembros = db.prepare("SELECT * FROM equipes WHERE categoria = ?").all(categoria);
        if (!equipesSemMembros) return res.status(404).json({ error: "Equipe não encontrada" });
        const participantes = db.prepare("SELECT * FROM participantes WHERE id_equipe = ? ORDER BY capitao DESC");
    
        const equipesComMembros = equipesSemMembros.map(equipe => {
            const membros = participantes.all(equipe.id);
            const nomes = membros.map(membro => membro.nome);
            return {
                ...equipe,
                participantes: nomes
            };
        });
    
        res.status(200).json(equipesComMembros);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar equipes" });
    }
}

const listarEquipe = (req, res) => {
    const { id_equipe } = req.params;

    try{
        // Consulta correta da equipe: selecionar todos os dados usando o campo "id"
        const equipeSemMembros = db.prepare("SELECT * FROM equipes WHERE id = ?").get(id_equipe);

        if (!equipeSemMembros) {
            return res.status(404).json({ error: "Equipe não encontrada" });
        }

        // Consulta os participantes da equipe pelo id correto
        const participantes = db.prepare("SELECT * FROM participantes WHERE id_equipe = ? ORDER BY capitao DESC").all(id_equipe);
        // Transform into array of names, captain first due to ORDER BY
        const nomes = participantes.map(membro => membro.nome);

        // Monta o objeto da equipe com a lista de nomes dos participantes
        const equipeComMembros = {
            ...equipeSemMembros,
            participantes: nomes
        };

        // Retorna o resultado
        res.status(200).json(equipeComMembros);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar equipe" });
    }
}

const criarEquipe = (req, res) => {
    const { nome, participantes, categoria } = req.body;
    
    try{
        //Inserir equipe e pegar ID da equipe criada
        const inserirEquipe = db.prepare("INSERT INTO equipes (nome, categoria) VALUES (?, ?)");
        const equipe = inserirEquipe.run(nome, categoria);
        const id_equipe = equipe.lastInsertRowid;
    
        //Inserir membros e associar a equipe
        const inserirMembro = db.prepare("INSERT INTO participantes (nome, capitao, id_equipe) VALUES (?, ?, ?)");
        const inserirMembros = db.transaction(( membros ) => {
            let index = 0;
            for (const nome of membros) {  
                if (index == 0) {
                    inserirMembro.run(nome, 1, id_equipe);
                    index = 1;
                } else {
                    inserirMembro.run(nome, 0, id_equipe);
                }
            }
        });
        inserirMembros(participantes);
        
        console.log("Equipe adicionada");
        res.status(201).json({message: "Equipe criada com sucesso"});
    } catch (error) {
        console.error("Erro: ", error.message);
        res.status(500).json({error: "Erro ao criar a equipe"});
    }
}

const deletarEquipe = (req, res) => {
    const { id_equipe } = req.params;

    try {
        const equipeExiste = db.prepare("SELECT 1 FROM equipes WHERE id = ?").get(id_equipe);
        if (!equipeExiste) return res.status(404).json({ error: "Equipe não encontrada" });

        db.prepare("DELETE FROM equipes WHERE id = ?").run(id_equipe);
        res.status(200).json({message: "Equipe deletada com sucesso"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const atualizarEquipe = (req, res) => {
    const { id_equipe } = req.params;
    const { nome, categoria, participantes } = req.body;

    try {
        // Verifica se equipe existe
        const equipeExiste = db.prepare("SELECT 1 FROM equipes WHERE id = ?").get(id_equipe);
        if (!equipeExiste) return res.status(404).json({ error: "Equipe não encontrada" });

        // Atualiza os campos nome e categoria parcialmente
        const atualizarCampos = [];
        const valores = [];

        if (nome !== undefined) {
            atualizarCampos.push("nome = ?");
            valores.push(nome);
        }
        if (categoria !== undefined) {
            atualizarCampos.push("categoria = ?");
            valores.push(categoria);
        }

        if (atualizarCampos.length > 0) {
            const sql = `UPDATE equipes SET ${atualizarCampos.join(", ")} WHERE id = ?`;
            valores.push(id_equipe);
            db.prepare(sql).run(...valores);
        }

        // Atualiza participantes se enviados (update completo)
        if (participantes && Array.isArray(participantes)) {
            const deletarParticipantes = db.prepare("DELETE FROM participantes WHERE id_equipe = ?");
            const inserirMembro = db.prepare("INSERT INTO participantes (nome, capitao, id_equipe) VALUES (?, ?, ?)");

            const atualizarParticipantes = db.transaction((membros) => {
                deletarParticipantes.run(id_equipe);
                membros.forEach((nome, index) => {
                    inserirMembro.run(nome, index === 0 ? 1 : 0, id_equipe);
                });
            });

            atualizarParticipantes(participantes);
        }

        res.status(200).json({ message: "Equipe atualizada com sucesso" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao atualizar a equipe" });
    }
}

module.exports = { listarEquipes, listarEquipesPorCategoria, listarEquipe, criarEquipe, deletarEquipe, atualizarEquipe };