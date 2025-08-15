import { ConfigProvider, Flex, message, Select, Table, Tabs, Typography } from "antd";

import api from "../../Services/api";
import { useEffect, useState } from "react";

const { Title } = Typography;

export default function Ranking() {
    const [categoria, setCategoria] = useState(null);
    const [etapa, setEtapa] = useState(null);
    const [bateria, setBateria] = useState(null);
    const [ranking, setRanking] = useState([]);
  
    const [loading, setLoading] = useState(false);

    const [messageApi, contextHolder] = message.useMessage();

	//Função para achamar alertas
	const displayMessage = (type, content) => {
        messageApi.open({
          type: type,
          content: content,
        });
    };

    const fetchRanking = async () => {
        const query = {
            categoria,
            etapa,
            bateria
        };
        try {
            const response = await api.get("/ranking", { params: query });
            setRanking(response.data);
        } catch (error) {
            
        }
    }

    useEffect(() => {
        console.log(etapa);
        if (categoria !== null && etapa !== null && bateria !== null) fetchRanking();
    }, [categoria, etapa, bateria]);


    // Definiação da coluna
	const colunas = [
        {
            title: "#",
            key: 'index',
            render: (text, record, index) => index + 1,
            align: "center",
            width: 40
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
            align: "center",
            width: 150
        },
        { 
            title: "Tempo",
            dataIndex: "tempo_total",
            key: "4",
            align: "center",
            width: 130
        },
        { 
            title: "Melhor tentativa",
            dataIndex: "melhor_tentativa",
            key: "5",
            align: "center",
            width: 180,
            responsive: ["md", "lg", "xl"]
        }
	];

    return(
        <Flex style={{width: "100%"}} gap="25px" vertical align="center">
            {contextHolder}
            <Flex style={{maxWidth: "900px"}} align="center" gap={"25px"} vertical>
                <Flex align="center" gap="middle">
                    <Select 
                        style={{ width: 200 }}
                        onChange={e => setCategoria(e)}
                        placeholder="Categoria"
                        size="large"
                    >
                        <Select.Option value={0}>Seguidor Avançado</Select.Option>
                        <Select.Option value={1}>Seguidor Mirim</Select.Option>
                    </Select>
                    <Select 
                        style={{ width: 150 }}
                        value={etapa}
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
                        value={bateria}
                        onSelect={e => setBateria(e)}
                        placeholder="Bateria"
                        size="large"
                    >
                        <Select.Option value={0}>Bateria 1</Select.Option>
                        <Select.Option value={1}>Bateria 2</Select.Option>
                        <Select.Option value={2}>Bateria 3</Select.Option>
                    </Select>
                </Flex>
                <Flex>
                    <Table
                        columns={colunas} 
                        dataSource={ranking}
                        pagination={false}
                        style={{width: "100%", fontWeight: 700}}
                        loading={loading}
                        rowKey={"nome"}
                        scroll={{
                            y: 500,
                        }}
                    />
                </Flex>
            </Flex>
        </Flex>
    )
}