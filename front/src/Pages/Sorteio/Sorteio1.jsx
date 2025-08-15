import { Flex, message, Select, Table } from "antd";
import { useEffect, useState } from "react";

import api from "../../Services/api";
import Button from "../../Components/Button";

function Sorteio1 () {
  const [categoria, setCategoria] = useState([]);
  const [round, setRound] = useState([]);
  const [heat, setHeat] = useState([]);
  const [teams, setTeams] = useState([]);

  const [disableRepescagem, setDisableRepescagem] = useState(false);
  const [disableRound, setDisableRound] = useState(false);
  const [disableHeats, setDisableHeats] = useState(false);
  const [disableHeat3, setDisableHeat3] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [sumoData1, setSumoData1] = useState([]);
  const [sumoData2, setSumoData2] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sorteios, setSorteios] = useState([]);

  const [selectedTeams, setSelectedTeams] = useState([]);

  const [messageApi, contextHolder] = message.useMessage();

	//Função para achamar alertas
	const displayMessage = (type, content) => {
        messageApi.open({
          type: type,
          content: content,
        });
    };

	// Logica para disabilitar selects
    useEffect(() => {
		setTableData([]);
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
			case 3:
				setDisableRound(true);
				setDisableHeats(true);
		}
    }, [categoria]);
    useEffect(() => {
		setTableData([]);
		setSelectedTeams([]);
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

	//Fetch de team
	const fetchTeams = async () => {
		try {
			const response = await api.get("/equipes");
			setTeams(response.data);
		} catch (error) {
			console.log(error);
			displayMessage("error", error.response.data.message);
		}
	};
	//Fetch de sorteios
	const fetchSorteios = async () => {
		try {
			const response = await api.get("/sorteios");
			setSorteios(response.data);
		} catch (error) {
			console.log(error);
			displayMessage("error", error.response.data.message);
		}
	};

	useEffect(() => {
		fetchTeams();
		fetchSorteios();
	}, []);

	// Aleatorizar um array
	function shuffleArray(array) {
		return array.sort(() => Math.random() - 0.5);
	}

	// Função sorteio
	const handleSortear = () => {
		if (round === 2 || round === 3) {
			const shuffledTeams = shuffleArray(teams.filter(obj => selectedTeams.includes(obj._id)));
			setTableData(shuffledTeams);
			return;
		}
		const shuffledTeams = shuffleArray(teams.filter(e => e.categoria === categoria));
		if (categoria === 3) {
			setSumoData1([shuffledTeams[0], shuffledTeams[1]]);
			setSumoData2([shuffledTeams[2], shuffledTeams[3]]);
			console.log(sumoData1);
			console.log(sumoData2);
		} else {
			setTableData(shuffledTeams);
		}
		setLoading(false);
	};

	const checkIfExists = () => {
		const find = sorteios.filter(e => e.categoria === categoria).filter(e => e.etapa === round).filter(e => e.bateria === heat);
		return (find.length === 0) ? false : true;
	}

	// Função salvar
	const handleSave = async () => {
		if (checkIfExists()) {
			displayMessage("error", "Já existe sorteio para tal rodada");
			return;
		}
		const dataToSave = {
			categoria: categoria,
			etapa: round,
			bateria: heat,
			ordem: tableData.map(e => ({id: e._id})),
		}
		try {
			const response = await api.post("/sorteios", dataToSave);
			
		} catch (error) {
			console.log(error);
		}
		try {
			const response = await api.get("/sorteios");
			setSorteios(response.data);
		} catch (error) {
			console.log(error);
		}
		displayMessage("success", "Sorteio enviado");
	};

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

	const colunasEquipe = [
		{
			title: 'Equipe',
			dataIndex: 'nome',
			key: 'nome',
		},
	];

	const defaultTable = <Table
		columns={colunas} 
		dataSource={tableData}
		pagination={false}
		style={{width: 800, fontWeight: 700}}
		loading={loading}
		rowKey={"_id"}
		scroll={{
			y: 450,
		}}
	/>

	const sumoTable = <Flex gap={"middle"}>
		<Table 
			columns={colunas} 
			dataSource={sumoData1}
			pagination={false}
			style={{width: 500, fontWeight: 700}}
			loading={loading}
			rowKey={"_id"}
			scroll={{
				y: 450,
			}}
		/>
		<Table 
			columns={colunas}
			dataSource={sumoData2}
			pagination={false}
			style={{width: 500, fontWeight: 700}}
			loading={loading}
			rowKey={"_id"}
			scroll={{
				y: 450,
			}}
		/>
	</Flex>;

	const selecionarParticipantes = <Flex>
		<Table 
			columns={colunasEquipe} 
			dataSource={teams.filter(e => e.categoria === categoria)}
			pagination={false}
			style={{width: 300, fontWeight: 700}}
			loading={loading}
			rowKey={"_id"}
			scroll={{
				y: 450,
			}}
			rowSelection={{
				selectedTeams,
				onChange: (value) => {setSelectedTeams(value);},
			}}
		/>
	</Flex>

  return (
	<Flex gap={"25px"} vertical>
		{contextHolder}
		<Flex align="center" gap={"20px"} vertical>
			<Flex justify="left" gap="middle">
				<Select 
					style={{ width: 200 }}
					onChange={e => setCategoria(e)}
					placeholder="Categoria"
					size="large"
				>
					<Select.Option value={1}>Seguidor Avançado</Select.Option>
					<Select.Option value={2}>Seguidor Mirim</Select.Option>
					<Select.Option value={3}>Sumô</Select.Option>
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
				<Button text="Sortear" onClick={handleSortear} />
			</Flex>
			<Flex gap={"20px"}>
				{categoria == 3 ? sumoTable : defaultTable}
				{round === 2 || round === 3 ? selecionarParticipantes : <></>}
			</Flex>
			<Button text="Salvar" type="Salvar" onClick={handleSave} />
		</Flex>
	</Flex>
  );
}

export default Sorteio1;