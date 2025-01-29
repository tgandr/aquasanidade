import React, { useState, useEffect } from 'react';
import '../styles/SanityAnalysis.css';
import Form from './Form';
import { v4 as uuidv4 } from 'uuid';
import AnalysisReport from './AnalysisReport';

const SanityAnalysis = () => {
    const [showFormP, setShowFormP] = useState(false);
    const [showAnalysisPopupPrevious, setShowAnalysisPopupPrevious] = useState(true);
    const [farms, setFarms] = useState([]);
    // const [storedPonds, setStoredPonds] = useState([]);
    const [showNewFarmPopup, setShowNewFarmPopup] = useState(false);
    const [showNewPond, setShowNewPond] = useState(false);
    const [analysisId, setAnalysisId] = useState({
        farm: '',
        area: '',
        id: '',
        origin: '',
        pond: '',
        start: '',
        date: new Date().toISOString().split('T')[0],
        shrimpsPinned: false
    });
    const [ponds, setPonds] = useState([]);

    const handleStartSample = (e) => {
        e.preventDefault();
        setShowAnalysisPopupPrevious(false);
        setShowFormP(true);
    };

    useEffect(() => {
        const farms = JSON.parse(localStorage.getItem('farmsList')) || [];
        setFarms(farms);
    }, [showNewFarmPopup]);

    useEffect(() => {
        const farmsList = JSON.parse(localStorage.getItem('farmsList'));
        if (farmsList) {
            const farm = farmsList.find(farm => farm.id === analysisId.id);
            if (farm) {
                setPonds(farm.ponds)
            }
        }
    }, [showNewPond, analysisId]);

    useEffect(() => {
        if (analysisId.farm === "custom") {
            setShowNewFarmPopup(true);
            setAnalysisId({ ...analysisId, farm: "" });
        }
    }, [analysisId]);

    useEffect(() => {
        if (analysisId.pond === "custom" && analysisId.farm !== "" && analysisId.farm !== "custom") {
            setShowNewPond(true);
            setAnalysisId({ ...analysisId, pond: "" });
        }
        if (analysisId.pond === "custom" && analysisId.farm === "") {
            alert("Escolha uma fazenda")
        }
    }, [analysisId]);

    const handleNewFarm = (e) => {
        setAnalysisId({ ...analysisId, farm: e.target.value });
    };

    const handleNewPond = (e) => {
        const { name, value } = e.target;
        if (name === 'new-pond') {
            setAnalysisId({ ...analysisId, pond: value });
        }
        if (name === 'area') {
            setAnalysisId({ ...analysisId, area: value });
        }

    };

    const handleNewFarmSubmit = (e) => {
        e.preventDefault();

        const id = uuidv4();
        const farmsList = JSON.parse(localStorage.getItem('farmsList')) || [];
        farmsList.push({ name: analysisId.farm, id: id });
        localStorage.setItem('farmsList', JSON.stringify(farmsList));
        setAnalysisId({ ...analysisId, id })
        setShowNewFarmPopup(false);
    };

    const handleInfos = (e) => {
        // Pega o nome da fazenda selecionada e o id associado
        const selectedFarmName = e.target.value;
        const selectedFarmId = e.target.options[e.target.selectedIndex].getAttribute('id');

        // Atualiza o estado com o nome e o id da fazenda selecionada
        setAnalysisId({
            ...analysisId,
            farm: selectedFarmName,
            id: selectedFarmId,
        });
    }

    const handleNewPondSubmit = (e) => {
        e.preventDefault();

        const { area, pond } = analysisId;
        const id = uuidv4();

        let farms = JSON.parse(localStorage.getItem('farmsList'));
        let farm = farms.find(farm => farm.id === analysisId.id);

        if (farm) {
            farm = {
                ...farm,
                ponds: farm.ponds ? [...farm.ponds, { area, pond, id }] : [{ area, pond, id }]
            };
        }
        farms = farms.filter(farm => farm.id !== analysisId.id);
        farms.push(farm);

        localStorage.setItem('farmsList', JSON.stringify(farms));
        setShowNewPond(false);
        setAnalysisId({ ...analysisId, area: '', pond: '' })
    }

    return (
        <>
            {showAnalysisPopupPrevious &&
                <div className="popup-sanity">
                    <div className="popup-inner-sanity">
                        <h3>Análise Presuntiva</h3>
                        <form onSubmit={handleStartSample} className="harv-form">
                            <label>
                                <span>Fazenda:</span>
                                <select
                                    name="farm"
                                    value={analysisId.farm}
                                    onChange={(e) => handleInfos(e)}
                                    required>
                                    <option value="">Selecione</option>
                                    {farms.map((farm, index) => (
                                        <option value={farm.name} key={index} id={farm.id}>{farm.name}</option>
                                    ))}
                                    <option value="custom">Adicionar Fazenda</option>
                                </select>
                            </label>
                            <label>
                                <span>Viveiro:</span>
                                <select
                                    name="pond"
                                    value={analysisId.pond}
                                    onChange={(e) => setAnalysisId({ ...analysisId, pond: e.target.value })}
                                    required>
                                    <option value="">Selecione</option>
                                    {ponds && ponds.length > 0 && ponds.map((pond, index) => (
                                        <option value={pond.id} key={index}>{pond.pond}</option>
                                    ))}
                                    <option value="custom">Adicionar viveiro</option>
                                </select>
                            </label>
                            <label>
                                <span>Data:</span>
                                <input
                                    type="date"
                                    name="date"
                                    value={analysisId.date}
                                    onChange={(e) => setAnalysisId({ ...analysisId, date: e.target.value })}
                                    required
                                />
                            </label>
                            <label>
                                <span style={{ textAlign: 'left' }}>Camarões grampados?</span>
                                <select
                                    name="shrimpsPinned"
                                    value={analysisId.shrimpsPinned}
                                    onChange={(e) => setAnalysisId({ ...analysisId, shrimpsPinned: e.target.value === "true" })}
                                >
                                    <option value={true}>Sim</option>
                                    <option value={false}>Não</option>
                                </select>
                            </label>

                            <br />
                            <br />
                            <br />

                            <div className="bottom-buttons">
                                <button
                                    type="button"
                                    className="cancel-button"
                                    // onClick={() => setShowAnalysisPopupPrevious({ start: false, previous: true })}>
                                    onClick={() => setShowAnalysisPopupPrevious(false)}>
                                    Voltar
                                </button>
                                <button
                                    type="submit"
                                    className="first-class-button">
                                    Lançar observações</button>
                                <button
                                    type="button"
                                    // onClick={() => AnalysisReport(JSON.parse(localStorage.getItem('history')))}
                                    
                                    className="first-class-button">
                                    Relatório</button>
                            </div>
                        </form>
                    </div>
                </div>

            }

            {showNewFarmPopup && (
                <div className="popup-sanity">
                    <div className="popup-inner-sanity">
                        <h3>Cadastrar nova fazenda</h3>
                        <form onSubmit={handleNewFarmSubmit}>
                            <label>
                                <span>Nome: </span>
                                <input
                                    type="text"
                                    name="new-farm"
                                    value={analysisId.farm}
                                    onChange={handleNewFarm}
                                    required
                                />
                            </label>
                            <br />
                            <br />
                            <br />

                            <div className="bottom-buttons">
                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() => setShowNewFarmPopup(false)}>
                                    Voltar
                                </button>
                                <button
                                    type="submit"
                                    className="first-class-button">
                                    Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {
                showNewPond &&
                <div className="popup-sanity">
                    <div className="popup-inner-sanity">
                        <h3>Adicionar viveiro</h3>
                        <form onSubmit={handleNewPondSubmit} className="form-content">
                            <label>
                                <span>Número: </span>
                                <input
                                    type="text"
                                    name="new-pond"
                                    value={analysisId.pond}
                                    onChange={handleNewPond}
                                    required
                                />
                            </label>

                            <label>
                                <span>Área: </span>
                                <input
                                    type="number"
                                    name="area"
                                    value={analysisId.area}
                                    onChange={handleNewPond}
                                    required
                                    step="0.1"
                                    min="0"
                                />
                            </label>
                            <br />
                            <br />
                            <br />

                            <div className="bottom-buttons">
                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() => setShowNewPond(false)}>
                                    Voltar
                                </button>
                                <button
                                    type="submit"
                                    className="first-class-button">
                                    Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            }

            {
                // showForm && (<Form analysisId={analysisId} />)
                showFormP && <Form analysisId={analysisId} setShowAnalysisPopupPrevious={setShowAnalysisPopupPrevious} />

            }
        </>
    );
};

export default SanityAnalysis;
