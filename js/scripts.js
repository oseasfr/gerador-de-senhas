// Configuração das imagens de fundo
const imagens = Array.from({ length: 10 }, (_, i) => 
  `imagens/${String(i + 1).padStart(3, '0')}.jpg`
);
let indiceAtual = 0;

// Verificar se as imagens existem
function verificarImagens() {
  return Promise.all(
    imagens.map(img => {
      return new Promise((resolve) => {
        const image = new new Image();
        image.onload = () => resolve(true);
        image.onerror = () => resolve(false);
        image.src = img;
      });
    })
  ).then(results => {
    const todasCarregam = results.every(Boolean);
    if (!todasCarregam) {
      console.warn('Algumas imagens de fundo não foram encontradas');
      document.body.classList.add('no-image');
    }
    return todasCarregam;
  });
}

// Mudar fundo com tratamento de erro
function mudarFundo() {
  indiceAtual = (indiceAtual + 1) % imagens.length;
  const img = new Image();
  
  img.onload = function() {
    document.body.style.backgroundImage = `url('${imagens[indiceAtual]}')`;
    document.body.classList.remove('no-image');
  };
  
  img.onerror = function() {
    console.error(`Erro ao carregar imagem: ${imagens[indiceAtual]}`);
    document.body.classList.add('no-image');
    // Tentar a próxima imagem após um curto intervalo
    setTimeout(mudarFundo, 100);
  };
  
  img.src = imagens[indiceAtual];
}

// Copiar senha para área de transferência
function copiarSenha(id) {
  const passwordField = document.getElementById(id);
  // Usar API moderna (navigator.clipboard) se disponível, senão fallback
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(passwordField.value).then(() => {
      mostrarFeedbackCopia();
    }).catch(err => {
      console.error('Falha ao copiar texto via Clipboard API: ', err);
      // Fallback para execCommand, embora obsoleto
      copiarComExecCommand(passwordField);
    });
  } else {
    // Fallback para execCommand
    copiarComExecCommand(passwordField);
  }
}

function copiarComExecCommand(passwordField) {
  try {
    // Seleciona o conteúdo do campo
    passwordField.select();
    // Para dispositivos móveis
    passwordField.setSelectionRange(0, 99999); 
    
    document.execCommand("copy");
    mostrarFeedbackCopia();
  } catch (err) {
    console.error('Falha ao copiar texto: ', err);
    alert('Não foi possível copiar a senha. Por favor, copie manualmente.');
  }
}

function mostrarFeedbackCopia() {
  const feedback = document.querySelector(".copy-feedback");
  feedback.classList.add("show-feedback");
  
  setTimeout(() => {
    feedback.classList.remove("show-feedback");
  }, 1500);
}

// Gerar nova senha
function gerarSenha() {
  const length = parseInt(document.getElementById("passwordLength").value);
  const includeUpper = document.getElementById("includeUpper").checked;
  const includeLower = document.getElementById("includeLower").checked;
  const includeNumbers = document.getElementById("includeNumbers").checked;
  const includeSymbols = document.getElementById("includeSymbols").checked;

  if (!(includeUpper || includeLower || includeNumbers || includeSymbols)) {
    alert("Selecione pelo menos um tipo de caractere");
    return;
  }

  const validLength = Math.max(10, Math.min(20, length));
  document.getElementById("passwordLength").value = validLength;
  document.getElementById("passwordLengthSlider").value = validLength;
  document.getElementById("lengthValue").textContent = validLength;

  let charset = "";
  if (includeUpper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (includeLower) charset += "abcdefghijklmnopqrstuvwxyz";
  if (includeNumbers) charset += "0123456789";
  if (includeSymbols) charset += "!@#$%&*()-_=+";

  let password = "";
  for (let i = 0; i < validLength; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  document.getElementById("password").value = password;
  
  // Atualiza a força da senha gerada
  atualizarForcaSenha(password);
  mudarFundo();
}

// REMOVIDA: A função analisarSenha() foi removida pois a análise 
// em tempo real já é feita pelo event listener no DOMContentLoaded.

// Event Listeners
document.addEventListener("DOMContentLoaded", function() {
  // Verificar imagens primeiro
  verificarImagens().then(() => {
    // Configurar eventos após verificação
    document.getElementById("passwordLengthSlider").addEventListener("input", function() {
      const value = this.value;
      document.getElementById("passwordLength").value = value;
      document.getElementById("lengthValue").textContent = value;
      
      const currentPassword = document.getElementById("password").value;
      if (currentPassword) {
        atualizarForcaSenha(currentPassword);
      }
    });

    document.getElementById("passwordLength").addEventListener("input", function() {
      const value = Math.max(10, Math.min(20, this.value));
      this.value = value;
      document.getElementById("passwordLengthSlider").value = value;
      document.getElementById("lengthValue").textContent = value;
      
      const currentPassword = document.getElementById("password").value;
      if (currentPassword) {
        atualizarForcaSenha(currentPassword);
      }
    });

    const checkboxes = document.querySelectorAll('.option-row input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        const currentPassword = document.getElementById("password").value;
        if (currentPassword) {
          atualizarForcaSenha(currentPassword);
        }
      });
    });

    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        tabBtns.forEach(tb => tb.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => {
          content.classList.remove('active');
        });
        
        this.classList.add('active');
        const tabId = this.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
        
        // Se mudar para a aba de teste, força a análise da senha atual (se houver)
        if (tabId === 'test') {
            const testPassword = document.getElementById("testPassword").value;
            if (testPassword) {
                atualizarForcaSenha(testPassword, "test-");
            }
        }
      });
    });

    // Listener para checagem da senha digitada em tempo real (on input)
    document.getElementById("testPassword").addEventListener("input", function() {
      if (this.value) {
        // Chama a função do password-strength.js com o prefixo 'test-'
        atualizarForcaSenha(this.value, "test-");
      } else {
        // Limpa os campos quando o input está vazio
        document.getElementById("test-strength-text").textContent = "Vazia";
        document.getElementById("test-strength-score").textContent = "0/100";
        document.getElementById("test-strength-fill").style.width = "0%";
        document.getElementById("test-strength-fill").style.backgroundColor = "#c0c0c0"; // Cinza
        document.getElementById("test-strength-info").textContent = "Digite uma senha para avaliação.";
      }
    });

    // Gerar senha inicial
    gerarSenha();
  });
});
