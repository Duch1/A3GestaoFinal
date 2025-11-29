window.onload = function () {
  garantirDatas(); // Corrige pacientes antigos sem data
  mostrarPacientes();
};

// -------------------------------
// DEFINIÇÃO DE RISCO
// -------------------------------
function valorRisco(risco) {
  if (risco === "Alto") return 3;
  if (risco === "Moderado") return 2;
  return 1;
}

// -------------------------------
// MOSTRAR PACIENTES
// -------------------------------
function mostrarPacientes() {
  const filtroNome = document.getElementById("buscaNome")?.value?.toLowerCase() || "";
  let pacientes = JSON.parse(localStorage.getItem("filaPacientes") || "[]");

  if (filtroNome) {
    pacientes = pacientes.filter(p => p.nome?.toLowerCase().includes(filtroNome));
  }

  pacientes.sort((a, b) => valorRisco(b.risco) - valorRisco(a.risco));

  const tbody = document.querySelector("#tabelaPacientes tbody");
  tbody.innerHTML = "";

  pacientes.forEach((paciente, index) => {
    let corRisco = paciente.risco === "Alto" ? "#e74c3c" :
      paciente.risco === "Moderado" ? "#f1c40f" :
        "#2ecc71";

    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${paciente.nome || "—"}</td>
      <td style="color:${corRisco}; font-weight:bold">${paciente.risco || "—"}</td>
      <td>${paciente.setor || "—"}</td>
      <td>${paciente.data || "—"}</td>
      <td>${paciente.idade || calcularIdade(paciente.nascimento)}</td>
      <td>
        <button class="relatorio" onclick="verRelatorioPaciente(${index})">Ver</button>
        <button onclick="editarPaciente(${index})">Editar</button>
        <button onclick="excluirPaciente(${index})">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// -------------------------------
// RELATÓRIO PARA PACIENTES
// -------------------------------
function verRelatorioPaciente(index) {
  const pacientes = JSON.parse(localStorage.getItem("filaPacientes") || "[]");
  const paciente = pacientes[index];
  if (!paciente) return alert("Paciente não encontrado!");

  const respostas = Array.isArray(paciente.respostas) ? paciente.respostas : [];
  const respostasHtml = respostas.length
    ? respostas.map((r, i) => `<strong>Pergunta ${i + 1}:</strong> ${r}`).join("<br>")
    : "<em>Respostas não registradas.</em>";

  const relatorioTexto = document.getElementById("relatorioTexto");
  relatorioTexto.innerHTML = `
  <h2>Relatório</h2>
  <strong>Nome:</strong> ${paciente.nome}<br>
  <strong>Idade:</strong> ${calcularIdade(paciente.nascimento)}<br>
  <strong>Risco:</strong> ${paciente.risco}<br>
  <strong>Setor:</strong> ${paciente.setor}<br>
  <strong>Data de Cadastro:</strong> ${paciente.data || "—"}<br><br>
  <h3>Respostas do Quiz:</h3>
  ${respostasHtml}<br><br>
  <strong>Aguarde orientação médica</strong> ${analisarSintomas(respostas)}
`;

  document.getElementById("relatorioOverlay").style.display = "block";
  document.getElementById("relatorioBox").style.display = "block";
}

function fecharRelatorio() {
  document.getElementById("relatorioOverlay").style.display = "none";
  document.getElementById("relatorioBox").style.display = "none";
}

// -------------------------------
// CRUD - CREATE
// -------------------------------
function adicionarPaciente() {
  let pacientes = JSON.parse(localStorage.getItem("filaPacientes") || "[]");

  const nome = prompt("Nome do paciente:");
  if (!nome) return alert("Nome é obrigatório.");

  const risco = prompt("Risco (Baixo, Moderado, Alto):") || "Baixo";
  const setor = prompt("Setor:") || "Geral";
  let dataNascimento = prompt("Data de nascimento (YYYY-MM-DD):");
  if (!dataNascimento || isNaN(new Date(dataNascimento))) {
    alert("Data inválida! Use o formato YYYY-MM-DD.");
    return;
  }

  const data = new Date().toLocaleString("pt-BR");

  const respostas = [];
  let adicionarMais = confirm("Deseja adicionar respostas do quiz?");
  while (adicionarMais) {
    const resp = prompt("Digite uma resposta:");
    if (resp) respostas.push(resp);
    adicionarMais = confirm("Adicionar outra resposta?");
  }

  const novoPaciente = { nome, risco, setor, data, dataNascimento, respostas };
  pacientes.push(novoPaciente);

  localStorage.setItem("filaPacientes", JSON.stringify(pacientes));
  mostrarPacientes();
  alert("Paciente adicionado com sucesso!");
}

// -------------------------------
// CRUD - UPDATE
// -------------------------------
function editarPaciente(index) {
  let pacientes = JSON.parse(localStorage.getItem("filaPacientes") || "[]");
  let paciente = pacientes[index];
  if (!paciente) return alert("Paciente não encontrado!");

  const novoNome = prompt("Editar nome:", paciente.nome) || paciente.nome;
  const novoRisco = prompt("Editar risco (Baixo, Moderado, Alto):", paciente.risco) || paciente.risco;
  const novoSetor = prompt("Editar setor:", paciente.setor) || paciente.setor;

  let novoNascimento = prompt("Editar data de nascimento (YYYY-MM-DD):", paciente.dataNascimento);

  if (novoNascimento && isNaN(new Date(novoNascimento))) {
    alert("Data de nascimento inválida. Use o formato YYYY-MM-DD.");
    return;
  }

  paciente.nome = novoNome;
  paciente.risco = novoRisco;
  paciente.setor = novoSetor;
  paciente.dataNascimento = novoNascimento || paciente.dataNascimento;

  pacientes[index] = paciente;
  localStorage.setItem("filaPacientes", JSON.stringify(pacientes));
  mostrarPacientes();
}



// -------------------------------
// CRUD - DELETE (individual)
// -------------------------------
function excluirPaciente(index) {
  let pacientes = JSON.parse(localStorage.getItem("filaPacientes") || "[]");
  if (!confirm(`Excluir paciente ${pacientes[index].nome}?`)) return;
  pacientes.splice(index, 1);
  localStorage.setItem("filaPacientes", JSON.stringify(pacientes));
  mostrarPacientes();
}

// -------------------------------
// DELETE ALL - LIMPAR FILA
// -------------------------------
function excluirTodosPacientes() {
  let pacientes = JSON.parse(localStorage.getItem("filaPacientes") || "[]");
  if (pacientes.length === 0) return alert("Não há pacientes na fila.");

  if (confirm("Tem certeza que deseja excluir todos os pacientes da fila?")) {
    localStorage.removeItem("filaPacientes");
    mostrarPacientes();
    alert("Todos os pacientes foram excluídos com sucesso.");
  }
}

// -------------------------------
// FUNÇÕES AUXILIARES
// -------------------------------
function calcularIdade(dataNascimento) {
  if (!dataNascimento) return "—";
  const nascimento = new Date(dataNascimento);
  if (isNaN(nascimento)) return "—";

  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();

  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}


function analisarSintomas(respostas) {
  if (!respostas || respostas.length === 0) return "";
  if (respostas.includes("Febre") && respostas.includes("Dor de cabeça")) return "";
  if (respostas.includes("Coriza") && respostas.includes("Espirros")) return "";
  if (respostas.includes("Falta de ar")) return "";
  return "";
}

// -------------------------------
// GARANTIR QUE TODOS TENHAM DATA
// -------------------------------
function garantirDatas() {
  let pacientes = JSON.parse(localStorage.getItem("filaPacientes") || "[]");
  let alterado = false;

  pacientes = pacientes.map(p => {
    if (!p.data) {
      p.data = new Date().toLocaleString("pt-BR");
      alterado = true;
    }
    return p;
  });

  if (alterado) {
    localStorage.setItem("filaPacientes", JSON.stringify(pacientes));
  }
}
