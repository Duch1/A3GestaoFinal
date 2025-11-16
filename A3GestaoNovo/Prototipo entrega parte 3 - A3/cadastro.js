// Função para cadastro de novo usuário
document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const nome = document.getElementById("newNome").value.trim();
    const email = document.getElementById("newEmail").value.trim();
    const telefone = document.getElementById("newTelefone").value.trim();
    const senha = document.getElementById("newSenha").value;
    const senhaConfirm = document.getElementById("newSenhaConfirm").value;

    // Validação de campos
    if (!nome || !email || !telefone || !senha || !senhaConfirm) {
        alert("Preencha todos os campos antes de cadastrar.");
        return;
    }
    if (senha !== senhaConfirm) {
        alert("As senhas não coincidem.");
        return;
    }

    // Cria o objeto do novo usuário
    const novoUsuario = { nome, email, telefone, senha };

    // Recupera os usuários existentes no localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Adiciona o novo usuário ao array
    usuarios.push(novoUsuario);

    // Salva os usuários novamente no localStorage
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    // Limpa o formulário
    document.getElementById("registerForm").reset();

    // Exibe uma mensagem de sucesso e redireciona para o login
    alert("Cadastro realizado com sucesso! Agora faça login.");
    window.location.href = "index.html";  // Redireciona para a tela de login após o cadastro
});
