/**
 * Lógica de força da senha usando a biblioteca zxcvbn.
 *
 * É crucial que o arquivo zxcvbn.js seja carregado no index.html ANTES deste script.
 * Ex: <script src="https://unpkg.com/zxcvbn/dist/zxcvbn.js"></script>
 */

function calcularForçaSenha(password, userInputs = []) {
    if (!password) {
        return {
            score: 0,
            strength: 'Vazia',
            color: '#c0c0c0',
            info: 'Digite uma senha para avaliação.'
        };
    }

    // O coração da nova lógica: usa a função zxcvbn()
    // userInputs é opcional (pode incluir nome de usuário, nome completo, etc.)
    // Note: No seu projeto, estamos passando apenas a senha por enquanto.
    const result = zxcvbn(password, userInputs);

    const zxcvbnScore = result.score; // Pontuação de 0 (pior) a 4 (melhor)
    const feedback = result.feedback;

    let score;
    let strength = '';
    let color = '';
    let info = '';
    let suggestions = [];

    // 1. Mapeamento do Score zxcvbn (0-4) para a escala (0-100) e labels do seu projeto
    switch (zxcvbnScore) {
        case 0:
            score = 20;
            strength = 'Muito fraca';
            color = '#ff4d4d'; // Vermelho
            info = 'Senha facilmente quebrável.';
            break;
        case 1:
            score = 40;
            strength = 'Fraca';
            color = '#ffaa00'; // Laranja
            info = 'Pode ser quebrada em poucas horas ou dias.';
            break;
        case 2:
            score = 60;
            strength = 'Média';
            color = '#ffff00'; // Amarelo
            info = 'Pode levar semanas para ser quebrada.';
            break;
        case 3:
            score = 80;
            strength = 'Forte';
            color = '#aaff00'; // Verde-claro
            info = 'Pode levar anos para ser quebrada.';
            break;
        case 4:
            score = 100;
            strength = 'Muito forte';
            color = '#66ff66'; // Verde
            info = 'Senha excelente!';
            break;
    }

    // 2. Adicionar Feedback (Aviso e Sugestões) do zxcvbn
    if (feedback.warning && feedback.warning.length > 0) {
        // Se houver um aviso específico (ex: "é muito comum")
        suggestions.push(`Aviso: ${feedback.warning}`);
    } else if (zxcvbnScore < 4) {
        // Se não houver aviso, mostre a estimativa de tempo de quebra (quebra online)
        const timeEstimate = result.crack_times_display.online_no_throttling_10_per_second;
        info += ` (Quebra online: ${timeEstimate})`;
    }

    if (feedback.suggestions && feedback.suggestions.length > 0) {
        // Adicionar as sugestões do zxcvbn
        suggestions = suggestions.concat(
            // Capitaliza a primeira letra de cada sugestão e limita a 3
            feedback.suggestions.slice(0, 3).map(s => s.charAt(0).toUpperCase() + s.slice(1))
        );
    }

    // 3. Formatar o campo 'info'
    let finalInfo = info;
    if (suggestions.length > 0) {
        // Remover duplicatas e limitar a 3 itens
        const uniqueSuggestions = [...new Set(suggestions)].slice(0, 3);
        finalInfo += '. Sugestões: ' + uniqueSuggestions.join('. ');
    } else if (zxcvbnScore < 4) {
        finalInfo += '. Sugestão: Aumente o comprimento e a variedade de caracteres.';
    }

    return {
        score,
        strength,
        color,
        info: finalInfo
    };
}

/**
 * Atualiza o HTML com os resultados obtidos de calcularForçaSenha.
 * Esta função é chamada por scripts.js.
 */
function atualizarForcaSenha(password, idPrefix = '') {
    const strengthResult = calcularForçaSenha(password);

    // Atualiza os textos
    document.getElementById(`${idPrefix}strength-text`).textContent = strengthResult.strength;
    document.getElementById(`${idPrefix}strength-score`).textContent = `${strengthResult.score}/100`;

    // Atualiza a barra visual
    const strengthFill = document.getElementById(`${idPrefix}strength-fill`);
    strengthFill.style.width = `${strengthResult.score}%`;
    strengthFill.style.backgroundColor = strengthResult.color;

    // Atualiza o feedback detalhado
    document.getElementById(`${idPrefix}strength-info`).textContent = strengthResult.info;
}
