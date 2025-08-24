// função para transformar o tipo de investimento em um nome amigável
function nomeInvestimentoAmigavel(tipo) {
    switch(tipo) {
        case 'poupanca': return 'Poupança';
        case 'rendaFixa': return 'Renda Fixa';
        case 'rendaVariavel': return 'Renda Variável';
        case 'cdb': return 'CDB';
        case 'tesouro': return 'Tesouro Direto';
        case 'nubank': return 'Nubank';
        case 'inter': return 'Inter';
        case 'lci': return 'LCI';
        case 'lca': return 'LCA';
        default: return tipo;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('calcForm'); // pega o formulario
    const resultado = document.getElementById('resultado'); // pega a div onde o resultado sera exibido
    const ctx = document.getElementById('graficoInvestimento').getContext('2d'); // pega o contexto do grafico
    let grafico; // variavel para armazenar o grafico
    const tabelaDiv = document.getElementById('tabelaResultado'); // pega a div onde a tabela sera exibida

    // função para formatar valores em moeda brasileira
    function formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const valorInicial = parseFloat(document.getElementById('valorInicial').value); // pega o valor inicial
        const valorMensal = parseFloat(document.getElementById('valorMensal').value); // pega o valor mensal
        let tempo = parseInt(document.getElementById('tempo').value); // pega o tempo
        const unidadeTempo = document.getElementById('unidadeTempo').value; // pega a unidade de tempo
        const tipo = document.getElementById('tipo').value; // pega o tipo de investimento

        let mensagensErro = []; // array para armazenar mensagens de erro

        // validações de entrada
        if (valorInicial <= 0 || valorMensal < 0 || tempo <= 0) {
            mensagensErro.push('Por favor, insira valores positivos.');
        }
        if (unidadeTempo === "meses" && (tempo < 1 || tempo > 12)) {
            mensagensErro.push('Para meses, insira um valor entre 1 e 12.');
        }
        if (unidadeTempo === "anos" && (tempo < 1)) {
            mensagensErro.push('Para anos, insira um valor maior que 0.');
        }

        // exibe erros se houver
        if (mensagensErro.length > 0) {
            resultado.innerHTML = `
                <ul class="error-list">
                    ${mensagensErro.map(msg => `<li>${msg}</li>`).join('')}
                </ul>
            `;
            tabelaDiv.innerHTML = ""; // limpa a tabela se houver erro
            return;
        }

        // converte anos para meses, se necessário
        if (unidadeTempo === "anos") {
            tempo *= 12;
        }

        // define taxa com base no tipo selecionado
        let taxa = 0;
        switch (tipo) {
            case 'poupanca': taxa = 0.005; break;
            case 'rendaFixa': taxa = 0.01; break;
            case 'rendaVariavel': taxa = 0.015; break;
            case 'cdb': taxa = 0.01; break;
            case 'tesouro': taxa = 0.008; break;
            case 'nubank': taxa = 0.0065; break;
            case 'inter': taxa = 0.007; break;
            case 'lci': taxa = 0.0075; break;
            case 'lca': taxa = 0.008; break;
        }

        // calcula evolução do investimento para o gráfico
        let valores = [];
        let montanteGrafico = valorInicial;
        for (let i = 0; i < tempo; i++) {
            montanteGrafico += valorMensal;
            montanteGrafico *= (1 + taxa);
            valores.push(montanteGrafico.toFixed(2));
        }

        // exibe resultado
        resultado.innerHTML = `
            Após <strong>${tempo}</strong> meses, você terá acumulado 
            <strong>${formatarMoeda(montanteGrafico)}</strong>.
        `;

        // atualiza grafico
        if (grafico) grafico.destroy();
        grafico = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({ length: tempo }, (_, i) => i + 1),
                datasets: [{
                    label: 'Valor do Investimento ao Longo do Tempo',
                    data: valores,
                    borderColor: 'rgba(251, 140, 0, 0.4)',
                    backgroundColor: 'rgba(255, 213, 79, 0.5)',
                    fill: true,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: { y: { beginAtZero: true } }
            }
        });

        // monta a tabela de resultados
        // calcula juros totais e montante final
        let montanteTabela = valorInicial;
        let jurosTotais = 0;

        for (let i = 0; i < tempo; i++) {
            montanteTabela += valorMensal;
            let jurosMes = montanteTabela * taxa;
            jurosTotais += jurosMes;
            montanteTabela += jurosMes;
        }

        // monta a tabela no formato desejado
        let tabelaHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Evento</th>
                        <th>Valores</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Juros recebidos</td>
                        <td>${formatarMoeda(jurosTotais)}</td>
                    </tr>
                    <tr>
                        <td>Aportes</td>
                        <td>${formatarMoeda(valorMensal * tempo)}</td>
                    </tr>
                    <tr>
                        <td><strong>Valor final aplicado em ${nomeInvestimentoAmigavel(tipo)}</strong></td>
                        <td><strong>${formatarMoeda(montanteTabela)}</strong></td>
                    </tr>
                </tbody>
            </table>
        `;

        // insere a tabela na div
        tabelaDiv.innerHTML = tabelaHTML;

    });
});
