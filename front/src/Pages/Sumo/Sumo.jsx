import { Alert, ConfigProvider, Divider, Flex, Input, message, Select, Space, Typography } from "antd";

import Button from "../../Components/Button";
import { Container, Frame } from "./style";
import { useEffect, useRef, useState } from "react";

import api from '../../Services/api';

const { Title, Text } = Typography;

function Sumo() {
    const [timer, isTargetAchieved] = useTimer({precision: "secondTenths", startValues: {secondTenths: 0, seconds: 0}});
    const [fetchedTeams, setFetchedTeams] = useState([]);
    const [teamsToDisplay, setTeamsToDisplay] = useState([]);
    const [competitors, setCompetitors] = useState([]);
    const [roundWinners, setRoundWinners] = useState([]);
    const [fase, setFase] = useState(1);
    const [round1, setRound1] = useState([0,0,0]);
    const [round2, setRound2] = useState([0,0,0]);
    const [round3, setRound3] = useState([0,0,0]);

    const [time, setTime] = useState(0); // Armazena o tempo em milissegundos
    const [isRunning, setIsRunning] = useState(false); // Controla se o cronômetro está rodando

    const startTimeRef = useRef(0);

    const [messageApi, contextHolder] = message.useMessage();
    
    const secondTenths = timer.getTimeValues().secondTenths;
    const seconds = timer.getTimeValues().seconds;
    const minutes = timer.getTimeValues().minutes;

    const startTimer = () => timer.start();
    const pauseTimer = () => timer.pause();
    const restartTimer = () => timer.stop();

    // Código timer
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
    }

    const onStop = () => {
        setIsRunning(false);
    }

    const onReset = () => {
        onStop();
        setTime(0);
    }

    // Função para formatar o tempo como MM:SS:MIL
    const mlsToString = (time) => {
        const minutes = String(Math.floor((time / 60000) % 60)).padStart(2, "0");
        const seconds = String(Math.floor((time / 1000) % 60)).padStart(2, "0");
        const milliseconds = String((time % 1000)).padStart(3, "0");
        return `${minutes}:${seconds}:${milliseconds}`;
    };

    const fetchData = async () => {
        try {
          const response = await api.get('/equipes/sumo');
          setFetchedTeams(response.data);
          setTeamsToDisplay(response.data);
        } catch (error) {
          console.error("Erro ao buscar os dados:", error);
        }
    };

    const handleCompetitorsSelect = (team, index) => {
        // Create a new array instead of modifying the existing one
        const updatedCompetitors = [...competitors];
        
        if (index === 1) {
            updatedCompetitors[0] = team;
        } else if (index === 2) {
            updatedCompetitors[1] = team;
        }
        
        setCompetitors(updatedCompetitors); // Update the state with the new array
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleWinnerSelect = (e, index) => {
        const updateWinners = [...roundWinners];

        switch (index) {
            case 1:
                updateWinners[0] = e;
            case 2:
                updateWinners[1] = e;
            case 3:
                updateWinners[2] = e;
        }

        setRoundWinners(updateWinners);
    };

    const salvarPartida = () => {
        const tempo1 = round1[1]*60000 + round1[2]*1000 + round1[3]*100;
        const tempo2 = round2[1]*60000 + round2[2]*1000 + round2[3]*100;
        const tempo3 = round3[1]*60000 + round3[2]*1000 + round3[3]*100;

        const tempos = [tempo1, tempo2, tempo3];

        // Mapear os times selecionados para obter objetos contendo apenas _id e nome
        const teamObjects = competitors.map(competitor => {
            const team = teamsToDisplay.find(t => t.nome === competitor); // Encontrar o time correspondente
            return team ? { _id: team._id, nome: team.nome } : null; // Retornar apenas _id e nome
        }).filter(Boolean); // Remover valores nulos ou indefinidos

        if (teamObjects.length !== competitors.length) {
            console.error("Erro: alguns times não foram selecionados corretamente.");
            return;
        }

        const req = {
            tempos,  // Array de tempos para os rounds
            roundWinners,
            times: teamObjects,  // Lista de times selecionados com _id e nome
            fase: fase
        };

        const sendData = async () => {
            try {
                const response = await api.post('/sumo', req);
                alert("Enviado com sucesso");
            } catch (error) {
              console.error("Erro ao buscar os dados:", error);
            }
        };
        sendData();

    };
    
    return(
        <ConfigProvider 
        theme={{
                components: {
                    Typography: {
                        titleMarginBottom: 0,
                        titleMarginTop: 0
                    },
                    Select: {
                        fontSize: 13
                    }
                }
        }}>
            <Container>
                {contextHolder}
                <Frame>
                    <Flex vertical gap="large">
                        {/* Conteúdo cronometro */}
                        <Flex gap="large" justify="center">
                            <Flex gap="middle" align="center">
                                <Title level={3}>Etapa:</Title>
                                <Select defaultValue={1} onChange={e => setFase(e)} options={[{ value: 1, label: 'Fase de grupos' }, { value: 2, label: 'Final' }]} style={{width: 160}}></Select>
                            </Flex>
                            <Title> | </Title>
                            <Flex gap="middle" align="center">
                                <Title level={3}>Equipes:</Title>
                                <Select placeholder="Selecione uma equipe" style={{width: 200}} onSelect={e => handleCompetitorsSelect(e, 1)} options={teamsToDisplay.map(e => ({value: e.nome, title: e._id}))}></Select>
                                <Title level={3}>VS</Title>
                                <Select placeholder="Selecione uma equipe" style={{width: 200}} onSelect={e => handleCompetitorsSelect(e, 2)} options={teamsToDisplay.map(e => ({value: e.nome, title: e._id}))}></Select>
                            </Flex>
                        </Flex>
                        {/* Ordem das equipes */}
                        <Flex gap={50} align="center" vertical>
                            {/* Cronometro */}
                            <Flex gap="middle" align="center" vertical>
                                <Title style={{width: 480}} >Cronomêtro: {mlsToString(time)}</Title>
                                <Space>
                                    <Button type="Play" text="Iniciar" onClick={onStart} />
                                    <Button type="Pause" text="Pause" onClick={onStop} />
                                    <Button type="Restart" text="Reset" onClick={onReset} />
                                </Space>
                            </Flex>
                            {/* Inputs ganhador */}
                            <Flex gap="middle" align="center" vertical>
                                <Flex gap="small">
                                    <Flex align="center" gap="middle">
                                        <Title level={3}>Round 1:</Title>
                                        <Flex align="center" gap="small">
                                            <Input.OTP length={2} defaultValue="00" onChange={(e) => {const i = round1; i[1] = e; setRound1[i]}}></Input.OTP>
                                            <Title level={2}>:</Title>
                                            <Input.OTP length={2} defaultValue="00" onChange={(e) => {const i = round1; i[2] = e; setRound1[i]}}></Input.OTP>
                                            <Title level={2}>:</Title>
                                            <Input.OTP length={3} defaultValue="000" onChange={(e) => {const i = round1; i[3] = e; setRound1[i]}}></Input.OTP>
                                        </Flex>
                                        <Select placeholder="Selecione o vencedor" options={competitors.map((e) => ({value: e}))} onChange={e => handleWinnerSelect(e, 1)}/>
                                    </Flex>
                                </Flex>
                                <Flex gap="small" vertical>
                                    <Flex align="center" gap="middle">
                                        <Title level={3}>Round 2:</Title>
                                        <Flex align="center" gap="small">
                                            <Input.OTP length={2} defaultValue="00" onChange={(e) => {const i = round2; i[1] = e; setRound2[i]}}></Input.OTP>
                                            <Title level={2}>:</Title>
                                            <Input.OTP length={2} defaultValue="00" onChange={(e) => {const i = round2; i[2] = e; setRound2[i]}}></Input.OTP>
                                            <Title level={2}>:</Title>
                                            <Input.OTP length={3} defaultValue="000" onChange={(e) => {const i = round2; i[3] = e; setRound2[i]}}></Input.OTP>
                                        </Flex>
                                        <Select placeholder="Selecione o vencedor" options={competitors.map((e) => ({value: e}))} onChange={e => handleWinnerSelect(e, 2)}/>
                                    </Flex>
                                </Flex>
                                <Flex gap="small" vertical>
                                    <Flex align="center" gap="middle">
                                        <Title level={3}>Round 3:</Title>
                                        <Flex align="center" gap="small">
                                            <Input.OTP length={2} defaultValue="00" onChange={(e) => {const i = round3; i[1] = e; setRound2[i]}}></Input.OTP>
                                            <Title level={2}>:</Title>
                                            <Input.OTP length={2} defaultValue="00" onChange={(e) => {const i = round3; i[2] = e; setRound2[i]}}></Input.OTP>
                                            <Title level={2}>:</Title>
                                            <Input.OTP length={3} defaultValue="000" onChange={(e) => {const i = round3; i[3] = e; setRound2[i]}}></Input.OTP>
                                        </Flex>
                                        <Select placeholder="Selecione o vencedor" options={competitors.map((e) => ({value: e}))} onChange={e => handleWinnerSelect(e, 3)}/>
                                    </Flex>
                                </Flex>
                            </Flex>
                            <Button type="Salvar" text="Salvar" onClick={salvarPartida} />
                        </Flex>
                    </Flex>
                </Frame>
            </Container>
        </ConfigProvider>
    );
}

export default Sumo;