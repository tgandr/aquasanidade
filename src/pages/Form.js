import React, { useState, useEffect } from 'react';
import '../styles/SanityAnalysis.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faSearchPlus } from '@fortawesome/free-solid-svg-icons';
import * as images from '../assets/images';
import morfologiaCamarao from '../assets/images/morfologia_camarao.png';
import laminas from '../assets/images/laminas.png';
import { CoagulationTimer, CheckScreen, ShowZoomPopup } from './utils';

const Form = ({ analysisId, setShowAnalysisPopupPrevious, showForm, setShowForm }) => {
    const [checkScreen, setCheckScreen] = useState(false);
    const [formAnalysis, setFormAnalysis] = useState({
        sampleId: '',
        peso: '',
        pigmentacao: '',
        conformacaoAntenas: '',
        antenasVermelhas: '',
        pleopodos: '',
        uropodos: '',
        uropodosAvermelhados: '',
        necrosesIMNV: '',
        tempoCoagulacao: '',
        analiseCefalotorax: '',
        integridadeTubulos: '',
        presencaLipideos: '',
        conteudoTrato: '',
        conteudoTratoMedio: '',
        replecaoTrato: '',
        branquiasEpicomensais: '',
        epipoditoEpicomensais: '',
        necroseIMNV: '',
        necroseBlackspot: '',
        obsDeformidades: 'Não',
        obsDeformidadesDetalhe: ''
    });

    const [showZoomPopup, setShowZoomPopup] = useState(false);
    const [zoomImageSrc, setZoomImageSrc] = useState('');
    const [saveString, setSaveString] = useState('');
    const [samples, setSamples] = useState([]);

    const saveData = (data, key) => {
        const filter = JSON.parse(localStorage.getItem('farmsList'))
            .filter((s) => s.id !== analysisId.id);
        let saveSample = JSON.parse(localStorage.getItem('farmsList'))
            .find(s => s.id === analysisId.id);
        const updateSamples = {
            pond: analysisId.pond,
            date: analysisId.date,
            samples: [...samples, { id: samples.length + 1, ...formAnalysis }]
        }

        if (saveSample.samples) {
            saveSample = [...filter, { ...saveSample, samples: [...saveSample.samples, updateSamples] }]
        } else {
            saveSample = [...filter, { ...saveSample, samples: [updateSamples] }]
        }
        localStorage.setItem('farmsList', JSON.stringify(saveSample));
        setShowForm(false);
        setShowAnalysisPopupPrevious(true);
    };

    const openZoomPopup = (imageSrc, str) => {
        setZoomImageSrc(imageSrc);
        setShowZoomPopup(true);
        setSaveString(str);
    };

    const closeZoomPopup = () => {
        setShowZoomPopup(false);
        setShowImages({ ...showImages, [saveString]: true });
        setSaveString('');
    };

    const [showImages, setShowImages] = useState({
        analiseCefalotorax: false,
        integridadeTubulos: false,
        presencaLipideos: false,
        necrosesIMNV: false,
    });

    const toggleImages = (key) => {
        setShowImages(prevState => {
            const newState = {
                ...prevState,
                [key]: !prevState[key]
            };

            if (newState[key] === false) {
                setTimeout(() => {
                    const nextElement = document.querySelector(`[name="${key}"]`);
                    if (nextElement) {
                        nextElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 500);
            }

            return newState;
        });
    };

    const handleImageClick = (num, obs) => {
        handleAnalysisChangeClick(null, obs, num.toString());
    };

    const handleAnalysisChange = (e) => {
        const { name, value } = e.target;
        setFormAnalysis(prevState => ({ ...prevState, [name]: value }));
    };

    const handleAnalysisChangeClick = (e, obs, value) => {
        e && e.preventDefault();
        setFormAnalysis({ ...formAnalysis, [obs]: value });
    };

    const handleAnalysisSubmit = (e) => {
        e.preventDefault();
        const sampleId = samples.length + 1;
        if (samples.length > 0) {
            setSamples([...samples, { id: sampleId, ...formAnalysis }]);
        } else {
            setSamples([{ id: sampleId, ...formAnalysis }]);
        }
        setFormAnalysis({
            sampleId: '',
            peso: '',
            pigmentacao: '',
            conformacaoAntenas: '',
            antenasVermelhas: '',
            pleopodos: '',
            uropodos: '',
            uropodosAvermelhados: '',
            necrosesIMNV: '',
            tempoCoagulacao: '',
            analiseCefalotorax: '',
            integridadeTubulos: '',
            presencaLipideos: '',
            conteudoTrato: '',
            conteudoTratoMedio: '',
            replecaoTrato: '',
            branquiasEpicomensais: '',
            epipoditoEpicomensais: '',
            necroseIMNV: '',
            necroseBlackspot: '',
            obsDeformidades: 'Não',
            obsDeformidadesDetalhe: ''
        });
        setShowImages({
            analiseCefalotorax: false,
            integridadeTubulos: false,
            presencaLipideos: false,
            necrosesIMNV: false,
        })
        setCheckScreen(true);
        setShowForm(false);
    };

    const onClose = () => {
        setCheckScreen(false);
        setShowForm(true);
    };

    useEffect(() => {
        if (checkScreen) {
            const timer = setTimeout(onClose, 2000);
            return () => clearTimeout(timer);
        }
    }, [checkScreen]);

    return (
        <>
            {showForm &&
                <div className="popup-sanity">
                    <div className="popup-inner-sanity">
                        <h2 className="sanity-title">Análise Presuntiva</h2>
                        <div className="main-content">
                            <form onSubmit={handleAnalysisSubmit} >
                                <div className="form-content">
                                    <h3>CONFORMAÇÃO EXTERNA</h3>
                                    <div className="images-container">
                                        <div className="image-wrapper" key="an01">
                                            <img
                                                src={morfologiaCamarao}
                                                alt="Morfologia do camarão" />
                                            <FontAwesomeIcon
                                                icon={faSearchPlus}
                                                className="zoom-icon"
                                                onClick={(e) => { e.preventDefault(); openZoomPopup(morfologiaCamarao, 'morfologiaCamarao') }}
                                            />
                                        </div>
                                    </div>
                                    <label>
                                        <div className="observacoes-container">
                                            Deformidades?
                                            <div>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        id="observacaoSim"
                                                        name="obsDeformidades"
                                                        value="Sim"
                                                        checked={formAnalysis.obsDeformidades === 'Sim'}
                                                        onChange={(e) => handleAnalysisChange(e)}
                                                    />
                                                    <span>Sim</span></label>
                                            </div>
                                            <div>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        id="observacaoNao"
                                                        name="obsDeformidades"
                                                        value="Não"
                                                        checked={formAnalysis.obsDeformidades === 'Não'}
                                                        onChange={(e) => handleAnalysisChange(e)}
                                                    />
                                                    <span>Não</span></label>
                                                <br />
                                            </div>
                                            {formAnalysis.obsDeformidades === 'Sim' && (
                                                <div className="input-container">
                                                    <label htmlFor="observacaoDetalhe">Qual:
                                                        <input
                                                            type="text"
                                                            id="observacaoDetalhe"
                                                            name="obsDeformidadesDetalhe"
                                                            value={formAnalysis.obsDeformidadesDetalhe || ''}
                                                            onChange={(e) => handleAnalysisChange(e)}
                                                        />
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                    <br />

                                    <label name="pigmentacao">
                                        <p>Pigmentação</p>
                                        {/* Ilustrar avaliação de pigmentação */}
                                        <div className="button-container">
                                            {[1, 2, 3, 4].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button ${formAnalysis.pigmentacao === num.toString() ? 'selected' : ''}`}
                                                    onClick={(e) => handleAnalysisChangeClick(e, 'pigmentacao', num.toString())}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </label>

                                    <label name="pleopodos">
                                        <p>Pleópodos</p>
                                        {/* Ilustrar avaliação de pleópodos */}
                                        <div className="button-container">
                                            {[1, 2, 3, 4].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button ${formAnalysis.pleopodos === num.toString() ? 'selected' : ''}`}
                                                    onClick={(e) => handleAnalysisChangeClick(e, 'pleopodos', num.toString())}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </label>

                                    <label>
                                        <p>Peso (em gramas):</p>
                                        <input
                                            type="number"
                                            name="peso"
                                            value={formAnalysis.peso}
                                            onChange={handleAnalysisChange}
                                            required
                                        />
                                    </label>
                                    <label>
                                        <h3>Antenas</h3>

                                        <label name="antenasVermelhas">
                                            Coloração avermelhada
                                            <div className="toggle-icon" onClick={(e) => { e.preventDefault(); toggleImages('conformacaoAntenas') }}>
                                                <FontAwesomeIcon icon={showImages.conformacaoAntenas ? faChevronUp : faChevronDown} />
                                                {showImages.conformacaoAntenas && (
                                                    <div className="images-container">
                                                        <div className="image-wrapper" key="an01">
                                                            <img
                                                                src={images["an01"]}
                                                                alt="Conformação das Antenas"
                                                                onClick={(e) => { e.preventDefault(); handleImageClick("an01", 'conformacaoAntenas') }}
                                                                style={{ cursor: 'pointer' }}
                                                            />
                                                            <FontAwesomeIcon
                                                                icon={faSearchPlus}
                                                                className="zoom-icon"
                                                                onClick={(e) => { e.preventDefault(); openZoomPopup(images["an01"], 'conformacaoAntenas') }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="button-container">
                                                {[1, 2, 3, 4].map((num) => (
                                                    <button
                                                        type="button"
                                                        key={num}
                                                        className={`analysis-button ${formAnalysis.antenasVermelhas === num.toString() ? 'selected' : ''}`}
                                                        onClick={(e) => handleAnalysisChangeClick(e, 'antenasVermelhas', num.toString())}
                                                    >
                                                        {num}
                                                    </button>
                                                ))}
                                            </div>
                                        </label>

                                        <div className="button-container-classes">
                                            {["Normais", "Quebradiças", "Rugosas"].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button-classes ${formAnalysis.conformacaoAntenas === num.toString() ? 'selected' : ''}`}
                                                    onClick={(e) => handleAnalysisChangeClick(e, 'conformacaoAntenas', num.toString())}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </label>

                                    <label>
                                        <br />
                                        <h3>Urópodos</h3>

                                        <label name="uropodosAvermelhados">
                                            Coloração avermelhada
                                            <div className="toggle-icon" onClick={(e) => { e.preventDefault(); toggleImages('uropodos') }}>
                                                <FontAwesomeIcon icon={showImages.uropodos ? faChevronUp : faChevronDown} />
                                                {showImages.uropodos && (
                                                    <div className="images-container">
                                                        {["ur01", "ur02"].map((imgKey) => (
                                                            <div className="image-wrapper" key={imgKey}>
                                                                <img
                                                                    src={images[imgKey]}
                                                                    alt={`Urópodos ${imgKey}`}
                                                                    onClick={(e) => { e.preventDefault(); handleImageClick(imgKey, 'uropodos') }}
                                                                    style={{ cursor: 'pointer' }}
                                                                />
                                                                <FontAwesomeIcon
                                                                    icon={faSearchPlus}
                                                                    className="zoom-icon"
                                                                    onClick={(e) => { e.preventDefault(); openZoomPopup(images[imgKey], 'uropodos') }}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="button-container">
                                                {[1, 2, 3, 4].map((num) => (
                                                    <button
                                                        type="button"
                                                        key={num}
                                                        className={`analysis-button ${formAnalysis.uropodosAvermelhados === num.toString() ? 'selected' : ''}`}
                                                        onClick={(e) => handleAnalysisChangeClick(e, 'uropodosAvermelhados', num.toString())}
                                                    >
                                                        {num}
                                                    </button>
                                                ))}
                                            </div>
                                        </label>

                                        <div className="button-container-classes">
                                            {["Normais", "Luminescentes"].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button-classes ${formAnalysis.uropodos === num ? 'selected' : ''}`}
                                                    onClick={(e) => handleAnalysisChangeClick(e, 'uropodos', num)}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </label>

                                    <p>________________</p>
                                    <CoagulationTimer
                                        formAnalysis={formAnalysis}
                                        handleAnalysisChange={handleAnalysisChange} />
                                    <p>________________</p>
                                    <br />

                                    <h3>OBSERVAÇÃO EM LUPA</h3>
                                    <div className="images-container">
                                        <div className="image-wrapper" key="an01">
                                            <img
                                                src={laminas}
                                                alt="Lâminas prepadrada para observação em microscópio" />
                                            <FontAwesomeIcon
                                                icon={faSearchPlus}
                                                className="zoom-icon"
                                                onClick={(e) => { e.preventDefault(); openZoomPopup(laminas, 'laminas') }}
                                            />
                                        </div>
                                    </div>

                                    <label name="analiseCefalotorax">
                                        Análise de Cefalotórax - Carapaça
                                        <div className="toggle-icon" onClick={(e) => { e.preventDefault(); toggleImages('analiseCefalotorax') }}>
                                            <FontAwesomeIcon icon={showImages.analiseCefalotorax ? faChevronUp : faChevronDown} />
                                            {showImages.analiseCefalotorax && (
                                                <div className="images-container">
                                                    {[1, 2, 3, 4].map((num) => (
                                                        <div className="image-wrapper" key={num}>
                                                            <img
                                                                key={num}
                                                                src={images[`ws0${num}`]}
                                                                alt={`carapaça com depósitos de cálcio em grau 0${num}`}
                                                                onClick={(e) => { e.preventDefault(); handleImageClick(num, 'analiseCefalotorax') }}
                                                                style={{ cursor: 'pointer' }}
                                                            />
                                                            <FontAwesomeIcon
                                                                icon={faSearchPlus}
                                                                className="zoom-icon"
                                                                onClick={(e) => { e.preventDefault(); openZoomPopup(images[`ws0${num}`], 'analiseCefalotorax') }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="button-container">
                                            {[1, 2, 3, 4].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button ${formAnalysis.analiseCefalotorax === num.toString() ? 'selected' : ''}`}
                                                    onClick={(e) => handleAnalysisChangeClick(e, 'analiseCefalotorax', num.toString())}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </label>

                                    <p>________________</p>
                                    <br />
                                    <h3>Hepatopâncreas</h3>
                                    <label name="integridadeTubulos">
                                        Integridade dos Túbulos
                                        <div className="toggle-icon" onClick={(e) => { e.preventDefault(); toggleImages('integridadeTubulos') }}>
                                            <FontAwesomeIcon icon={showImages.integridadeTubulos ? faChevronUp : faChevronDown} />
                                            {showImages.integridadeTubulos && (
                                                <div className="images-container">
                                                    {[1, 2, 3, 4].map((num) => (
                                                        <div className="image-wrapper" key={num}>
                                                            <img
                                                                src={images[`hp0${num}`]}
                                                                alt={`integridade dos túbulos em grau 0${num}`}
                                                                onClick={(e) => { e.preventDefault(); handleImageClick(num, 'integridadeTubulos') }}
                                                                style={{ cursor: 'pointer' }}
                                                            />
                                                            <FontAwesomeIcon
                                                                icon={faSearchPlus}
                                                                className="zoom-icon"
                                                                onClick={(e) => { e.preventDefault(); openZoomPopup(images[`hp0${num}`], 'integridadeTubulos') }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="button-container">
                                            {[1, 2, 3, 4].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button ${formAnalysis.integridadeTubulos === num.toString() ? 'selected' : ''}`}
                                                    onClick={(e) => handleAnalysisChangeClick(e, 'integridadeTubulos', num.toString())}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </label>

                                    <label name="presencaLipideos">
                                        Presença de Lipídeos
                                        <div className="toggle-icon" onClick={(e) => { e.preventDefault(); toggleImages('presencaLipideos') }}>
                                            <FontAwesomeIcon icon={showImages.presencaLipideos ? faChevronUp : faChevronDown} />
                                            {showImages.presencaLipideos && (
                                                <div className="images-container">
                                                    {[1, 2, 3, 4].map((num) => (
                                                        <div className="image-wrapper" key={num}>
                                                            <img
                                                                src={images[`lp0${num}`]}
                                                                alt={`presença de lipídeos em grau 0${num}`}
                                                                onClick={(e) => { e.preventDefault(); handleImageClick(num, 'presencaLipideos') }}
                                                                style={{ cursor: 'pointer' }}
                                                            />
                                                            <FontAwesomeIcon
                                                                icon={faSearchPlus}
                                                                className="zoom-icon"
                                                                onClick={(e) => { e.preventDefault(); openZoomPopup(images[`lp0${num}`], 'presencaLipideos') }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="button-container">
                                            {[1, 2, 3, 4].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button-lipids ${formAnalysis.presencaLipideos === num.toString() ? 'selected' : ''}`}
                                                    onClick={(e) => handleAnalysisChangeClick(e, 'presencaLipideos', num.toString())}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </label>

                                    <p>________________</p>
                                    <br />
                                    <h3>Trato Digestório</h3>

                                    <label name="conteudoTratoMedio">
                                        Conteúdo do Trato - Intestino Médio
                                        <div className="toggle-icon" onClick={(e) => { e.preventDefault(); toggleImages('conteudoTratoMedio') }}>
                                            <FontAwesomeIcon icon={showImages.conteudoTratoMedio ? faChevronUp : faChevronDown} />
                                            {showImages.conteudoTratoMedio && (
                                                <div className="images-container">
                                                    {[1, 2, 3, 4, 5].map((num) => (
                                                        <div className="image-wrapper" key={num}>
                                                            <img
                                                                src={images[`im0${num}`]}
                                                                alt={`conteúdo do trato em grau 0${num}`}
                                                                // onClick={(e) => { e.preventDefault(); handleImageClick(num, 'conteudoTratoMedio') }}
                                                                style={{ cursor: 'pointer' }}
                                                            />
                                                            <FontAwesomeIcon
                                                                icon={faSearchPlus}
                                                                className="zoom-icon"
                                                                onClick={(e) => { e.preventDefault(); openZoomPopup(images[`im0${num}`], 'conteudoTratoMedio') }}
                                                            />
                                                        </div>
                                                    ))}
                                                    <p>Observar:</p>
                                                    <ul className="points-list" style={{ textAlign: "left" }}>
                                                        <li>Presença de ração consumida</li>
                                                        <li>Presença de alimento natural consumido</li>
                                                        <li>Presença de detritos</li>
                                                        <li>Presença de alimento não digerido</li>
                                                        <li>Presença de necrofagia</li>
                                                        <li>Presença Cianobactérias (Synecocystis; Microcystis; Oscilatório; etc.)</li>
                                                        <li>Sintomas de Enterite Hemocítica (HE)</li>
                                                        <li>Presença de grãos de areia</li>
                                                        <li>Presença de Gregarinas</li>
                                                        <li>Presença de Nematódeos</li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                        <div className="button-container">
                                            {[1, 2, 3, 4].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button ${formAnalysis.conteudoTratoMedio === num.toString() ? 'selected' : ''}`}
                                                    onClick={(e) => handleAnalysisChangeClick(e, 'conteudoTratoMedio', num.toString())}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </label>

                                    <label name="conteudoTrato">
                                        Conteúdo do Trato - Intestino Posterior
                                        <div className="toggle-icon" onClick={(e) => { e.preventDefault(); toggleImages('conteudoTrato') }}>
                                            <FontAwesomeIcon icon={showImages.conteudoTrato ? faChevronUp : faChevronDown} />
                                            {showImages.conteudoTrato && (
                                                <div className="images-container">
                                                    {[1, 2, 3, 4].map((num) => (
                                                        <div className="image-wrapper" key={num}>
                                                            <img
                                                                src={images[`ip0${num}`]}
                                                                alt={`conteúdo do trato em grau 0${num}`}
                                                                onClick={(e) => { e.preventDefault(); handleImageClick(num, 'conteudoTrato') }}
                                                                style={{ cursor: 'pointer' }}
                                                            />
                                                            <FontAwesomeIcon
                                                                icon={faSearchPlus}
                                                                className="zoom-icon"
                                                                onClick={(e) => { e.preventDefault(); openZoomPopup(images[`ip0${num}`], 'conteudoTrato') }}
                                                            />
                                                        </div>
                                                    ))}
                                                    <p>Contar gregarinas, trofozoitos e gametócitos (quantidade de indivíduos):</p>
                                                    <ul className="points-list" style={{ textAlign: "left" }}>
                                                        <li>0-20: 1</li>
                                                        <li>21-30: 2</li>
                                                        <li>31-40: 3</li>
                                                        <li>41-50: 4</li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                        <div className="button-container">
                                            {[1, 2, 3, 4].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button ${formAnalysis.conteudoTrato === num.toString() ? 'selected' : ''}`}
                                                    onClick={(e) => handleAnalysisChangeClick(e, 'conteudoTrato', num.toString())}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </label>

                                    <label>
                                        Repleção:<br /><br />
                                        <div className="button-container">
                                            {[1, 2, 3, 4].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button-lipids ${formAnalysis.replecaoTrato === num.toString() ? 'selected' : ''
                                                        }`}
                                                    onClick={(e) => handleAnalysisChangeClick(e, 'replecaoTrato', num.toString())}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </label>
                                    <p>________________</p>
                                    <br />
                                    <h3>Presença de Epicomensais</h3>
                                    <label>
                                        Brânquias:<br /><br />
                                        <div className="button-container">
                                            {[1, 2, 3, 4].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button ${formAnalysis.branquiasEpicomensais === num.toString() ? 'selected' : ''
                                                        }`}
                                                    onClick={(e) => handleAnalysisChangeClick(e, 'branquiasEpicomensais', num.toString())}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </label>
                                    <label>
                                        Epipodito:<br /><br />
                                        <div className="button-container">
                                            {[1, 2, 3, 4].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button ${formAnalysis.epipoditoEpicomensais === num.toString() ? 'selected' : ''
                                                        }`}
                                                    onClick={(e) => handleAnalysisChangeClick(e, 'epipoditoEpicomensais', num.toString())}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </label>
                                    <p>________________</p>
                                    <br />
                                    <h3>Necroses</h3>
                                    <label>
                                        IMNV:
                                        <div className="toggle-icon" onClick={(e) => { e.preventDefault(); toggleImages('necrosesIMNV') }}>
                                            <FontAwesomeIcon icon={showImages.necrosesIMNV ? faChevronUp : faChevronDown} />
                                            {showImages.necrosesIMNV && (
                                                <div className="images-container">
                                                    <div className="image-wrapper" key="imnv01">
                                                        <img
                                                            src={images['imnv01']}
                                                            alt="necroses indicativas de IMNV"
                                                            onClick={(e) => { e.preventDefault(); handleImageClick('imnv01', 'necrosesIMNV') }}
                                                            style={{ cursor: 'pointer' }}
                                                        // https://gia.org.br/portal/doencas-que-afetam-camaroes-marinhos-e-sao-de-notificacao-obrigatoria/
                                                        />
                                                        <FontAwesomeIcon
                                                            icon={faSearchPlus}
                                                            className="zoom-icon"
                                                            onClick={(e) => { e.preventDefault(); openZoomPopup(images['imnv01'], 'necrosesIMNV') }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="button-container">
                                            {[1, 2, 3, 4].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button ${formAnalysis.necroseIMNV === num.toString() ? 'selected' : ''
                                                        }`}
                                                    onClick={(e) => handleAnalysisChangeClick(e, 'necroseIMNV', num.toString())}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </label>
                                    <label>
                                        Blackspot:<br /><br />
                                        <div className="button-container">
                                            {[1, 2, 3, 4].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    className={`analysis-button ${formAnalysis.necroseBlackspot === num.toString() ? 'selected' : ''
                                                        }`}
                                                    onClick={(e) => handleAnalysisChangeClick(e, 'necroseBlackspot', num.toString())}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </label>
                                </div>
                                <span>
                                    <button type="submit" className="add-shrimp">+</button>
                                </span>
                                <br />
                                <div className="box-buttons">

                                    <button
                                        type="button"
                                        onClick={() => (
                                            setShowForm(false),
                                            setShowAnalysisPopupPrevious(true)
                                        )}
                                        className="cancel-button">
                                        Voltar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => saveData()}
                                        className="first-class-button">
                                        Finalizar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div >
                </div >
            }

            {showZoomPopup && <ShowZoomPopup closeZoomPopup={closeZoomPopup} zoomImageSrc={zoomImageSrc} />}

            {checkScreen && <CheckScreen />}
        </>
    )
};

export default Form;