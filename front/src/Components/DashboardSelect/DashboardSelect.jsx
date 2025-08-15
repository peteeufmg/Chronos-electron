import { DivRow2, DivRow3, DivRow6 } from './Style';
import Selecionar from '../Select/Select';
import { useState, useEffect, useRef } from 'react';
import { useTimer } from '../TimerProvider/TimerProvider';
export default function DashboardSelect() {

    const { equipeAtual, setEquipeAtual, listaDeEquipes, 
            setListaDeEquipes, setIndex, index, categoriaAtual, 
            setCategoriaAtual, etapaAtual, setEtapaAtual, bateriaAtual, 
            setBateriaAtual, setTentativasFeitas} = useTimer();

    const [listaDeEquipesPorCategoria, setListaDeEquipesPorCategoria] = useState([]);
    const [etapas, setEtapas] = useState([]);
    const [baterias, setBaterias] = useState([]);
    const [categorias, setCategorias] = useState([
        { label: "Avancado", value: 1 },
        { label: "Mirim", value: 2 },
    ]);

    useEffect(() => {
        if(categoriaAtual == 1){ // se for Avancado
            localStorage.setItem("categoriaAtual", "Avançada");
            setEtapas([
            { label: "Arrancada", value: 0 },
            { label: "Classificatoria", value: 1 },
            { label: "Repescagem", value: 2 },
            { label: "Final", value: 3 }]);
            if (etapaAtual == 1){ //Classificatoria
              localStorage.setItem("etapaAtual", "Classificatória"); 
              setBaterias([
                { label: "Bateria 1", value: 1 },
                { label: "Bateria 2", value: 2 },
                { label: "Bateria 3", value: 3 }
              ])
            }if (etapaAtual == 2){ // Repescagem
              localStorage.setItem("etapaAtual", "Repescagem");
              setBaterias([])
              //setSelectedHeat([]);
            }if (etapaAtual == 3){ // Final
              localStorage.setItem("etapaAtual", "Final");
              setBaterias([])
            }

        }else if (categoriaAtual == 2){ //Se for Mirim
            localStorage.setItem("categoriaAtual", "Mirim");
            setEtapas([
                { label: "Arrancada", value: 0 },
                { label: "Classificatoria", value: 1 },
                { label: "Final", value: 3 }])
            if (etapaAtual == 1){ //Classificatoria
              localStorage.setItem("etapaAtual", "Classificatória"); 
              setBaterias([
                { label: "Bateria 1", value: 1 },
                { label: "Bateria 2", value: 2 },
              ])
            }else if (etapaAtual == 3){ //Final
              localStorage.setItem("etapaAtual", "Final");
              setBaterias([]);
              //setSelectedHeat([]);
            }
        }
        //setSentToBack(false);
      }, [etapaAtual, categoriaAtual])
      
      useEffect(() => {
        localStorage.setItem('bateriaAtual', bateriaAtual);
      }, [bateriaAtual])

      useEffect(()=>{
        localStorage.setItem("equipeAtual", equipeAtual);
      },[equipeAtual]);

      const[value, setValue] = useState(null);
      const refValue = useRef(null);
      useEffect(()=>{
        refValue.current = value;
        setEquipeAtual(null);
        setBateriaAtual(null);
        setEtapaAtual(null);
        setTentativasFeitas(0);
      }, [value])
      const[refBateria, setBateria] = useState(false);
      useEffect(()=>{
        if(etapaAtual === 1){ //se a etapa escolhida for classificatória
            refValue.current = value;
            setBateria(false);
        }else{
            setBateria(true);
            setBateriaAtual(null);
        }
      }, [etapaAtual])

    // Fetching data once on component mount
    useEffect(() => {
        const fetchEquipes = async () => {
            try {
                const response = await fetch('http://localhost:8000/equipes', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setListaDeEquipes(data); // Update the list of teams
                    console.log(listaDeEquipes);
                } else {
                    console.error('Erro ao buscar equipes');
                }
            } catch (error) {
                console.error('Erro ao buscar equipes:', error);
            }
        };
        fetchEquipes();
    }, []); // Run only once when the component is mounted

    // Filter teams based on selected index
    useEffect(() => {
        if (index !== null && listaDeEquipes.length > 0) {
            // Filter and update teams based on the selected index
            const equipesFiltradas = listaDeEquipes
                .filter(equipe => equipe.categoria === index)
                .map(equipe => ({ label: equipe.nome, value: equipe.nome }));
            setListaDeEquipesPorCategoria(equipesFiltradas);
        }
    }, [index, listaDeEquipes]); // Run when `index` or `listaDeEquipes` changes

    return (
        <DivRow6>
            <DivRow2>
                <DivRow3>
                    <div><label htmlFor="">Categoria:</label></div>
                    <Selecionar
                        onChange={value => {setValue(value)}}
                        onSelect={value => {setCategoriaAtual(value); setIndex(value)}}
                        options={categorias}
                    />
                </DivRow3>
                <DivRow3>
                    <div><label htmlFor="">Equipe:</label></div>
                    <Selecionar
                        value={equipeAtual}
                        onSelect={e => setEquipeAtual(e)}
                        options={listaDeEquipesPorCategoria}
                    />
                </DivRow3>
                <DivRow3>
                    <div><label htmlFor="">Etapa:</label></div>
                    <Selecionar
                        value={etapaAtual}
                        onSelect = {value => setEtapaAtual(value)} 
                        options={etapas}/>
                </DivRow3>
                <DivRow3>
                    <div><label htmlFor="">Bateria:</label></div>
                    <Selecionar 
                        disabled={refBateria}
                        value={bateriaAtual}
                        onSelect={e => setBateriaAtual(e)}
                        options={baterias}/>
                </DivRow3>
            </DivRow2>
            {/*<output>tentativas restantes: 2</output>*/}
        </DivRow6>
    );
}




