function calcularForçaSenha(password) {
  // Definir pontuação base com base no comprimento
  let score = 0;
  const length = password.length;

  // Verificar a existência de diferentes tipos de caracteres
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[!@#$%&*\(\)-_=+]/.test(password);

  // Adicionar pontos para cada tipo de caractere presente
  const charTypesCount = [hasUpper, hasLower, hasNumbers, hasSymbols].filter(Boolean).length;

  // Calcular pontuação base no comprimento e tipos de caracteres
  score = Math.min(100, (length * 4) + (charTypesCount * 10));

  // Ajustar pontuação com base no comprimento mínimo
  if (length < 8) score = Math.min(score, 40);
  else if (length < 10) score = Math.min(score, 60);
  else if (length < 12) score = Math.min(score, 80);

  // Lista de penalidades aplicadas para mostrar ao usuário
  let penalidades = [];

  // ================== NOVAS VERIFICAÇÕES DE PADRÕES ==================

  // 1. Verificar sequências de teclado QWERTY (horizontais)
  const fileiras = [
    "qwertyuiop", "asdfghjkl", "zxcvbnm",
    "1234567890", "!@#$%^&*()"
  ];
  
  // Verificar sequências diretas e invertidas em cada fileira
  for (const fileira of fileiras) {
    for (let i = 0; i <= fileira.length - 3; i++) {
      const seq = fileira.substring(i, i + 3).toLowerCase();
      const seqRev = seq.split('').reverse().join('');
      
      if (password.toLowerCase().includes(seq)) {
        score -= 10;
        penalidades.push("Contém sequência de teclado");
        break;
      }
      
      if (password.toLowerCase().includes(seqRev)) {
        score -= 10;
        penalidades.push("Contém sequência de teclado invertida");
        break;
      }
    }
  }

  // 2. Verificar sequências numéricas (ex: 123, 321, 456)
  const numSeq = "0123456789";
  for (let i = 0; i <= numSeq.length - 3; i++) {
    const seq = numSeq.substring(i, i + 3);
    const seqRev = seq.split('').reverse().join('');
    
    if (password.includes(seq)) {
      score -= 10;
      penalidades.push("Contém sequência numérica");
      break;
    }
    
    if (password.includes(seqRev)) {
      score -= 10;
      penalidades.push("Contém sequência numérica invertida");
      break;
    }
  }

  // 3. Verificar sequências alfabéticas (ex: abc, xyz, cba)
  const alphaSeq = "abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i <= alphaSeq.length - 3; i++) {
    const seq = alphaSeq.substring(i, i + 3);
    const seqRev = seq.split('').reverse().join('');
    
    if (password.toLowerCase().includes(seq)) {
      score -= 10;
      penalidades.push("Contém sequência alfabética");
      break;
    }
    
    if (password.toLowerCase().includes(seqRev)) {
      score -= 10;
      penalidades.push("Contém sequência alfabética invertida");
      break;
    }
  }

  // 4. Verificar repetições de caracteres (ex: aaa, 111)
  if (/(.)\1\1+/.test(password)) {
    score -= 15;
    penalidades.push("Contém caracteres repetidos em sequência");
  }

  // 5. Verificar padrões de teclado diagonais (ex: qaz, zaq, qwe)
  const diagonais = [
    "1qaz", "zaq1", "2wsx", "xsw2", "3edc", "cde3", "4rfv", "vfr4",
    "5tgb", "bgt5", "6yhn", "nhy6", "7ujm", "mju7", "8ik,", ",ki8",
    "9ol.", ".lo9", "0p;/", "/;p0", "qwe", "ewq", "asd", "dsa", "zxc", "cxz"
  ];
  
  for (const diagonal of diagonais) {
    for (let i = 0; i <= diagonal.length - 3; i++) {
      const seq = diagonal.substring(i, i + 3).toLowerCase();
      
      if (password.toLowerCase().includes(seq)) {
        score -= 10;
        penalidades.push("Contém padrão de teclado diagonal");
        break;
      }
    }
  }

  // 6. Verificar padrões comuns (anos, datas, etc)
  // Anos - penalizar senhas com 19XX ou 20XX
  if (/19\d\d|20\d\d/.test(password)) {
    score -= 8;
    penalidades.push("Contém um ano (19XX/20XX)");
  }
  
  // Datas em formatos comuns
  if (/\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}-\d{1,2}-\d{2,4}|\d{1,2}\.\d{1,2}\.\d{2,4}/.test(password)) {
    score -= 10;
    penalidades.push("Contém um formato de data");
  }

  // 7. Verificar palavras espelhadas (ex: abccba, xyzyx)
  const half = Math.floor(length / 2);
  let isPalindrome = true;
  
  for (let i = 0; i < half; i++) {
    if (password[i].toLowerCase() !== password[length - 1 - i].toLowerCase()) {
      isPalindrome = false;
      break;
    }
  }
  
  if (isPalindrome && length > 2) {
    score -= 15;
    penalidades.push("A senha é um palíndromo (lê-se igual de trás para frente)");
  }

  // 8. Verificar substituições óbvias (ex: @ por a, 3 por e, 0 por o)
  const cleanedPass = password
    .toLowerCase()
    .replace(/[0]/g, 'o')
    .replace(/[1]/g, 'i')
    .replace(/[3]/g, 'e')
    .replace(/[4]/g, 'a')
    .replace(/[5]/g, 's')
    .replace(/[7]/g, 't')
    .replace(/[@]/g, 'a')
    .replace(/[$]/g, 's');
  
  // Se a senha "limpa" contiver mais padrões, penalizar adicionalmente
  for (const fileira of fileiras) {
    for (let i = 0; i <= fileira.length - 4; i++) {
      const seq = fileira.substring(i, i + 4).toLowerCase();
      
      if (cleanedPass.includes(seq)) {
        score -= 5;
        penalidades.push("Usa substituições óbvias de caracteres");
        break;
      }
    }
  }

  // 9. Estrutura previsível (ex: Uma maiúscula, seguida por várias minúsculas, seguida por números)
  // Padrão comum: Senha1, Abc123, Abcdef12
  if (/^[A-Z][a-z]+\d+$/.test(password)) {
    score -= 10;
    penalidades.push("Estrutura previsível (maiúscula + minúsculas + números)");
  }

  // 10. Verificar quando os caracteres especiais estão apenas no início ou final
  if (hasSymbols) {
    const middleHasSymbols = /^[^!@#$%&*\(\)-_=+]+$/.test(password.substring(1, password.length - 1));
    if (middleHasSymbols) {
      score -= 5;
      penalidades.push("Símbolos apenas no início/fim da senha");
    }
  }

  // 11. Entropia efetiva diminuída por padrões
  // Se tivermos muitas penalidades, diminuir ainda mais o score
  if (penalidades.length > 2) {
    score -= 10;
  }

  // Garantir que o score não fique negativo
  score = Math.max(0, score);

  // Retornar objetos com as informações de força
  let strength = '';
  let color = '';
  let info = '';

  if (score < 30) {
    strength = 'Muito fraca';
    color = '#ff4d4d';
    info = 'Senha facilmente quebrável em segundos ou minutos.';
  } else if (score < 50) {
    strength = 'Fraca';
    color = '#ffaa00';
    info = 'Pode ser quebrada em poucas horas ou dias.';
  } else if (score < 70) {
    strength = 'Média';
    color = '#ffff00';
    info = 'Pode levar semanas para ser quebrada.';
  } else if (score < 85) {
    strength = 'Forte';
    color = '#aaff00';
    info = 'Pode levar anos para ser quebrada.';
  } else {
    strength = 'Muito forte';
    color = '#66ff66';
    info = 'Pode levar séculos para ser quebrada com tecnologia atual.';
  }

  // Adicionar informações adicionais baseadas na análise
  if (length < 12) {
    info += ' Recomendamos senhas com pelo menos 12 caracteres.';
  }

  if (charTypesCount < 3) {
    info += ' Use mais tipos de caracteres (maiúsculas, minúsculas, números, símbolos).';
  }

  // Adicionar os problemas específicos identificados
  if (penalidades.length > 0) {
    // Remover duplicatas
    penalidades = [...new Set(penalidades)];
    
    // Limitar a 3 penalidades para não sobrecarregar a interface
    const topPenalidades = penalidades.slice(0, 3);
    
    info += ' Problemas: ' + topPenalidades.join(', ') + '.';
  }

  return {
    score,
    strength,
    color,
    info
  };
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
