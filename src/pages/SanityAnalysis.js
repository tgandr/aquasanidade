import React, { useState, useEffect } from 'react';
import '../styles/SanityAnalysis.css';
import Form from './Form';
import { v4 as uuidv4 } from 'uuid';
import { generatePDF } from './AnalysisReport';
import iconShrimp from '../assets/images/icon_shrimp.png';
import { FaFilePdf, FaTrashAlt } from "react-icons/fa";
import { formatDate } from './utils';
import CountingPls from './CountingPls';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyringe, faCamera } from '@fortawesome/free-solid-svg-icons';

const SanityAnalysis = () => {
    const [showFormP, setShowFormP] = useState(false);
    const [showAnalysisPopupPrevious, setShowAnalysisPopupPrevious] = useState(false);
    const [farms, setFarms] = useState([]);
    const [showNewFarmPopup, setShowNewFarmPopup] = useState(false);
    const [showForm, setShowForm] = useState(true);
    const [showNewPond, setShowNewPond] = useState(false);
    const [showCounting, setShowCounting] = useState(false);
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
    const [presentation, setPresentation] = useState(true);
    const [showReports, setShowReports] = useState(false);

    const handleStartSample = (e) => {
        e.preventDefault();
        setShowAnalysisPopupPrevious(false);
        setShowForm(true)
        setShowFormP(true);
    };

    useEffect(() => {
        const farms = JSON.parse(localStorage.getItem('farmsList')) || [];
        setFarms(farms);
    }, [showNewFarmPopup, showReports, showForm, showAnalysisPopupPrevious]);

    useEffect(() => {
        const farmsList = JSON.parse(localStorage.getItem('farmsList'));
        if (farmsList) {
            const farm = farmsList.find(farm => farm.id === analysisId.id);
            if (farm) {
                setPonds(farm.ponds)
            }
        }
    }, [showNewPond, analysisId, showForm, showReports]);

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


    const [farmsList, setFarmsList] = useState([]);

    useEffect(() => {
        const farms = JSON.parse(localStorage.getItem("farmsList")) || [];
        setFarmsList(farms);
    }, [showNewFarmPopup, showReports, showForm, showAnalysisPopupPrevious]);

    const confirmDelete = (farmId, pondId) => {
        if (window.confirm("Tem certeza que deseja excluir este viveiro? Essa ação não pode ser desfeita.")) {
            deletePond(farmId, pondId);
        }
    };

    const deletePond = (farmId, pondId) => {
        const updatedFarmsList = farmsList.map(farm => {
            if (farm.id === farmId) {
                return {
                    ...farm,
                    samples: farm.samples.filter(pond => pond.pond !== pondId)
                };
            }
            return farm;
        }).filter(farm => farm.samples.length > 0); // Remove fazendas sem viveiros

        localStorage.setItem("farmsList", JSON.stringify(updatedFarmsList));
        setFarmsList(updatedFarmsList);
    };

    return (
        <>
            {presentation &&
                <div className="presentation-container">
                    <img
                        src={require("../assets/images/morada_nova-02.jpg")}
                        alt="Morada Nova"
                        className="presentation-image"
                    />
                    <img
                        src={iconShrimp}
                        alt='ícone camarão'
                        style={{ width: '100px' }}
                    />
                    <h2>Aqua Sanidade</h2>
                    <p>Utilize esta ferramenta para registrar e analisar dados de análises presuntivas em camarões.</p>
                    <div>
                        Desenvolvido pelo Prof. Thiago Silva
                        <a href="http://lattes.cnpq.br/0867464831177008" target="_blank" rel="noopener noreferrer">
                            <img
                                src={require("../assets/images/logolattes.gif")}
                                alt="Currículo Lattes"
                                className="lattes-logo"
                            />
                        </a>
                        <br /><br />
                        Equipe:<br />
                        Caio Rodrigues<br />
                        Jardel Batista<br />
                        Jonata de Paulo<br />
                        Luis Davi Sampaio<br />
                        Messias de Oliveira Filho<br />
                    </div>
                    <br /><br />
                    {/* <button
                        className=""
                        onClick={() => (setPresentation(false),
                            setShowAnalysisPopupPrevious(true))}>
                        Análise Presuntiva&nbsp;
                        <FontAwesomeIcon icon={faSyringe} className="icon-plus" />
                    </button>
                    <button
                        className=""
                        onClick={() => (setPresentation(false),
                            setShowCounting(true))}>
                        Contagem de PLs&nbsp;
                        <FontAwesomeIcon icon={faCamera} className="icon-plus" />
                    </button> */}
                    <div className="analysis-buttons-start">
                        <button
                            className="analysis-button-start presuntiva"
                            onClick={() => (setPresentation(false), setShowAnalysisPopupPrevious(true))}
                        >
                            Análise Presuntiva&nbsp;
                            <FontAwesomeIcon icon={faSyringe} className="icon-plus" />
                        </button>
                        <button
                            className="analysis-button-start contagem"
                            onClick={() => (setPresentation(false), setShowCounting(true))}
                        >
                            Contagem de PLs&nbsp;
                            <FontAwesomeIcon icon={faCamera} className="icon-plus" />
                        </button>
                    </div>

                </div>}

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
                                    onClick={() => (setShowAnalysisPopupPrevious(false), setPresentation(true))}>
                                    Voltar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => (setShowReports(true), setShowAnalysisPopupPrevious(false))}
                                    className="first-class-button">
                                    Relatórios</button>
                                <button
                                    type="submit"
                                    className="first-class-button">
                                    Lançar observações</button>
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

            {showFormP && <Form
                analysisId={analysisId}
                setShowAnalysisPopupPrevious={setShowAnalysisPopupPrevious}
                showForm={showForm}
                setShowForm={setShowForm} />
            }

            {showReports &&
                <div className="popup-sanity">
                    <div className="popup-inner-sanity">
                        <h3>Relatórios</h3>

                        {farmsList.map(farm => (
                            <div key={farm.id} className="farm-section">
                                <h4>{farm.name}</h4>
                                {farm.samples && farm.samples.map(pondData => (
                                    <div key={pondData.pond} className="pond-section">
                                        <h5>Viveiro {farm.ponds.filter(p => p.id === pondData.pond)[0].pond} -
                                            {formatDate(pondData.date)}
                                        </h5>

                                        <div className="button-group">
                                            <button
                                                className="pdf-button"
                                                onClick={() => generatePDF(farm.name,
                                                    pondData.pond,
                                                    pondData.samples,
                                                    pondData.date,
                                                    farm.ponds.filter(p => p.id === pondData.pond)[0].pond)}>
                                                <FaFilePdf />
                                            </button>

                                            <button
                                                className="delete-button"
                                                onClick={() => confirmDelete(farm.id, pondData.pond)}>
                                                <FaTrashAlt />
                                            </button>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        ))}
                        <br /><br />
                        <button
                            type="button"
                            className="cancel-button"
                            style={{ alignSelf: 'center' }}
                            onClick={() => (setShowReports(false), setShowAnalysisPopupPrevious(true))}>
                            Voltar
                        </button>

                    </div>
                </div>
            }

            {showCounting && <CountingPls
                setPresentation={setPresentation}
                setShowCounting={setShowCounting} />}
        </>
    );
};

export default SanityAnalysis;
