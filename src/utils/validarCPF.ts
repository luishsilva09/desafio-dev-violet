export function validarCPF(cpf: string): boolean {
    // remover caracteres nao numéricos
    cpf = cpf.replace(/[^\d]+/g, '')
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false
    // 1º Dígito Verificador:
    let soma = 0
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i)
    }

    let resto = 11 - (soma % 11)
    let dig1 = resto === 10 || resto === 11 ? 0 : resto
    if (dig1 !== parseInt(cpf.charAt(9))) return false
    // 2º Dígito Verificador
    soma = 0
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i)
    }

    resto = 11 - (soma % 11)
    let dig2 = resto === 10 || resto === 11 ? 0 : resto
    return dig2 === parseInt(cpf.charAt(10))
}
