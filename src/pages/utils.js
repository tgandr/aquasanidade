import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStopwatch, faChevronDown, faChevronUp, faCheck } from "@fortawesome/free-solid-svg-icons";

export const CoagulationTimer = ({ formAnalysis, handleAnalysisChange }) => {
    const [timer, setTimer] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [status, setStatus] = useState("Iniciar");
    const [showTimer, setShowTimer] = useState(false);
    const timerInterval = useRef(null);

    useEffect(() => {
        if (isActive) {
            timerInterval.current = setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000);
        } else {
            clearInterval(timerInterval.current);
        }
        return () => clearInterval(timerInterval.current);
    }, [isActive]);

    const handleMainButton = () => {
        if (status === "Iniciar") {
            setStatus("Parar");
            setIsActive(true);
        } else if (status === "Parar") {
            setStatus("Salvar");
            setIsActive(false);
        } else if (status === "Salvar") {
            handleSave();
            setStatus("Iniciar");
        }
    };

    const handleReset = () => {
        clearInterval(timerInterval.current);
        setTimer(0);
        setIsActive(false);
        setStatus("Iniciar");
        handleAnalysisChange({ target: { name: "tempoCoagulacao", value: 0 } });
    };

    const handleSave = () => {
        handleAnalysisChange({ target: { name: "tempoCoagulacao", value: timer } });
    };

    const toggleTimerVisibility = () => {
        setShowTimer((prev) => !prev);
    };

    return (
        <div className="coagulation-timer-container">
            <h3>Tempo de Coagulação da Hemolinfa (em segundos)</h3>

            <div className="input-section">
                {/* <label htmlFor="tempoCoagulacao">Inserir Tempo Manualmente:</label> */}
                <div className="input-with-icon">
                    <input
                        type="number"
                        name="tempoCoagulacao"
                        value={formAnalysis.tempoCoagulacao}
                        onChange={handleAnalysisChange}
                        required
                    />
                    <FontAwesomeIcon
                        icon={faStopwatch}
                        className="toggle-icon-clock"
                        title="Abrir Cronômetro"
                        onClick={toggleTimerVisibility}
                    />
                    <FontAwesomeIcon
                        icon={showTimer ? faChevronUp : faChevronDown}
                        className="chevron-icon-clock"
                        onClick={toggleTimerVisibility}
                    />
                </div>
            </div>

            {showTimer && (
                <div className="timer-section">
                    <div className="timer-display">
                        {String(timer).padStart(2, "0")}s
                    </div>
                    <div className="timer-buttons">
                        <button
                            type="button"
                            className={`timer-button ${status.toLowerCase()}`}
                            onClick={handleMainButton}
                        >
                            {status}
                        </button>

                        <button
                            type="button"
                            className="timer-button reset"
                            onClick={handleReset}
                            disabled={timer === 0}
                        >
                            Resetar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export const CheckScreen = () => {
    return (
        <div className="popup-sanity">
            {console.log("check")}
            <div className="popup-inner-check">
                <FontAwesomeIcon icon={faCheck} size="4x" />
            </div>
        </div>
    )
};

export const ShowZoomPopup = ({ closeZoomPopup, zoomImageSrc }) => {
    return (
        <div className="zoom-popup">
            <div className="zoom-popup-inner">
                <button className="close-zoom-popup" onClick={closeZoomPopup}>×</button>
                <img src={zoomImageSrc} alt="Zoomed view" className="zoom-image" />
            </div>
        </div>
    )
};

export const formatDate = (dateString) => {
    if (!dateString) return "Data não informada";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
};
