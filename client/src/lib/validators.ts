/**
 * Valida CPF
 */
export function validarCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  const cpfLimpo = cpf.replace(/\D/g, "");

  // Verifica se tem 11 dígitos
  if (cpfLimpo.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;

  // Calcula primeiro dígito verificador
  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.substring(9, 10))) return false;

  // Calcula segundo dígito verificador
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.substring(10, 11))) return false;

  return true;
}

/**
 * Formata CPF
 */
export function formatarCPF(cpf: string): string {
  const cpfLimpo = cpf.replace(/\D/g, "");
  return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

/**
 * Valida CNPJ
 */
export function validarCNPJ(cnpj: string): boolean {
  // Remove caracteres não numéricos
  const cnpjLimpo = cnpj.replace(/\D/g, "");

  // Verifica se tem 14 dígitos
  if (cnpjLimpo.length !== 14) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cnpjLimpo)) return false;

  // Calcula primeiro dígito verificador
  let tamanho = cnpjLimpo.length - 2;
  let numeros = cnpjLimpo.substring(0, tamanho);
  let digitos = cnpjLimpo.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;

  // Calcula segundo dígito verificador
  tamanho = tamanho + 1;
  numeros = cnpjLimpo.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) return false;

  return true;
}

/**
 * Formata CNPJ
 */
export function formatarCNPJ(cnpj: string): string {
  const cnpjLimpo = cnpj.replace(/\D/g, "");
  return cnpjLimpo.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}

/**
 * Valida CEP
 */
export function validarCEP(cep: string): boolean {
  const cepLimpo = cep.replace(/\D/g, "");
  return cepLimpo.length === 8 && /^\d{8}$/.test(cepLimpo);
}

/**
 * Formata CEP
 */
export function formatarCEP(cep: string): string {
  const cepLimpo = cep.replace(/\D/g, "");
  return cepLimpo.replace(/(\d{5})(\d{3})/, "$1-$2");
}

/**
 * Busca endereço pelo CEP (usando ViaCEP API)
 */
export async function buscarEnderecoPorCEP(cep: string): Promise<{
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
} | null> {
  try {
    const cepLimpo = cep.replace(/\D/g, "");

    if (!validarCEP(cepLimpo)) {
      throw new Error("CEP inválido");
    }

    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const data = await response.json();

    if (data.erro) {
      return null;
    }

    return {
      rua: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      estado: data.uf,
    };
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    return null;
  }
}

/**
 * Valida email
 */
export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida telefone
 */
export function validarTelefone(telefone: string): boolean {
  const telefoneLimpo = telefone.replace(/\D/g, "");
  return telefoneLimpo.length >= 10 && telefoneLimpo.length <= 11;
}

/**
 * Formata telefone
 */
export function formatarTelefone(telefone: string): string {
  const telefoneLimpo = telefone.replace(/\D/g, "");

  if (telefoneLimpo.length === 10) {
    return telefoneLimpo.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  } else if (telefoneLimpo.length === 11) {
    return telefoneLimpo.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  return telefone;
}

/**
 * Valida URL
 */
export function validarURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Valida senha (mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número)
 */
export function validarSenha(senha: string): {
  valida: boolean;
  erros: string[];
} {
  const erros: string[] = [];

  if (senha.length < 8) {
    erros.push("Mínimo 8 caracteres");
  }

  if (!/[A-Z]/.test(senha)) {
    erros.push("Mínimo 1 letra maiúscula");
  }

  if (!/[a-z]/.test(senha)) {
    erros.push("Mínimo 1 letra minúscula");
  }

  if (!/[0-9]/.test(senha)) {
    erros.push("Mínimo 1 número");
  }

  return {
    valida: erros.length === 0,
    erros,
  };
}
