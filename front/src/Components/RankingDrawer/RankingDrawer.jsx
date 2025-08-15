import { Flex, message, Select, Table } from "antd";
import { useEffect, useState } from "react";
import api from "../../Services/api";

function SorteioDrawer() {
    const [categoria, setCategoria] = useState([]);
    const [round, setRound] = useState([]);
    const [heat, setHeat] = useState([]);
    const [teams, setTeams] = useState([]);
  
    const [disableRepescagem, setDisableRepescagem] = useState(false);
    const [disableRound, setDisableRound] = useState(false);
    const [disableHeats, setDisableHeats] = useState(false);
    const [disableHeat3, setDisableHeat3] = useState(false);
  
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchedData, setFetchedData] = useState([]);

    const [messageApi, contextHolder] = message.useMessage();

	//Função para achamar alertas
	const displayMessage = (type, content) => {
        messageApi.open({
          type: type,
          content: content,
        });
    };

    //Fetch das equipes
	const fetchTeams = async () => {
		try {
			const response = await api.get("/equipes");
			setTeams(response.data);
		} catch (error) {
			console.log(error);
			displayMessage("error", error.response.data.message);
		}
	};

	useEffect(() => {
		fetchTeams();
	}, []);

    // Logica para disabilitar selects
    useEffect(() => {
        switch (categoria) {
            case 1:
                setDisableRepescagem(false);
                setDisableHeat3(false);
                setDisableRound(false);
                setDisableHeats(false);
                setRound(null);
                break;
            case 2:
                setDisableRepescagem(false);
                setDisableHeat3(true);
                setDisableRound(false);
                setDisableHeats(false);
                setRound(null);
                break;
        }
    }, [categoria]);
    useEffect(() => {
        switch (round) {
            case 0:
                setDisableHeats(false);
                setHeat(0);
                break;
            case 1:
                setDisableHeats(true);
                setHeat(null);
                break;
            case 2:
                setDisableHeats(true);
                setHeat(null);
                break;
            case 3:
                setDisableHeats(true);
                setHeat(null);
                break;
        }
    }, [round]);

    // Fetch de dados da etapa
    const fetchClassificatorias = async () => {
        try {
            const response = await api.get("/classificatorias");
            setFetchedData(response.data);
        } catch (error) {
            console.log(error);
            displayMessage("error", error.response.data.message);
        }
    }
    // Fetch de dados da etapa
    const fetchRepescagens = async () => {
        try {
            const response = await api.get("/repescagem");
            setFetchedData(response.data);
        } catch (error) {
            console.log(error);
            displayMessage("error", error.response.data.message);
        }
    }
    // Fetch de dados da etapa
    const fetchFinais = async () => {
        try {
            const response = await api.get("/finais");
            setFetchedData(response.data);
        } catch (error) {
            console.log(error);
            displayMessage("error", error.response.data.message);
        }
    }
    // Fetch de dados da etapa
    const fetchArrancadas = async () => {
        try {
            const response = await api.get("/arrancada");
            setFetchedData(response.data);
        } catch (error) {
            console.log(error);
            displayMessage("error", error.response.data.message);
        }
    }

    useEffect(() => {
        switch (round) {
            case 0:
                fetchClassificatorias();
                break;
            case 1:
                fetchRepescagens();
                break;
            case 2:
                fetchFinais();
                break;
            case 3:
                fetchArrancadas();
                break;
        }
    }, [round]);

    // Função para formatar o tempo como MM:SS:MIL
    const mlsToString = (time) => {
        const minutes = String(Math.floor((time / 60000) % 60)).padStart(2, "0");
        const seconds = String(Math.floor((time / 1000) % 60)).padStart(2, "0");
        const milliseconds = String((time % 1000)).padStart(3, "0");
        return `${minutes}:${seconds}:${milliseconds}`;
    };

    // Calculo das posições das equipes
    const calcularClassificatorias = () => {
        // Fazer a relação de time e etapa
        let teamRounds = fetchedData.map(bateriaItem => {
            const equipe = teams.find(equipe => equipe._id === bateriaItem.id_equipe);
            return {
                nome: equipe?.nome || "Nome desconhecido",
                categoria: equipe?.categoria || "Categoria desconhecida",
                bateria: bateriaItem.bateria,
                id_equipe: bateriaItem.id_equipe
            };
        });

        // Filtrar os que não são da categoria
        teamRounds = teamRounds.filter( e => e.categoria === categoria);

        // Calcular a melhor tentativa da bateria
        let bestAttempt = teamRounds.map(team => {
            // Filtra as baterias do round específico
            const roundData = team.bateria[heat];
        
            // Calcula a quantidade de checkpoints e tempo total para cada tentativa
            const attempt1 = {
                checkpoints: roundData.tempo_checkpoints_1.length,
                tempoTotal: roundData.tempo_total_1,
            };
        
            const attempt2 = {
                checkpoints: roundData.tempo_checkpoints_2.length,
                tempoTotal: roundData.tempo_total_2,
            };
        
            // Determina a melhor tentativa
            const bestAttempt =
                attempt1.checkpoints > attempt2.checkpoints ||
                (attempt1.checkpoints === attempt2.checkpoints &&
                attempt1.tempoTotal < attempt2.tempoTotal)
                ? attempt1
                : attempt2;
        
            // Retorna os dados formatados para a equipe atual
            return {
                nome: team.nome,
                idEquipe: team.id_equipe,
                checkpoints: bestAttempt.checkpoints,
                tempo: bestAttempt.tempoTotal,
            };
        });

        console.log(bestAttempt);

        // Ordenar as equipes
        bestAttempt = bestAttempt.sort((a, b) => {
            if (b.checkpoints !== a.checkpoints) {
              return b.checkpoints - a.checkpoints; // Ordena por quantidade de checkpoints (maior para menor)
            }
            return a.tempo - b.tempo; // Em caso de empate, ordena por tempo total (menor para maior)
          });
        
        setTableData(bestAttempt);
    }

    const calcularOutrasEtapas = () => {
        // Fazer a relação de time e etapa
        let teamRounds = fetchedData.map(bateriaItem => {
            const equipe = teams.find(equipe => equipe._id === bateriaItem.id_equipe);
            return {
                nome: equipe?.nome || "Nome desconhecido",
                categoria: equipe?.categoria || "Categoria desconhecida",
                bateria: bateriaItem.bateria,
                id_equipe: bateriaItem.id_equipe
            };
        });

        // Filtrar os que não são da categoria
        teamRounds = teamRounds.filter( e => e.categoria === categoria);

        // Calcular a melhor tentativa da bateria
        let bestAttempt = teamRounds.map(team => {
            // Filtra as baterias do round específico
            const roundData = team.bateria[0];
        
            // Calcula a quantidade de checkpoints e tempo total para cada tentativa
            const attempt1 = {
                checkpoints: roundData.tempo_checkpoints_1.length,
                tempoTotal: roundData.tempo_total_1,
            };
        
            const attempt2 = {
                checkpoints: roundData.tempo_checkpoints_2.length,
                tempoTotal: roundData.tempo_total_2,
            };
        
            // Determina a melhor tentativa
            const bestAttempt =
                attempt1.checkpoints > attempt2.checkpoints ||
                (attempt1.checkpoints === attempt2.checkpoints &&
                attempt1.tempoTotal < attempt2.tempoTotal)
                ? attempt1
                : attempt2;
        
            // Retorna os dados formatados para a equipe atual
            return {
                nome: team.nome,
                idEquipe: team.id_equipe,
                checkpoints: bestAttempt.checkpoints,
                tempo: bestAttempt.tempoTotal,
            };
        });

        // Ordenar as equipes
        bestAttempt = bestAttempt.sort((a, b) => {
            if (b.checkpoints !== a.checkpoints) {
              return b.checkpoints - a.checkpoints; // Ordena por quantidade de checkpoints (maior para menor)
            }
            return a.tempo - b.tempo; // Em caso de empate, ordena por tempo total (menor para maior)
          });



        bestAttempt = bestAttempt.map(attempt => ({
            ...attempt,
            tempo: mlsToString(attempt.tempo),
        }));

        console.log(bestAttempt);
        
        setTableData(bestAttempt);
    }

    useEffect(() => {
        if (round === 0) {
            calcularClassificatorias();
        } else {
            calcularOutrasEtapas();
        }
    }, [fetchedData, heat]);

    // Definiação da coluna
	const colunas = [
        {
            title: "Posição",
            key: 'index',
            render: (text, record, index) => index + 1,
            width: 120,
            align: "center",
        },
        {
            title: "Equipe",
            dataIndex: "nome",
            key: "2",
        },
        { 
            title: "Checkpoints",
            dataIndex: "checkpoints",
            key: "3",
            width: 180,
            align: "center"
        },
        { 
            title: "Tempo",
            dataIndex: "tempo",
            key: "4",
            width: 240,
            align: "center",
            render: (tempo) => mlsToString(tempo),
        }
	];

    return (
            <Flex align="center" gap={"10px"} vertical>
                <Flex align="center" gap="middle">
                    <Select 
                        style={{ width: 200 }}
                        onChange={e => setCategoria(e)}
                        placeholder="Categoria"
                        size="large"
                    >
                        <Select.Option value={1}>Seguidor Avançado</Select.Option>
                        <Select.Option value={2}>Seguidor Mirim</Select.Option>
                    </Select>
                    <Select 
                        style={{ width: 150 }}
                        value={round}
                        onSelect={e => setRound(e)}
                        disabled={disableRound}
                        placeholder="Etapa"
                        size="large"
                    >
                        <Select.Option value={0}>Classificatória</Select.Option>
                        <Select.Option value={1} disabled={disableRepescagem}>Repescagem</Select.Option>
                        <Select.Option value={2}>Final</Select.Option>
                        <Select.Option value={3}>Arrancada</Select.Option>
                    </Select>
                    <Select
                        style={{ width: 120 }}
                        value={heat}
                        disabled={disableHeats}
                        onSelect={e => setHeat(e)}
                        placeholder="Bateria"
                        size="large"
                    >
                        <Select.Option value={0}>Bateria 1</Select.Option>
                        <Select.Option value={1}>Bateria 2</Select.Option>
                        <Select.Option disabled={disableHeat3} value={2}>Bateria 3</Select.Option>
                    </Select>
                </Flex>
                <Flex>
                    <Table
                        columns={colunas} 
                        dataSource={tableData}
                        pagination={false}
                        style={{width: 700, fontWeight: 700}}
                        loading={loading}
                        rowKey={"idEquipe"}
                        scroll={{
                            y: 500,
                        }}
                    />
                </Flex>
            </Flex>
    )
}

export default SorteioDrawer;