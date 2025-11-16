let nomePaciente = "";
let dataNascimento = "";
let idadePaciente = 0;
let pontuacao = 0;
let perguntaAtual = 0;
let respostasQuiz = [];

// Função para calcular idade
function calcularIdade(dataNasc) {
  const hoje = new Date();
  const nascimento = new Date(dataNasc);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) idade--;
  return idade;
}

const perguntas = [
  {
    pergunta: "Nos últimos 3 dias, você teve febre ou calafrios?",
    opcoes: [
      { texto: "Não tive febre", valor: 0 },
      { texto: "Tive febre leve (até 38°C)", valor: 1 },
      { texto: "Tive febre alta (>38°C) ou calafrios intensos", valor: 2 }
    ]
  },
  {
    pergunta: "Está sentindo dificuldade para respirar ou falta de ar?",
    opcoes: [
      { texto: "Não", valor: 0 },
      { texto: "Sim, apenas ao esforço", valor: 1 },
      { texto: "Sim, mesmo em repouso", valor: 2 }
    ]
  },
  {
    pergunta: "Está com dor no peito, palpitações ou pressão no tórax?",
    opcoes: [
      { texto: "Não", valor: 0 },
      { texto: "Leve ou ocasional", valor: 1 },
      { texto: "Intensa ou contínua", valor: 2 }
    ]
  },
  {
    pergunta: "Apresenta tosse, coriza ou dor de garganta persistente?",
    opcoes: [
      { texto: "Não", valor: 0 },
      { texto: "Sim, leve", valor: 1 },
      { texto: "Sim, intensa ou frequente", valor: 2 }
    ]
  },
  {
    pergunta: "Está com dores de cabeça fortes, tontura ou enjoos?",
    opcoes: [
      { texto: "Não", valor: 0 },
      { texto: "Leves e esporádicos", valor: 1 },
      { texto: "Fortes e constantes", valor: 2 }
    ]
  }
];

function iniciarQuiz() {
  const inputNome = document.getElementById("nome").value.trim();
  const inputData = document.getElementById("nascimento").value;

  if (!inputNome || !inputData) {
    alert("Por favor, preencha seu nome e data de nascimento.");
    return;
  }

  nomePaciente = inputNome;
  dataNascimento = inputData;
  idadePaciente = calcularIdade(inputData);

  document.getElementById("welcome-screen").style.display = "none";
  document.getElementById("quiz-box").style.display = "block";
  mostrarPergunta(0);
}

function mostrarPergunta(index) {
  perguntaAtual = index;
  const perguntaObj = perguntas[index];

  let html = `<div class="question">${perguntaObj.pergunta}</div><div class="options">`;
  perguntaObj.opcoes.forEach(opcao => {
    html += `<button onclick="selecionarOpcao('${opcao.texto}', ${opcao.valor})">${opcao.texto}</button>`;
  });
  html += "</div>";

  document.getElementById("quiz-box").innerHTML = html;
}

function selecionarOpcao(texto, valor) {
  pontuacao += valor;
  respostasQuiz.push(texto);
  if (perguntaAtual < perguntas.length - 1) {
    mostrarPergunta(perguntaAtual + 1);
  } else {
    mostrarResultado();
  }
}

function mostrarResultado() {
  document.getElementById("quiz-box").style.display = "none";
  document.getElementById("result-box").style.display = "block";

  const risco = pontuacao <= 3 ? "Baixo" : pontuacao <= 7 ? "Moderado" : "Alto";

  const paciente = {
    nome: nomePaciente,
    idade: idadePaciente,
    nascimento: dataNascimento,
    risco,
    setor: "Triagem inicial",
    respostas: respostasQuiz,
    horaInicio: new Date().toLocaleString()
  };

  let fila = JSON.parse(localStorage.getItem("filaPacientes") || "[]");
  fila.push(paciente);
  localStorage.setItem("filaPacientes", JSON.stringify(fila));

  document.getElementById("resultado-texto").innerHTML = `
    Olá <strong>${nomePaciente}</strong> (idade: ${idadePaciente} anos).<br>
    Seu nível de risco foi classificado como <strong>${risco}</strong>.
  `;
  document.getElementById("mensagem-final").innerHTML = "Você será redirecionado para a triagem em alguns segundos...";

  setTimeout(() => window.location.href = "pacientes1.html", 4000);
}
