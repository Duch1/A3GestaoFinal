let editingUserIndex = null;

function loadUsers() {
  const users = JSON.parse(localStorage.getItem('usuarios')) || [];
  displayUsers(users);
}

function displayUsers(users) {
  const userList = document.getElementById('userList');
  userList.innerHTML = '';

  if (users.length === 0) {
    userList.innerHTML = '<p>Nenhum usuário encontrado.</p>';
    return;
  }

  users.forEach((user, index) => {
    const userDiv = document.createElement('div');
    userDiv.classList.add('user');
    userDiv.innerHTML = `
      <div class="user-info">
        <h3>${user.nome}</h3>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Telefone:</strong> ${user.telefone}</p>
        <button onclick="editUser(${index}, this)">Editar</button>
        <button onclick="deleteUser(${index})">Excluir</button>
      </div>
      <div id="editForm-${index}" class="edit-form" style="display: none;">
        <h2>Editar Usuário</h2>
        <input type="text" id="editNome-${index}" value="${user.nome}" placeholder="Nome" />
        <input type="email" id="editEmail-${index}" value="${user.email}" placeholder="E-mail" />
        <input type="text" id="editTelefone-${index}" value="${user.telefone}" placeholder="Telefone" />
        <input type="password" id="editSenha-${index}" placeholder="Nova Senha" />
        <input type="password" id="editSenha2-${index}" placeholder="Confirmar Senha" />
        <button onclick="saveUserChanges(${index})">Salvar</button>
        <button onclick="cancelEdit(${index})">Cancelar</button>
      </div>
    `;
    userList.appendChild(userDiv);
  });
}

function editUser(index, buttonElement) {
  const users = JSON.parse(localStorage.getItem('usuarios')) || [];
  const user = users[index];

  if (!user) return;

  const editForm = document.getElementById(`editForm-${index}`);
  editForm.style.display = 'block';

  // Preenche os campos de edição com os valores do usuário
  document.getElementById(`editNome-${index}`).value = user.nome;
  document.getElementById(`editEmail-${index}`).value = user.email;
  document.getElementById(`editTelefone-${index}`).value = user.telefone;
  document.getElementById(`editSenha-${index}`).value = user.senha;
  document.getElementById(`editSenha2-${index}`).value = user.senha;

  // Esconde o botão de editar
  buttonElement.style.display = 'none';  // Isso oculta o botão de editar quando o formulário de edição é exibido
}

function saveUserChanges(index) {
  const nome = document.getElementById(`editNome-${index}`).value.trim();
  const email = document.getElementById(`editEmail-${index}`).value.trim();
  const telefone = document.getElementById(`editTelefone-${index}`).value.trim();
  const senha = document.getElementById(`editSenha-${index}`).value;
  const senha2 = document.getElementById(`editSenha2-${index}`).value;

  if (!nome || !email || !telefone || !senha || !senha2) {
    alert('Preencha todos os campos antes de salvar.');
    return;
  }
  if (senha !== senha2) {
    alert('As senhas não coincidem.');
    return;
  }

  const users = JSON.parse(localStorage.getItem('usuarios')) || [];
  if (index < 0 || index >= users.length) {
    alert('Índice inválido. Tente novamente.');
    return;
  }

  // Atualiza os dados do usuário
  users[index] = { nome, email, telefone, senha };
  localStorage.setItem('usuarios', JSON.stringify(users));

  alert('Usuário atualizado com sucesso!');
  loadUsers();  // Recarrega os usuários para refletir as alterações

  cancelEdit(index);  // Cancela a edição após salvar
}

function cancelEdit(index) {
  const editForm = document.getElementById(`editForm-${index}`);
  const editButton = document.querySelector(`#editForm-${index}`).previousElementSibling.querySelector('button');
  editForm.style.display = 'none';
  editButton.style.display = 'inline';  // Exibe novamente o botão de editar

  // Limpa os campos de edição
  clearEditFields(index);
}

function clearEditFields(index) {
  document.getElementById(`editNome-${index}`).value = '';
  document.getElementById(`editEmail-${index}`).value = '';
  document.getElementById(`editTelefone-${index}`).value = '';
  document.getElementById(`editSenha-${index}`).value = '';
  document.getElementById(`editSenha2-${index}`).value = '';
}

function deleteUser(index) {
  const users = JSON.parse(localStorage.getItem('usuarios')) || [];
  if (index < 0 || index >= users.length) {
    alert('Índice inválido para exclusão.');
    return;
  }
  if (!confirm('Tem certeza que quer excluir este usuário?')) return;

  users.splice(index, 1);
  localStorage.setItem('usuarios', JSON.stringify(users));
  loadUsers();  // Recarrega os usuários após exclusão
}

function searchUser() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const users = JSON.parse(localStorage.getItem('usuarios')) || [];

  if (!query) {
    loadUsers();  // Recarrega a lista completa de usuários se a busca estiver vazia
    return;
  }

  // Filtra os usuários que correspondem à pesquisa
  const filteredUsers = users.filter(user =>
    user.nome.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
  );

  displayUsers(filteredUsers);  // Exibe os usuários filtrados
}

window.onload = loadUsers;
