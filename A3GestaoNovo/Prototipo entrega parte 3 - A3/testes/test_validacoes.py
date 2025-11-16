import pytest
from validar_campos import (
    validar_cpf,
    validar_email,
    validar_senha,
    validar_campos_login,
    validar_campos_cadastro
)

# ---------- TESTES DE CPF ----------
def test_cpf_invalido_random():
    assert validar_cpf("12345678900") is False

def test_cpf_invalido_repetido():
    assert validar_cpf("11111111111") is False

# ---------- TESTES DE E-MAIL ----------
def test_email_valido():
    assert validar_email("teste@exemplo.com") is True

def test_email_sem_arroba():
    assert validar_email("testeexemplo.com") is False

# ---------- TESTES DE SENHA ----------
def test_senha_valida():
    assert validar_senha("123456") is True

def test_senha_curta():
    assert validar_senha("123") is False

# ---------- TESTES DE LOGIN (cpf + senha) ----------
def test_login_valido():
    assert validar_campos_login("52998224725", "123456") is True

def test_login_cpf_repetido():
    assert validar_campos_login("11111111111", "123456") is False

def test_login_cpf_invalido():
    assert validar_campos_login("12345678900", "123456") is False

def test_login_invalido_senha():
    assert validar_campos_login("52998224725", "") is False

# ---------- TESTES DE CADASTRO (com confirmacao de senha) ----------
def test_cadastro_valido():
    assert validar_campos_cadastro("João", "joao@exemplo.com", "52998224725", "654321", "654321") is True

def test_cadastro_sem_nome():
    assert validar_campos_cadastro("", "joao@exemplo.com", "52998224725", "654321", "654321") is False

def test_cadastro_email_invalido():
    assert validar_campos_cadastro("João", "joaoexemplo.com", "52998224725", "654321", "654321") is False

def test_cadastro_cpf_repetido():
    assert validar_campos_cadastro("João", "joao@exemplo.com", "11111111111", "654321", "654321") is False

def test_cadastro_cpf_invalido():
    assert validar_campos_cadastro("João", "joao@exemplo.com", "12345678900", "654321", "654321") is False

def test_cadastro_senhas_nao_conferem():
    assert validar_campos_cadastro("João", "joao@exemplo.com", "52998224725", "654321", "123456") is False