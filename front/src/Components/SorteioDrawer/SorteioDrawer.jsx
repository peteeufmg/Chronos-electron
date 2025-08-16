import { Flex, Select, Table, message } from "antd";
import { useEffect, useState } from "react";
import api from "../../Services/api";

// Os valores das opções podem ser constantes para facilitar a manutenção
const optionsCategoria = [
    { value: 0, label: "Seguidor Avançada" },
    { value: 1, label: "Seguidor Mirim" },
];

const optionsEtapa = [
    { value: 0, label: "Classificatória" },
    { value: 1, label: "Repescagem" },
    { value: 2, label: "Final" },
    { value: 3, label: "Arrancada" }
];

const optionsBateria = [
    { value: 0, label: "Bateria 1" },
    { value: 1, label: "Bateria 2" },
    { value: 2, label: "Bateria 3" },
];


function SorteioDrawer() {
    // Hook para exibir notificações (sucesso, erro, etc.)
    const [messageApi, contextHolder] = message.useMessage();

    // Estados para controlar os valores dos filtros
    const [categoria, setCategoria] = useState(undefined);
    const [etapa, setEtapa] = useState(undefined);
    const [bateria, setBateria] = useState(undefined);

    // Estados para a tabela
    const [tableData, setTableData] = useState([]);

    // Efeito que busca os dados do sorteio na API quando os filtros mudam
    useEffect(() => {
        const fetchSorteio = async () => {
            try {
                // A API é chamada com os filtros como query params
                const response = await api.get("/sorteio", { params: { categoria, etapa, bateria } });
                
                // Adiciona uma 'key' única a cada item, necessária para a Table do Ant Design
                const dataComChave = response.data.map(equipe => ({ ...equipe, key: equipe.id }));
                setTableData(dataComChave);

            } catch (error) {
                // Um erro 404 significa que o sorteio não foi encontrado, o que é um cenário normal.
                // A tabela simplesmente ficará vazia.
                if (error.response && error.response.status === 404) {
                    setTableData([]);
                } else {
                    // Para outros erros, exibe uma notificação
                    messageApi.error("Falha ao buscar dados do sorteio.");
                    console.error("Erro ao buscar sorteio:", error);
                }
            }
        };

        // A busca só é disparada se os três filtros tiverem um valor selecionado
        if (categoria !== undefined && etapa !== undefined && bateria !== undefined) {
            fetchSorteio();
        } else {
            // Se algum filtro for limpo, a tabela é esvaziada
            setTableData([]);
        }
    }, [categoria, etapa, bateria, messageApi]);

    // Definição das colunas da tabela
    const colunas = [
        {
          title: 'Ordem',
          key: 'ordem',
          // O `render` nos permite customizar a célula. Aqui, usamos o índice do array + 1.
          render: (text, record, index) => index + 1,
          width: 100,
          align: "center"
        },
        {
          title: 'Equipe',
          dataIndex: 'nome', // Pega a propriedade 'nome' de cada objeto em 'tableData'
          key: 'nome',
        },
        // Você pode adicionar mais colunas aqui se a sua API retornar mais dados,
        // como o nome do capitão.
        // {
        //   title: 'Capitão(ã)',
        //   dataIndex: 'capitao',
        //   key: 'capitao',
        // },
    ];

    return (
        <Flex align="center" gap="large" vertical>
            {/* Elemento necessário para que as notificações do antd funcionem */}
            {contextHolder}

            {/* Container para os filtros */}
            <Flex justify="center" gap="middle">
                <Select 
                    style={{ width: 190 }}
                    value={categoria}
                    onChange={setCategoria}
                    options={optionsCategoria}
                    placeholder="Categoria"
                    allowClear // Permite limpar a seleção
                    size="large"
                />
                <Select 
                    style={{ width: 150 }}
                    value={etapa}
                    onChange={setEtapa}
                    options={optionsEtapa}
                    placeholder="Etapa"
                    allowClear
                    size="large"
                />
                <Select
                    style={{ width: 120 }}
                    value={bateria}
                    onChange={setBateria}
                    options={optionsBateria}
                    placeholder="Bateria"
                    allowClear
                    size="large"
                />
            </Flex>

            {/* Tabela de resultados */}
            <Table
                columns={colunas} 
                dataSource={tableData}
                pagination={false} // Remove a paginação
                rowKey="key" // Informa à tabela qual propriedade usar como chave
                style={{width: "600px"}}
                scroll={{
                    y: "500px",
                }}
                bordered
            />
        </Flex>
    )
}

export default SorteioDrawer;