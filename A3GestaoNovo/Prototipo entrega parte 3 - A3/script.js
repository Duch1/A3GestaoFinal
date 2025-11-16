// Função de login
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const senha = document.getElementById("loginSenha").value;

    // Validações do login
    if (!email || !senha) {
        alert("Preencha todos os campos.");
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioEncontrado = usuarios.find(user => user.email === email && user.senha === senha);

    if (usuarioEncontrado) {
        alert("Login bem-sucedido!");
        window.location.href = "menu.html"; // Redireciona para a página menu.html após login
    } else {
        alert("E-mail ou Senha incorretos.");
    }
});
