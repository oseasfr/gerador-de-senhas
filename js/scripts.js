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
        const image = new Image();
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

function copiarSenha(id) {
  const passwordField = document.getElementById(id);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(passwordField.value).then(() => {
      mostrarFeedbackCopia();
    }).catch(err => {
      console.error('Falha ao copiar texto via Clipboard API: ', err);
      copiarComExecCommand(passwordField);
    });
  } else {
    copiarComExecCommand(passwordField);
  }
}

function copiarComExecCommand(passwordField) {
  try {
    passwordField.select();
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

  const validLength = Math.max(12, Math.min(32, length));
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
  atualizarForcaSenha(password);
  
  // Mudar imagem de fundo ao gerar senha
  mudarFundo();
}

// Inicialização quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", function() {
  // Verificar imagens primeiro
  verificarImagens().then(() => {
    // Aguardar carregamento do zxcvbn antes de iniciar
    esperarZxcvbn(function() {
      console.log('zxcvbn carregado com sucesso');
      
      // Slider de comprimento
      document.getElementById("passwordLengthSlider").addEventListener("input", function() {
        const value = this.value;
        document.getElementById("passwordLength").value = value;
        document.getElementById("lengthValue").textContent = value;
        
        const currentPassword = document.getElementById("password").value;
        if (currentPassword) {
          gerarSenha();
        }
      });

      // Input numérico de comprimento
      document.getElementById("passwordLength").addEventListener("input", function() {
        const value = Math.max(12, Math.min(32, this.value));
        this.value = value;
        document.getElementById("passwordLengthSlider").value = value;
        document.getElementById("lengthValue").textContent = value;
        
        const currentPassword = document.getElementById("password").value;
        if (currentPassword) {
          gerarSenha();
        }
      });

      // Checkboxes de opções
      const checkboxes = document.querySelectorAll('.option-row input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
          const currentPassword = document.getElementById("password").value;
          if (currentPassword) {
            gerarSenha();
          }
        });
      });

      // Botões de abas
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
        });
      });

      // Campo de teste de senha
      document.getElementById("testPassword").addEventListener("input", function() {
        if (this.value) {
          atualizarForcaSenha(this.value, "test-");
        } else {
          document.getElementById("test-strength-text").textContent = "-";
          document.getElementById("test-strength-score").textContent = "-";
          document.getElementById("test-strength-fill").style.width = "0%";
          document.getElementById("test-strength-info").textContent = "Digite uma senha para avaliação.";
        }
      });

      // Gerar senha inicial
      gerarSenha();
    });
  });
});
