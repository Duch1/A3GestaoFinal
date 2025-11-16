import re

def only_digits(value: str) -> str:
    return re.sub(r'\D', '', value or '')

def validar_cpf(cpf: str) -> bool:
    """Valida CPF com algoritmo de verificação dos dígitos."""
    if not cpf:
        return False
    cpf = only_digits(cpf)
    if len(cpf) != 11:
        return False
    # não aceitar sequências repetidas
    if cpf == cpf[0] * 11:
        return False

    nums = [int(c) for c in cpf]

    # 1º dígito verificador
    s = sum(nums[i] * (10 - i) for i in range(9))
    r = s % 11
    dv1 = 0 if r < 2 else 11 - r
    if dv1 != nums[9]:
        return False

    # 2º dígito verificador
    s = sum(nums[i] * (11 - i) for i in range(10))
    r = s % 11
    dv2 = 0 if r < 2 else 11 - r
    if dv2 != nums[10]:
        return False

    return True

def validar_email(email: str) -> bool:
    if not email:
        return False
    pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    return bool(re.match(pattern, email))

def validar_senha(senha: str) -> bool:
    return bool(senha and len(senha) >= 6)

def validar_campos_login(cpf: str, senha: str) -> bool:
    return validar_cpf(cpf) and validar_senha(senha)

def validar_campos_cadastro(nome: str, email: str, cpf: str, senha: str, senha2: str) -> bool:
    if not nome:
        return False
    if not validar_email(email):
        return False
    if not validar_cpf(cpf):
        return False
    if not validar_senha(senha):
        return False
    if senha != senha2:
        return False
    return True
