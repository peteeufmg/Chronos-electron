import { Flex, Select, Table } from "antd";
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
    const [loading, setLoading] = useState([]);
    const [fetched, setFetched] = useState([]);

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
            case 1:
                setDisableHeats(false);
                break;
            case 2:
                setDisableHeats(true);
                setHeat(null);
                break;
            case 3:
                setDisableHeats(true);
                setHeat(null);
                break;
            case 4:
                setDisableHeats(true);
                setHeat(null);
                break;
        }
    }, [round]);

    // Definiação da coluna
    const colunas = [
        {
          title: 'Ordem',
          dataIndex: 'index',
          key: 'index',
          render: (text, record, index) => index + 1,
          width: 100,
          align: "center"
        },
        {
          title: 'Equipe',
          dataIndex: 'nome',
          key: 'nome',
        },
        {
          title: 'Capitão(ã)',
          dataIndex: 'capitao',
          key: 'capitao',
        },
    ];

    // Fetch do sorteio
    const fetchSorteio = async () => {
        try {
            const response = await api.get("/sorteios");
            const teamsResponse = await api.get("/equipes");
            setFetched(response.data);
            setTeams(teamsResponse.data);
        } catch (error) {
            console.log(error);
        }
    }
    
    const criarArrayOrdenado = (ordem, equipes) => {
        if (!ordem) return;
        const el = ordem.ordem
        return el.map(o => {
            const equipe = equipes.find(e => e._id === o.id);
            return equipe ? { ...equipe } : null;
        }).filter(equipe => equipe !== null); // Remove possíveis null
    };

    useEffect(() => {
        if (!fetched) return;
        const ordem = fetched.filter(e => e.bateria === heat).filter(e => e.etapa === round).filter(e => e.categoria === categoria);
        const data = criarArrayOrdenado(ordem[0], teams);
        console.log(data);
        setTableData(data);
        setLoading(false);
    }, [fetched]);

    useEffect(() => {
        fetchSorteio();
        setLoading(true);
    }, [categoria, round, heat]);

    return (
        <Flex align="center" gap="large" vertical>
            <Flex justify="left" gap="middle">
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
                    <Select.Option value={1}>Classificatória</Select.Option>
                    <Select.Option value={2} disabled={disableRepescagem}>Repescagem</Select.Option>
                    <Select.Option value={3}>Final</Select.Option>
                    <Select.Option value={4}>Arrancada</Select.Option>
                </Select>
                <Select
                    style={{ width: 120 }}
                    value={heat}
                    disabled={disableHeats}
                    onSelect={e => setHeat(e)}
                    placeholder="Bateria"
                    size="large"
                >
                    <Select.Option value={1}>Bateria 1</Select.Option>
                    <Select.Option value={2}>Bateria 2</Select.Option>
                    <Select.Option disabled={disableHeat3} value={3}>Bateria 3</Select.Option>
                </Select>
            </Flex>
            <Flex>
                <Table
                    columns={colunas} 
                    dataSource={tableData}
                    pagination={false}
                    style={{width: "600", fontWeight: 700}}
                    loading={loading}
                    scroll={{
                        y: 490
                    }}
                />
            </Flex>
        </Flex>
    )
}

export default SorteioDrawer;