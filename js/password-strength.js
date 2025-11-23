// A função calcularForçaSenha agora usa o algoritmo zxcvbn (disponível globalmente após a inclusão do script)
function calcularForçaSenha(password) {
  // Se a senha estiver vazia, retorna um estado inicial
  if (!password) {
    return {
      score: 0,
      strength: 'Nenhuma',
      color: '#cccccc',
      info: 'Digite uma senha para testar a força.'
    };
  }

  // 1. Chamar o algoritmo zxcvbn
  // O zxcvbn retorna um objeto com a pontuação (score) de 0 a 4
  const result = zxcvbn(password);
  const zxcvbnScore = result.score; // 0 = Pior, 4 = Melhor

  // 2. Mapear a pontuação do zxcvbn (0-4) para a sua escala (0-100)
  let strength = '';
  let color = '';
  let info = '';
  let score100 = 0; // Pontuação para a barra de progresso (0-100)

  switch (zxcvbnScore) {
    case 0:
      strength = 'Muito fraca';
      color = '#ff4d4d';
      info = 'Senha facilmente quebrável. Evite padrões comuns e palavras do dicionário.';
      score100 = 15;
      break;
    case 1:
      strength = 'Fraca';
      color = '#ffaa00';
      info = 'Pode ser quebrada em poucas horas ou dias. Aumente o comprimento e a complexidade.';
      score100 = 40;
      break;
    case 2:
      strength = 'Média';
      color = '#ffff00';
      info = 'Pode levar semanas para ser quebrada. Considere uma frase-senha mais longa.';
      score100 = 65;
      break;
    case 3:
      strength = 'Forte';
      color = '#aaff00';
      info = 'Pode levar anos para ser quebrada. Ótima segurança.';
      score100 = 85;
      break;
    case 4:
      strength = 'Muito forte';
      color = '#66ff66';
      // O zxcvbn fornece o tempo estimado de quebra (crack_times_display)
      info = `Pode levar ${result.crack_times_display} para ser quebrada. Excelente!`;
      score100 = 100;
      break;
  }

  // 3. Adicionar sugestões de aprimoramento (feedback)
  // O zxcvbn também fornece sugestões de aprimoramento
  if (result.feedback && result.feedback.suggestions && result.feedback.suggestions.length > 0) {
    info += ' Sugestões: ' + result.feedback.suggestions.join(' ');
  } else if (zxcvbnScore < 4) {
    // Se não houver sugestões específicas, mas a senha não for 4, manter a sugestão de comprimento
    info += ' Recomendamos senhas com pelo menos 14 caracteres.';
  }

  return {
    score: score100, // Usamos a pontuação mapeada para a barra de progresso
    strength,
    color,
    info
  };
}

// A função atualizarForcaSenha permanece a mesma, pois ela apenas usa o resultado
function atualizarForcaSenha(password, idPrefix = '') {
  const strengthResult = calcularForçaSenha(password);

  document.getElementById(`${idPrefix}strength-text`).textContent = strengthResult.strength;
  document.getElementById(`${idPrefix}strength-score`).textContent = `${strengthResult.score}/100`;

  const strengthFill = document.getElementById(`${idPrefix}strength-fill`);
  strengthFill.style.width = `${strengthResult.score}%`;
  strengthFill.style.backgroundColor = strengthResult.color;

  document.getElementById(`${idPrefix}strength-info`).textContent = strengthResult.info;
}
