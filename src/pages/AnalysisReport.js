import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AnalysisReport = (historyData) => {
    const doc = new jsPDF({
        orientation: 'landscape'
    });

    historyData.forEach((cultivo, index) => {
        if (index !== 0) {
            doc.addPage();
        }

        doc.text(`Data de Povoamento: ${cultivo.dataPovoamento}`, 10, 10);
        doc.text(`Origem PL: ${cultivo.origemPL}`, 10, 20);
        doc.text(`Quantidade Estocada: ${cultivo.quantidadeEstocada}`, 10, 30);

        const headers = [
            "Data da Análise", "Peso", "Conformação Antenas", "Uropodos", "Necroses IMNV",
            "Tempo de Coagulação", "Análise Cefalotórax", "Integridade Tubulos",
            "Presença de Lipídeos", "Conteúdo do Trato", "Repleção do Trato",
            "Brânquias Epicomensais", "Epipodito Epicomensais", "Necrose IMNV",
            "Necrose Blackspot"
        ];

        const body = [];

        if (cultivo.sanity) {
            cultivo.sanity.forEach((sanityItem) => {
                if (sanityItem.samples) {
                    sanityItem.samples.forEach((sample) => {
                        const row = [
                            sanityItem.id.date || '',
                            sample.peso || '',
                            sample.conformacaoAntenas || '',
                            sample.uropodos || '',
                            sample.necrosesIMNV || '',
                            sample.tempoCoagulacao || '',
                            sample.analiseCefalotorax || '',
                            sample.integridadeTubulos || '',
                            sample.presencaLipideos || '',
                            sample.conteudoTrato || '',
                            sample.replecaoTrato || '',
                            sample.branquiasEpicomensais || '',
                            sample.epipoditoEpicomensais || '',
                            sample.necroseIMNV || '',
                            sample.necroseBlackspot || ''
                        ];
                        body.push(row);
                    });
                }
            });
        }

        doc.autoTable({
            head: [headers],
            body: body,
            startY: 40
        });
    });

    doc.save('relatorio.pdf');
};

export default AnalysisReport;
