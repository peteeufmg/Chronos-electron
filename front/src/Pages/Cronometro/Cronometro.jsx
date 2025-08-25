import { Checkbox, ConfigProvider, Drawer, Flex, Input, Popconfirm, Radio, Select, Typography, message } from "antd";
import { useEffect, useRef, useState } from "react";
import Button from "../../Components/Button";
import api from "../../Services/api"
import SorteioDrawer from "../../Components/SorteioDrawer";
import RankingDrawer from "../../Components/RankingDrawer";
import Ranking from "../Ranking";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

function Cronometro() {
    const [categoria, setCategoria] = useState(null);
    const [etapa, setEtapa] = useState(null);
    const [bateria, setBateria] = useState(null);
    const [tentativa, setTentativa] = useState(null);
    const [equipes, setEquipes] = useState([]);
    const [equipe, setEquipe] = useState([]);
    const [time, setTime] = useState(0); // Armazena o tempo em milissegundos
    const [isRunning, setIsRunning] = useState(false); // Controla se o cronômetro está rodando
    const [checkpoints, setCheckpoints] = useState([]);
    const [disableSensors, setDisableSensors] = useState(true);
    const [selectedCheckpoint, setSelectedCheckpoint] = useState([]);

    const startTimeRef = useRef(0); // Remove a tipagem explícita

    const [messageApi, contextHolder] = message.useMessage();

    // Fetch equipes do banco de dados
    const fetchEquipesPorCategoria = async (e) => {
        try {
            const response = await api.get(`/equipe/c/${e}`);
            setEquipes(response.data);
            setEquipe(null);
        } catch (error) {
            console.log(error.message);
            displayMessage("error", "Erro na aquisição de equipes");
        }
    }

    // Fetch tentiva da equipe
    const fetchTentativa = async () => {
        const req = {
            etapa: etapa,
            bateria: bateria,
            tentativa: tentativa
        }

        try {
            const response = await api.get(`/tentativa/${equipe}`, { params: req });
            if (response.data.checkpoints == undefined) {
                setCheckpoints([]);
                return
            };

            const ms = response.data.checkpoints.map(e => stringToMls(e.tempo));

            setCheckpoints(ms);
            
        } catch (error) {
            displayMessage("error", "Erro na aquisição de tentativas ");
        }
    }

    // Faz o fetch sempre que alterar o select
    useEffect(() => {
        if (categoria != null & tentativa != null & equipe != null & bateria != null & etapa != null) {
            fetchTentativa();
        }
    }, [tentativa, equipe, bateria, etapa]);

    // Salvar tentativa no back
    const adicionarTentativa = async () => {
        const e = checkpoints.map(e => mlsToString(e));
        const query = {
            id_equipe: equipe,
            etapa: etapa,
            bateria: bateria,
            tentativa: tentativa,
        };
        const body = {
            checkpoints: e
        };

        if (categoria == null & tentativa == null & equipe == null & bateria == null & etapa == null) {
            displayMessage("error", "Não foi escolhido categoria, equipe, etapa, bateria ou tentativa");
            return;
        }

        if (checkpoints.length == 0) {
            displayMessage("warning", "Os checkpoints estão vazios");
            return;
        }

        try {
            const response = await api.post("/tentativa/add", body, { params:query });

            displayMessage("success", response.data.message);
        } catch (error) {
            displayMessage("error", error.response?.data?.message || "Erro ao salvar checkpoints");
        }

    }

    // Apagar tentativa
    const apagarTentativa = async () => {
        const query = {
            etapa: etapa,
            bateria: bateria,
            tentativa: tentativa
        };

        try {
            const response = await api.delete(`/tentativa/${equipe}`, { params: query });

            setCheckpoints([]);
            displayMessage("success", response.data.message);
        } catch (error) {
            displayMessage("error", error.response?.data?.message);
        }
    }

    // Funcação do cronometro
    useEffect(() => {
        let intervalId;
        if (isRunning) {
          intervalId = setInterval(() => setTime(Date.now() - startTimeRef.current), 1);
        }
        return () => clearInterval(intervalId);
    }, [isRunning]);
      
    // Funções para definir o comportamento do cronomêtro
    const onStart = () => {
        if (isRunning) return;
        startTimeRef.current = Date.now();
        setIsRunning(true);
        setCheckpoints([]);
    }

    const onStop = () => {
        setIsRunning(false);
    }

    const onReset = () => {
        onStop();
        setTime(0);
        setCheckpoints([]);
    }

    // Função para formatar o tempo como MM:SS:MIL
    const mlsToString = (time) => {
        const minutes = String(Math.floor((time / 60000) % 60)).padStart(2, "0");
        const seconds = String(Math.floor((time / 1000) % 60)).padStart(2, "0");
        const milliseconds = String((time % 1000)).padStart(3, "0");
        return `${minutes}:${seconds}:${milliseconds}`;
    };
    
    // Função inversa da superior
    const stringToMls = (timeString) => {
        const [minutes, seconds, milliseconds] = timeString.split(":").map(Number);
        const totalMilliseconds = (minutes * 60000) + (seconds * 1000) + milliseconds;
        return totalMilliseconds;
    };;

    // Função para formatar o horário de cada checkpoint
    const formatCheckpoint = (index) => {
        const checkpoint = checkpoints[index];
        const formatedTime = "--:--:---";

        if (checkpoint === undefined) {
            return formatedTime;
        } else {
            return mlsToString(checkpoint);
        }
    }

    // Registra o valor que do tempo a partir do sensor
    const handleSensors = (index) => {
        let updatedCheckpoints = [...checkpoints]; // Cria uma cópia do array
        if (updatedCheckpoints[index - 1] === undefined) {
        updatedCheckpoints[index - 1] = time; // Atualiza o valor
        setCheckpoints(updatedCheckpoints); // Define o novo array como o estado
    }
    }

    //Captura tempo do cronometro manualmente
    //Captura tempo do cronometro manualmente
    const saveTime = () => {
        // Conta quantos checkpoints já foram preenchidos.
        const checkpointsPreenchidos = checkpoints.filter(c => c !== undefined).length;

        // Se 8 checkpoints já foram salvos, exibe uma mensagem e não faz mais nada.
        if (checkpointsPreenchidos >= 8) {
            displayMessage("warning", "O limite de 8 checkpoints já foi atingido.");
            return; // Encerra a função aqui.
        }

        let tempoAdicionado = false;
        // O laço agora vai de 0 a 7, respeitando o limite de 8 checkpoints.
        for(let i = 0; i < 8; i++) {
            if (checkpoints[i] === undefined && !tempoAdicionado) {
                let updatedCheckpoints = [...checkpoints];
                updatedCheckpoints[i] = time;
                setCheckpoints(updatedCheckpoints);
                tempoAdicionado = true; // Garante que o tempo seja adicionado apenas uma vez.
                
                // Se o checkpoint adicionado for o último (índice 7), para o cronômetro.
                if (i === 7) {
                    onStop();
                }
            }
        }
    }
    
    // Seleciona qual checkpoint irá ser alterado manualmente
    const checkpointSelector = (
        <Select 
            style={{width: 130}} 
            placeholder="Checkpoint"
            onChange={e => setSelectedCheckpoint(e)}         
        >
          <Option value={1}>Checkpoint 1</Option>
          <Option value={2}>Checkpoint 2</Option>
          <Option value={3}>Checkpoint 3</Option>
          <Option value={4}>Checkpoint 4</Option>
          <Option value={5}>Checkpoint 5</Option>
          <Option value={6}>Checkpoint 6</Option>
          <Option value={7}>Checkpoint 7</Option>
          <Option value={8}>Checkpoint 8</Option>
          <Option value={9}>Checkpoint 9</Option>
          <Option value={10}>Checkpoint 10</Option>
        </Select>
    )

    // Função para atualizar o valor do checkpoint selecionado manualmente
    const updatedCheckpoint = (e) => {
        let value = e;
        if (e === "0") {
            let updatedCheckpoints = [...checkpoints]; // Cria uma cópia do array
            updatedCheckpoints[selectedCheckpoint-1] = undefined; // Atualiza o valor
            setCheckpoints(updatedCheckpoints); // Define o novo array como o estado
        } else {
            let updatedCheckpoints = [...checkpoints]; // Cria uma cópia do array
            updatedCheckpoints[selectedCheckpoint-1] = stringToMls(value); // Atualiza o valor
            setCheckpoints(updatedCheckpoints); // Define o novo array como o estado
        }
    }

    //Função para achamar alertas
    const displayMessage = (type, content) => {
        messageApi.open({
          type: type,
          content: content,
        });
    }

    const [ports, setPorts] = useState([]);
    const [selectedPort, setSelectedPort] = useState('');
    const [serialData, setSerialData] = useState(null);
    const [connected, setConnected] = useState(false);
    const [popVisible, setPopVisible] = useState(false);

    // 1. Escuta de dados da serial (é feito apenas uma vez)
    useEffect(() => {
        if (window.serialAPI) {
            window.serialAPI.onData((data) => {
                // Remove os espaços em branco que podem vir da serial
                const trimmedData = data.trim();
                setSerialData(trimmedData);
            });
        }
    }, []);

    // 2. Atualiza a função de listar portas
    const updatePorts = async () => {
        if (!window.serialAPI) {
            messageApi.error('A API serial não está disponível.');
            return;
        }
        try {
            const list = await window.serialAPI.listPorts();
            setPorts(list);
            if (list.length > 0 && !selectedPort) setSelectedPort(list[0].path);
        } catch (err) {
            messageApi.error('Erro ao listar portas: ' + err.message);
        }
    };

    // 3. Atualiza a função de conectar
    const handleConnect = async () => {
        if (!selectedPort) {
            messageApi.error('Selecione uma porta!');
            return;
        }
        try {
            const result = await window.serialAPI.connect(selectedPort);
            if (result.success) {
                setConnected(true);
                messageApi.success(`Conectado à porta ${result.path}`);
            } else {
                messageApi.error(`Falha ao conectar: ${result.error}`);
            }
        } catch (err) {
            messageApi.error('Erro ao conectar: ' + err.message);
        }
        setPopVisible(false);
    };

    // 4. Lógica dos sensores (sem alterações, mas agora deve funcionar)
    useEffect(() => {
        if (!serialData || disableSensors) return;
        
        const numberValue = parseInt(serialData);
        switch (numberValue) {
        case 0:
            onStart();
            break;
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8: // Adicionado caso 8 aqui
            handleSensors(numberValue);
            if (numberValue === 8) {
                onStop();
            }
            break;
        default:
            console.log('Evento não definido para:', serialData);
            break;
        }
        
    }, [serialData, disableSensors]);


    // Parte do Sorteio da página
    const [abrirSorteio, setAbrirSorteio] = useState(false);
    const handleSorteio = () => {
        setAbrirSorteio(!abrirSorteio);
    };

    const [abrirRanking, setAbrirRanking] = useState(false);
    const handleRanking = () => {
        setAbrirRanking(!abrirRanking);
    }
        
    return(
        <>
            {contextHolder}
            <Flex justify="center">
                <Flex style={{maxWidth: "1440px"}} align="center" gap="large" vertical>
                    {/* Seletores */}
                    <Flex style={{ paddingBottom: "20px" }} gap="large">
                        <Select 
                            style={{ width: 200 }}
                            onChange={e => {setCategoria(e); fetchEquipesPorCategoria(e);}}
                            placeholder="Categoria"
                            size="large"
                        >
                            <Select.Option value={0}>Seguidor Avançado</Select.Option>
                            <Select.Option value={1}>Seguidor Mirim</Select.Option>
                        </Select>
                        <Select
                            style={{ width: 250 }}
                            onSelect={e => setEquipe(e)}
                            value={equipe}
                            placeholder="Equipe"
                            size="large"
                        >
                            {
                                equipes.map(({id, nome}) => {
                                    return <Select.Option key={id} value={id}>{nome}</Select.Option>
                                })
                            }
                        </Select>
                        <Select 
                            style={{ width: 150 }}
                            onSelect={e => setEtapa(e)}
                            placeholder="Etapa"
                            size="large"
                        >
                            <Select.Option value={0}>Classificatória</Select.Option>
                            <Select.Option value={1}>Repescagem</Select.Option>
                            <Select.Option value={2}>Final</Select.Option>
                            <Select.Option value={3}>Arrancada</Select.Option>
                        </Select>
                        <Select
                            style={{ width: 120 }}
                            onSelect={e => setBateria(e)}
                            placeholder="Bateria"
                            size="large"
                        >
                            <Select.Option value={0}>Bateria 1</Select.Option>
                            <Select.Option value={1}>Bateria 2</Select.Option>
                            <Select.Option value={2}>Bateria 3</Select.Option>
                        </Select>
                        <Select
                            style={{ width: 130 }}
                            onSelect={e => {setTentativa(e)}}
                            placeholder="Tentativa"
                            size="large"
                        >
                            <Select.Option value={0}>Tentativa 1</Select.Option>
                            <Select.Option value={1}>Tentativa 2</Select.Option>
                        </Select>
                    </Flex>
                    {/* Cronometro */}
                    <Flex style={{width: "100%"}} gap="50px" vertical>
                        {/* Cronometro e controles */}
                        <Flex justify="space-between" align="center">
                            {/* Coluna 1 */}
                            <Flex vertical>
                                <Flex gap="middle">
                                    <Title>Cronômetro:</Title>
                                    <Title style={{width: 200,  marginTop: 0 }}>{mlsToString(time)}</Title>
                                </Flex>
                                <Flex style={{paddingBottom: "10px"}} gap="middle">
                                    <Button type="Play" text="Play" onClick={onStart} />
                                    <Button type="Pause" text="Pause" onClick={onStop} />
                                    <Button type="Restart" text="Reset" onClick={onReset} />
                                </Flex>
                            </Flex>
                            {/* Coluna 2 */}
                            <Flex style={{height: "60%"}} justify="space-around" vertical>
                                <Popconfirm
                                    title={
                                    <div>
                                        <p>Escolha a porta para conectar:</p>
                                        <Radio.Group
                                        value={selectedPort}
                                        onChange={(e) => setSelectedPort(e.target.value)}
                                        >
                                        {ports.map((p) => (
                                            <Radio key={p.path} value={p.path}>
                                            {p.path} {p.manufacturer || ''}
                                            </Radio>
                                        ))}
                                        </Radio.Group>
                                    </div>
                                    }
                                    open={popVisible}
                                    onConfirm={handleConnect}
                                    onCancel={() => setPopVisible(false)}
                                    okText="Conectar"
                                    cancelText="Cancelar"
                                    onOpenChange={(visible) => {
                                    setPopVisible(visible);
                                    if (visible) updatePorts();
                                    }}
                                >
                                    <Button type={connected ? "" : "Connect"} onClick={() => setPopVisible(true)} text={connected ? "Conectado" : "Conectar"} />
                                </Popconfirm>
                                <Checkbox
                                    onChange={e => {setDisableSensors(!e.target.checked); setSerialData(null); }}
                                >Ativar Sensores</Checkbox>
                            </Flex>
                        </Flex>
                        {/* Checkpoints */}
                        <ConfigProvider
                            theme={{
                                components: {
                                    Typography: {
                                        titleMarginBottom: 0,
                                        titleMarginTop: 0
                                    }
                                }
                            }}
                        >
                            <Flex justify="space-around" >
                                <Flex gap="small">
                                    <Flex vertical>
                                        <Title level={2}>Checkpoint</Title>
                                        <Title level={2}>Checkpoint</Title>
                                        <Title level={2}>Checkpoint</Title>
                                        <Title level={2}>Checkpoint</Title>
                                    </Flex>
                                    <Flex align="center" vertical>
                                        <Title level={2}>1</Title>
                                        <Title level={2}>2</Title>
                                        <Title level={2}>3</Title>
                                        <Title level={2}>4</Title>
                                    </Flex>
                                    <Flex vertical>
                                        <Title level={2}>:</Title>
                                        <Title level={2}>:</Title>
                                        <Title level={2}>:</Title>
                                        <Title level={2}>:</Title>
                                    </Flex>
                                    <Flex style={{width: 160}} align="center" vertical>
                                        <Title level={2}>{formatCheckpoint(0)}</Title>
                                        <Title level={2}>{formatCheckpoint(1)}</Title>
                                        <Title level={2}>{formatCheckpoint(2)}</Title>
                                        <Title level={2}>{formatCheckpoint(3)}</Title>
                                    </Flex>
                                </Flex>
                                
                                <Flex gap="small">
                                    <Flex align="center" vertical>
                                        <Title level={2}>Checkpoint</Title>
                                        <Title level={2}>Checkpoint</Title>
                                        <Title level={2}>Checkpoint</Title>
                                        <Title level={2}>Chegada</Title>
                                    </Flex>
                                    <Flex align="center" vertical>
                                        <Title level={2}>5</Title>
                                        <Title level={2}>6</Title>
                                        <Title level={2}>7</Title>
                                        <Title level={2}>:</Title>
                                    </Flex>
                                    <Flex vertical>
                                        <Title level={2}>:</Title>
                                        <Title level={2}>:</Title>
                                        <Title level={2}>:</Title>
                                        <Title level={2}></Title>
                                    </Flex>
                                    <Flex style={{width: 160}} align="center" vertical>
                                        <Title level={2}>{formatCheckpoint(4)}</Title>
                                        <Title level={2}>{formatCheckpoint(5)}</Title>
                                        <Title level={2}>{formatCheckpoint(6)}</Title>
                                        <Title level={2}>{formatCheckpoint(7)}</Title>
                                    </Flex>
                                </Flex>
                            </Flex>
                        </ConfigProvider>
                        {/* Editar/SAlvar checkpoints */}
                        <Flex gap="large" justify="space-between">
                            <Flex gap="large">
                                <Search
                                    addonBefore={checkpointSelector}
                                    placeholder="Novo valor"
                                    size="large"
                                    enterButton="Atualizar"
                                    onSearch={e => updatedCheckpoint(e)}
                                    style={{width: 450}}
                                />
                            </Flex>
                            <Button type="Add" text="Adicionar tempo" onClick={saveTime} />
                        </Flex>
                        <Flex gap="large" justify="right">
                            <Button type="Delete" text="Apagar" onClick={apagarTentativa} />
                            <Button type="Salvar" text="Salvar" onClick={adicionarTentativa} />
                        </Flex>
                    </Flex>
                <Flex style={{width: "100%"}} justify="right" gap={"middle"}>
                    <Button text={"Sorteio"} onClick={handleSorteio}/>
                    <Button text={"Ranking"} onClick={handleRanking}/>
                </Flex>
                </Flex>
            </Flex>
            <Drawer
                title="Sorteio"
                placement={"right"}
                onClose={handleSorteio}
                open={abrirSorteio}
                size="large"
            >
                <SorteioDrawer />
            </Drawer>
            <Drawer
                title="Ranking"
                placement={"right"}
                onClose={handleRanking}
                open={abrirRanking}
                width="900"
            >
                <Ranking />
            </Drawer>

        </>
    );
}

export default Cronometro;