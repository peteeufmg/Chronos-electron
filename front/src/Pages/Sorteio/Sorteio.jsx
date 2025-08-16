import { Button, Flex, message, Popconfirm, Select, Table, Transfer } from "antd";
import { useEffect, useState } from "react";

import api from "../../Services/api";

function Sorteio() {
	const [messageApi, contextHolder] = message.useMessage();

	const [targetKeys, setTargetKeys] = useState([]);
	// --- ALTERAÇÃO: Iniciar estados dos Selects com null para o placeholder funcionar corretamente ---
	const [categoria, setCategoria] = useState(null); 
	const [etapa, setEtapa] = useState(null);
	const [bateria, setBateria] = useState(null);
	
	const [equipes, setEquipes] = useState([]);
	const [equipesParaSorteio, setEquipesParaSorteio] = useState([]);
	const [equipesSorteadas, setEquipesSorteadas] = useState([]);

	const [loading, setLoading] = useState(false);
	const [isSorteioExistente, setIsSorteioExistente] = useState(false);

	useEffect(() => {
		// Evita buscar quando a categoria não está definida (é null)
		if (categoria === null) {
			setEquipes([]); // Limpa as equipes se nenhuma categoria for selecionada
			return;
		};

		const listarEquipes = async () => {
		const query = { categoria };
		try {
			const response = await api.get("/equipe", { params: query });
			const dataComChave = response.data.map(equipe => ({
			...equipe,
			key: equipe.id,
			}));
			setEquipes(dataComChave);
		} catch (error) {
			messageApi.error("Falha ao buscar equipes: " + error.message);
		}
		};

		listarEquipes();
	}, [categoria, messageApi]);

	useEffect(() => {
    const buscarSorteioExistente = async () => {
      try {
        const response = await api.get("/sorteio", { params: { categoria, etapa, bateria } });
        // Sorteio encontrado, atualiza a tabela
        const equipesDoBanco = response.data.map(equipe => ({ ...equipe, key: equipe.id }));
        setEquipesSorteadas(equipesDoBanco);
        setIsSorteioExistente(true);
        messageApi.info("Um sorteio existente foi carregado.");
      } catch (error) {
        // Se o erro for 404, significa que não há sorteio, o que é normal. Limpamos a tabela.
        if (error.response && error.response.status === 404) {
          setEquipesSorteadas([]);
          setIsSorteioExistente(false);
        } else {
          // Outros erros são reportados
          messageApi.error("Erro ao buscar sorteio existente.");
        }
      }
    };

    // Só executa a busca se todos os 3 campos estiverem preenchidos
    if (categoria !== null && etapa !== null && bateria !== null) {
		buscarSorteioExistente();
		} else {
		// Se algum campo for desmarcado, limpa a tabela
		setEquipesSorteadas([]);
		setIsSorteioExistente(false);
		}
	}, [categoria, etapa, bateria, messageApi]);

	const handleCategoriaChange = (valor) => {
		setCategoria(valor);
		setTargetKeys([]);
		setEquipesParaSorteio([]);
		setEquipesSorteadas([]);
	};

	const handleTransferChange = (nextTargetKeys) => {
		setTargetKeys(nextTargetKeys);
		const equipesSelecionadas = equipes.filter(equipe => nextTargetKeys.includes(equipe.key));
		setEquipesParaSorteio(equipesSelecionadas);
	};

	const handleFilterOption = (inputValue, option) => {
		return option.nome.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
	};

	const handleSortear = () => {
		if (equipesParaSorteio.length < 2) {
		messageApi.warning("Selecione pelo menos duas equipes para realizar o sorteio.");
		return;
		}
		const arrayParaSortear = [...equipesParaSorteio];
		for (let i = arrayParaSortear.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arrayParaSortear[i], arrayParaSortear[j]] = [arrayParaSortear[j], arrayParaSortear[i]];
		}
		setEquipesSorteadas(arrayParaSortear);
	};

	// --- NOVA FUNÇÃO: Enviar dados do sorteio para o back-end ---
	const handleSalvarSorteio = async () => {
		// 1. Validação dos dados
		if (categoria === null || etapa === null || bateria === null) {
			messageApi.error("Por favor, selecione Categoria, Etapa e Bateria.");
			return;
		}
		if (equipesSorteadas.length === 0) {
			messageApi.error("Nenhuma equipe foi sorteada. Realize o sorteio antes de salvar.");
			return;
		}

		// 2. Define o estado de carregamento
		setLoading(true);

		// 3. Monta o corpo da requisição (payload)
		const payload = {
			categoria,
			etapa,
			bateria,
			equipesSorteadas // O array já contém os objetos com 'id'
		};

		try {
			// 4. Envia a requisição para a API
			const response = await api.post("/sorteio", payload);
			messageApi.success(response.data.message);
			// Opcional: Limpar a tela após salvar com sucesso
			// setEquipesSorteadas([]);
		} catch (error) {
			// 5. Trata os erros da API
			// O back-end pode enviar uma mensagem de erro específica no `error.response.data.message`
			const errorMessage = error.response?.data?.message || "Erro ao salvar o sorteio.";
			messageApi.error(errorMessage);
		} finally {
			// 6. Finaliza o estado de carregamento, independentemente do resultado
			setLoading(false);
		}
	};

	const handleApagarSorteio = async () => {
		setLoading(true);
		try {
		const response = await api.delete("/sorteio", { params: { categoria, etapa, bateria } });
		messageApi.success(response.data.message);
		// Limpa a tela após apagar
		setEquipesSorteadas([]);
		setIsSorteioExistente(false);
		} catch (error) {
		const errorMessage = error.response?.data?.message || "Erro ao apagar o sorteio.";
		messageApi.error(errorMessage);
		} finally {
		setLoading(false);
		}
	};

	// NOVA CONFIGURAÇÃO: Define as colunas da tabela de resultados
	const colunasTabela = [
		{
		title: '#',
		// O 'render' nos dá acesso ao índice da linha, que usamos para a posição
		render: (text, record, index) => index + 1,
		width: 40, // Define uma largura fixa para a coluna de posição
		align: "center"
		},
		{
		title: 'Equipe',
		dataIndex: 'nome', // Pega a propriedade 'nome' de cada item do dataSource
		},
	];

	return (
		<Flex gap={"25px"} vertical>
			{contextHolder}
			<Flex justify="center" gap={"50px"}>
				<Flex align="center" gap={"20px"} vertical>
					<Select
						value={categoria}
						style={{ width: 250 }}
						onChange={handleCategoriaChange}
						options={[
							{ value: 0, label: "Avançada" },
							{ value: 1, label: "Mirim" },
						]}
						placeholder="Categoria"
					/>
					<Transfer
						dataSource={equipes}
						showSearch
						filterOption={handleFilterOption}
						targetKeys={targetKeys}
						onChange={handleTransferChange}
						render={item => item.nome}
						// ADICIONADO: Desabilita o Transfer se um sorteio já foi carregado do banco
						disabled={isSorteioExistente}
						listStyle={{
							width: 250,
							height: 500,
						}}
					/>
				</Flex>
				<Flex align="center" gap={"20px"} vertical>
					<Flex gap={"20px"}>
						<Select
							value={etapa}
							style={{ width: 150 }}
							onChange={e => setEtapa(e)}
							options={[
								{ value: 0, label: "Classificatória" },
								{ value: 1, label: "Repescagem" },
								{ value: 2, label: "Final" },
								{ value: 3, label: "Arrancada" }
							]}
							placeholder="Etapa"
						/>
						<Select
							value={bateria}
							style={{ width: 110 }}
							onChange={e => setBateria(e)}
							options={[
								{ value: 0, label: "Bateria 1" },
								{ value: 1, label: "Bateria 2" },
								{ value: 2, label: "Bateria 3" },
							]}
							placeholder="Bateria"
						/>
						<Button 
							onClick={handleSortear}
							// ADICIONADO: Desabilita o botão se um sorteio já foi carregado
							disabled={isSorteioExistente}
						>
							Sortear
						</Button>
					</Flex>
					
					<Table 
						columns={colunasTabela}
						dataSource={equipesSorteadas}
						rowKey="key"
						pagination={false}
						style={{width: "400px"}}
						scroll={{
							y: "390px",
						}}
						bordered
					/>
					<Flex gap={"20px"}>
						{/* ALTERADO: Botão de apagar só aparece se houver um sorteio existente */}
						{isSorteioExistente && (
							<Popconfirm
								title="Apagar o sorteio"
								description="Você tem certeza que quer apagar este sorteio?"
								onConfirm={handleApagarSorteio}
								okText="Sim"
								cancelText="Não"
							>
								<Button 
									type="primary" 
									danger
									loading={loading}
									disabled={loading}
								>
									Apagar
								</Button>
							</Popconfirm>
						)}
						<Button 
							onClick={handleSalvarSorteio}
							// ALTERADO: Botão de salvar é desabilitado se um sorteio já existe
							disabled={loading || isSorteioExistente}
						>
							Salvar
						</Button>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
}

export default Sorteio;