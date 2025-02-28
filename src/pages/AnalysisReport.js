import jsPDF from "jspdf";
import "jspdf-autotable";
import { formatDate } from './utils';

export const generatePDF = (farmName, pondId, samples, date, pond) => {

    const doc = new jsPDF({ orientation: "landscape" });
    const formattedDate = formatDate(date);
    doc.text(`Relatório de Análise Sanitária - ${farmName} - Viveiro ${pond} - ${formattedDate}`, 10, 10);

    const tableColumn = ["ID", "Peso", "Tempo Coag.", "Ctórax", "Hepatop túbs",
        "Hepatop Líps", "TD Cont", "TD repleção", "Epicom Brânq", "Epicom epipodito",
        "Necrose IMN", "Necrose Blackspot", "Deformids", "Ants-Verm", "Ants-Rug", "Uróp-Verm",
        "Uróp-Lumin", "Pigment", "Pleóps"];
    const tableRows = [];

    samples.forEach(sample => {
        const checkDeformidades = () => {
            if (sample.obsDeformidades === 'Não')
                return sample.obsDeformidades
            else return sample.obsDeformidadesDetalhe
        }
        const sampleData = [
            sample.id,
            sample.peso,
            sample.tempoCoagulacao,
            sample.analiseCefalotorax,
            sample.integridadeTubulos,
            sample.presencaLipideos,
            sample.conteudoTrato,
            sample.replecaoTrato,
            sample.branquiasEpicomensais,
            sample.epipoditoEpicomensais,
            sample.necroseIMNV,
            sample.necroseBlackspot,
            checkDeformidades(),
            sample.antenasVermelhas,
            sample.conformacaoAntenas,
            sample.uropodosAvermelhados,
            sample.uropodos,
            sample.pigmentacao,
            sample.pleopodos
        ];
        tableRows.push(sampleData);
    });

    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
    doc.save(`Relatório_${farmName}_Viveiro_${pond}.pdf`);
};


