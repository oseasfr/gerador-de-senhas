const imagens = Array.from({ length: 10 }, (_, i) =>
  `imagens/${String(i + 1).padStart(3, '0')}.jpg`
);
let indiceAtual = 0;

function mudarFundo() {
  indiceAtual = (indiceAtual + 1) % imagens.length;
  document.body.style.backgroundImage = `url('${imagens[indiceAtual]}')`;
}

function copiarSenha(id) {
  const passwordField = document.getElementById(id);
  passwordField.select();
  document.execCommand("copy");

  const feedback = document.querySelector(".copy-feedback");
  feedback.classList.add("show-feedback");

  setTimeout(() => {
    feedback.classList.remove("show-feedback");
  }, 1500);
}

function gerarSenha() {
  // Obter os valores das opções
  const length = parseInt(document.getElementById("passwordLength").value);
  const includeUpper = document.getElementById("includeUpper").checked;
  const includeLower = document.getElementById("includeLower").checked;
  const includeNumbers = document.getElementById("includeNumbers").checked;
  const includeSymbols = document.getElementById("includeSymbols").checked;

  // Verificar se pelo menos uma opção está selecionada
  if (!(includeUpper || includeLower || includeNumbers || includeSymbols)) {
    alert("Selecione pelo menos um tipo de caractere");
    return;
  }

  // Limitar o comprimento entre 10 e 20
  const validLength = Math.max(10, Math.min(20, length));
  document.getElementById("passwordLength").value = validLength;
  document.getElementById("passwordLengthSlider").value = validLength;
  document.getElementById("lengthValue").textContent = validLength;

  // Construir conjunto de caracteres com base nas opções
  let charset = "";
  if (includeUpper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (includeLower) charset += "abcdefghijklmnopqrstuvwxyz";
  if (includeNumbers) charset += "0123456789";
  if (includeSymbols) charset += "!@#$%&*()-_=+";

  // Gerar senha
  let password = "";
  for (let i = 0; i < validLength; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  document.getElementById("password").value = password;
  atualizarForcaSenha(password);
  mudarFundo();
}

function analisarSenha() {
  const password = document.getElementById("testPassword").value;
  if (!password) {
    alert("Digite uma senha para analisar");
    return;
  }
  atualizarForcaSenha(password, "test-");
}

// Sincronizar slider e campo numérico
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

// Atualizar a força quando mudar as opções de caracteres
const checkboxes = document.querySelectorAll('.option-row input[type="checkbox"]');
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', function() {
    const currentPassword = document.getElementById("password").value;
    if (currentPassword) {
      atualizarForcaSenha(currentPassword);
    }
  });
});

// Alternar entre as abas
const tabBtns = document.querySelectorAll('.tab-btn');

tabBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    // Remover classe active de todos os botões e conteúdos
    tabBtns.forEach(tb => tb.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });

    // Adicionar classe active ao botão clicado e ao conteúdo correspondente
    this.classList.add('active');
    const tabId = this.getAttribute('data-tab');
    document.getElementById(tabId).classList.add('active');
  });
});

// Testar senha em tempo real ao digitar
document.getElementById("testPassword").addEventListener("input", function() {
  if (this.value) {
    atualizarForcaSenha(this.value, "test-");
  } else {
    // Resetar informações quando o campo estiver vazio
    document.getElementById("test-strength-text").textContent = "-";
    document.getElementById("test-strength-score").textContent = "-";
    document.getElementById("test-strength-fill").style.width = "0%";
    document.getElementById("test-strength-info").textContent = "-";
  }
});

// Inicializar a aplicação
window.onload = function() {
  gerarSenha();
  
  // Adicionar evento para o botão de testar senha
  document.getElementById("testPassword").addEventListener("keyup", function() {
    if (this.value) {
      atualizarForcaSenha(this.value, "test-");
    }
  });
};
