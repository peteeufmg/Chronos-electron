const db = require("../database");

// Enviar colocação final da tentativa
const ranking = (req, res) => {
    const { categoria, etapa, bateria } = req.query;

    try {
        // Buscar todas as equipes da categoria
        const equipes = db.prepare("SELECT * FROM equipes WHERE categoria = ?").all(categoria);
        if (!equipes || equipes.length === 0) {
            return res.status(404).json({ message: "Nenhuma equipe encontrada para essa categoria" });
        }

        const resultadoRanking = equipes.map(equipe => {

        // Pegar as duas tentativas dessa equipe para a etapa e bateria
        const tentativas = db.prepare(`
            SELECT * FROM tentativas 
            WHERE id_equipe = ? AND etapa = ? AND bateria = ? 
            ORDER BY tentativa
        `).all(equipe.id, etapa, bateria);
        if (tentativas.length === 0) {
            return {
                nome: equipe.nome,
                checkpoints: 0,
                tempo_total: null,
                melhor_tentativa: null
            };
        }

        if (tentativas.length === 1) {
            const t = tentativas[0];
            const cps = db.prepare("SELECT * FROM checkpoints WHERE id_tentativa = ? ORDER BY num").all(t.id);
            const qtdCheckpoints = cps.length;
            let tempoTotal = null;
            if (qtdCheckpoints > 0) {
                tempoTotal = cps[cps.length - 1].tempo;
            }
            return {
                nome: equipe.nome,
                checkpoints: qtdCheckpoints,
                tempo_total: tempoTotal,
                melhor_tentativa: t.tentativa + 1
            };
        }

        // Para cada tentativa, pegar checkpoints e calcular desempenho
        const desempenhoTentativas = tentativas.map(t => {
            const cps = db.prepare("SELECT * FROM checkpoints WHERE id_tentativa = ? ORDER BY num").all(t.id);
            const qtdCheckpoints = cps.length;
            let tempoTotal = null;
            if (qtdCheckpoints > 0) {
                tempoTotal = cps[cps.length - 1].tempo; // tempo do último checkpoint
            }
            return {
                tentativa: t.tentativa,
                checkpoints: qtdCheckpoints,
                tempo_total: tempoTotal
            };
        });

        // Escolher a melhor tentativa
        const melhor = desempenhoTentativas.reduce((best, atual) => {
            if (!best) return atual;
            if (atual.checkpoints > best.checkpoints) return atual;
            if (atual.checkpoints === best.checkpoints) {
                if (best.tempo_total === null) return atual;
                if (atual.tempo_total && atual.tempo_total < best.tempo_total) return atual;
            }
            return best;
        }, null);

        return {
                nome: equipe.nome,
                checkpoints: melhor.checkpoints,
                tempo_total: melhor.tempo_total,
                melhor_tentativa: melhor.tentativa + 1
            };
        });

        // Ordenar ranking: mais checkpoints > menor tempo
        resultadoRanking.sort((a, b) => {
            if (b.checkpoints !== a.checkpoints) return b.checkpoints - a.checkpoints;
            if (a.tempo_total === null) return 1;
            if (b.tempo_total === null) return -1;
            return a.tempo_total.localeCompare(b.tempo_total);
        });

        res.status(200).json(resultadoRanking);
        } catch (error) {
            res.status(500).json({ error: "Erro ao gerar ranking" });
        }
}

module.exports = { ranking };