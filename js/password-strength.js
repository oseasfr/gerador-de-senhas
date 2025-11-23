// Aguardar o carregamento do zxcvbn
function esperarZxcvbn(callback) {
  if (typeof zxcvbn !== 'undefined') {
    callback();
  } else {
    setTimeout(() => esperarZxcvbn(callback), 100);
  }
}

// Função de análise de força da senha
function calcularForçaSenha(password) {
  if (!password) {
    return {
      score: 0,
      strength: 'Vazia',
      color: '#c0c0c0',
      info: 'Digite uma senha para avaliação.'
    };
  }

  // Verificar se zxcvbn está disponível
  if (typeof zxcvbn === 'undefined') {
    console.error('zxcvbn não está carregado');
    return {
      score: 50,
      strength: 'Carregando...',
      color: '#888',
      info: 'Aguarde o carregamento da biblioteca de análise.'
    };
  }

  const result = zxcvbn(password);
  let zxcvbnScore = result.score;
  const feedback = result.feedback;
  
  // Ajustar score baseado no comprimento (similar ao Bitwarden)
  const length = password.length;
  
  // Penalizar senhas muito curtas mesmo com variedade
  if (length < 12) {
    zxcvbnScore = Math.min(zxcvbnScore, 1); // No máximo "Fraca"
  } else if (length < 14) {
    zxcvbnScore = Math.min(zxcvbnScore, 2); // No máximo "Razoável"
  } else if (length < 16) {
    zxcvbnScore = Math.min(zxcvbnScore, 3); // No máximo "Boa"
  }

  let score, strength, color, info;
  let suggestions = [];

  switch (zxcvbnScore) {
    case 0:
      score = 20;
      strength = 'Muito fraca';
      color = '#ff4d4d';
      info = 'Senha facilmente quebrável';
      break;
    case 1:
      score = 40;
      strength = 'Fraca';
      color = '#ffaa00';
      info = 'Pode ser quebrada rapidamente';
      break;
    case 2:
      score = 60;
      strength = 'Razoável';
      color = '#ffff00';
      info = 'Segurança moderada';
      break;
    case 3:
      score = 80;
      strength = 'Boa';
      color = '#aaff00';
      info = 'Boa segurança';
      break;
    case 4:
      score = 100;
      strength = 'Forte';
      color = '#66ff66';
      info = 'Senha excelente';
      break;
  }

  // Mostrar tempo estimado de quebra (traduzido)
  if (result.crack_times_display) {
    const tempoOffline = result.crack_times_display.offline_slow_hashing_1e4_per_second;
    if (tempoOffline) {
      // Traduzir tempos
      const tempoTraduzido = tempoOffline
        .replace('less than a second', 'menos de um segundo')
        .replace('seconds', 'segundos')
        .replace('second', 'segundo')
        .replace('minutes', 'minutos')
        .replace('minute', 'minuto')
        .replace('hours', 'horas')
        .replace('hour', 'hora')
        .replace('days', 'dias')
        .replace('day', 'dia')
        .replace('months', 'meses')
        .replace('month', 'mês')
        .replace('years', 'anos')
        .replace('year', 'ano')
        .replace('centuries', 'séculos')
        .replace('century', 'século');
      
      info += ` - Tempo estimado: ${tempoTraduzido}`;
    }
  }

  // Traduzir avisos para português
  if (feedback.warning) {
    const avisos = {
      'This is a top-10 common password': 'Esta é uma das 10 senhas mais comuns',
      'This is a top-100 common password': 'Esta é uma das 100 senhas mais comuns',
      'This is a very common password': 'Esta é uma senha muito comum',
      'This is similar to a commonly used password': 'Similar a uma senha comum',
      'A word by itself is easy to guess': 'Uma palavra sozinha é fácil de adivinhar',
      'Names and surnames by themselves are easy to guess': 'Nomes sozinhos são fáceis de adivinhar',
      'Common names and surnames are easy to guess': 'Nomes comuns são fáceis de adivinhar',
      'Straight rows of keys are easy to guess': 'Sequências de teclas são fáceis de adivinhar',
      'Short keyboard patterns are easy to guess': 'Padrões curtos de teclado são fáceis',
      'Repeats like "aaa" are easy to guess': 'Repetições como "aaa" são fáceis',
      'Repeats like "abcabcabc" are only slightly harder to guess than "abc"': 'Repetições são pouco mais difíceis',
      'Sequences like abc or 6543 are easy to guess': 'Sequências como abc ou 6543 são fáceis',
      'Recent years are easy to guess': 'Anos recentes são fáceis de adivinhar',
      'Dates are often easy to guess': 'Datas são fáceis de adivinhar'
    };
    
    const avisoTraduzido = avisos[feedback.warning] || feedback.warning;
    suggestions.push(avisoTraduzido);
  }

  // Traduzir sugestões para português
  if (feedback.suggestions && feedback.suggestions.length > 0) {
    const traducoes = {
      'Add another word or two. Uncommon words are better.': 'Adicione mais palavras incomuns',
      'Use a longer keyboard pattern with more turns': 'Use padrão de teclado mais longo',
      'Avoid repeated words and characters': 'Evite repetições',
      'Avoid sequences': 'Evite sequências',
      'Avoid recent years': 'Evite anos recentes',
      'Avoid years that are associated with you': 'Evite anos pessoais',
      'Avoid dates and years that are associated with you': 'Evite datas pessoais',
      'Capitalization doesn\'t help very much': 'Maiúsculas ajudam pouco',
      'All-uppercase is almost as easy to guess as all-lowercase': 'Tudo maiúsculo é fácil de adivinhar',
      'Reversed words aren\'t much harder to guess': 'Palavras invertidas são fáceis',
      'Predictable substitutions like \'@\' instead of \'a\' don\'t help very much': 'Substituições previsíveis ajudam pouco',
      'Use a few words, avoid common phrases': 'Use palavras, evite frases comuns',
      'No need for symbols, digits, or uppercase letters': 'Não precisa de símbolos ou maiúsculas'
    };
    
    feedback.suggestions.slice(0, 2).forEach(s => {
      const traducao = traducoes[s] || s;
      suggestions.push(traducao);
    });
  }

  // Adicionar dicas específicas baseadas no score e comprimento
  if (length < 16) {
    suggestions.push('Use pelo menos 16 caracteres para maior segurança');
  }
  if (zxcvbnScore < 3) {
    if (!/[A-Z]/.test(password) && !/[a-z]/.test(password)) {
      suggestions.push('Adicione letras maiúsculas e minúsculas');
    }
    if (!/[0-9]/.test(password)) {
      suggestions.push('Adicione números');
    }
    if (!/[!@#$%&*()_+=\-]/.test(password)) {
      suggestions.push('Adicione símbolos especiais');
    }
  }

  // Construir texto final
  let finalInfo = info;
  if (suggestions.length > 0) {
    const uniqueSuggestions = [...new Set(suggestions)].slice(0, 3);
    finalInfo += '. Dicas: ' + uniqueSuggestions.join('; ');
  }

  return { score, strength, color, info: finalInfo };
}

function atualizarForcaSenha(password, idPrefix = '') {
  const strengthResult = calcularForçaSenha(password);

  document.getElementById(`${idPrefix}strength-text`).textContent = strengthResult.strength;
  document.getElementById(`${idPrefix}strength-score`).textContent = `${strengthResult.score}/100`;

  const strengthFill = document.getElementById(`${idPrefix}strength-fill`);
  strengthFill.style.width = `${strengthResult.score}%`;
  strengthFill.style.backgroundColor = strengthResult.color;

  document.getElementById(`${idPrefix}strength-info`).textContent = strengthResult.info;
}
