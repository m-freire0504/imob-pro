import bcrypt from "bcrypt";
import { getDb } from "./db";
import { corretores } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const SALT_ROUNDS = 10;

/**
 * Gera uma senha temporária aleatória
 */
export function gerarSenhaTemporaria(): string {
  const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let senha = "";
  for (let i = 0; i < 10; i++) {
    senha += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return senha;
}

/**
 * Criptografa uma senha
 */
export async function criptografarSenha(senha: string): Promise<string> {
  return bcrypt.hash(senha, SALT_ROUNDS);
}

/**
 * Verifica se uma senha está correta
 */
export async function verificarSenha(senha: string, hash: string): Promise<boolean> {
  return bcrypt.compare(senha, hash);
}

/**
 * Autentica um corretor com email e senha
 */
export async function autenticarCorretor(
  email: string,
  senha: string
): Promise<{
  sucesso: boolean;
  corretor?: any;
  motivo?: string;
  senhaTemporaria?: boolean;
}> {
  const db = await getDb();
  if (!db) {
    return { sucesso: false, motivo: "Banco de dados não disponível" };
  }

  try {
    // Buscar corretor por email
    const resultado = await db
      .select()
      .from(corretores)
      .where(eq(corretores.email, email))
      .limit(1);

    if (resultado.length === 0) {
      return { sucesso: false, motivo: "Email ou senha incorretos" };
    }

    const corretor = resultado[0];

    // Verificar se o corretor está ativo
    if (!corretor.ativo) {
      return { sucesso: false, motivo: "Corretor inativo" };
    }

    // Verificar se tem senha cadastrada
    if (!corretor.senhaHash) {
      return { sucesso: false, motivo: "Senha não configurada. Contate o administrador." };
    }

    // Verificar a senha
    const senhaValida = await verificarSenha(senha, corretor.senhaHash);
    if (!senhaValida) {
      return { sucesso: false, motivo: "Email ou senha incorretos" };
    }

    // Atualizar último acesso
    await db
      .update(corretores)
      .set({ ultimoAcesso: new Date() })
      .where(eq(corretores.id, corretor.id));

    return {
      sucesso: true,
      corretor: {
        id: corretor.id,
        nome: corretor.nome,
        email: corretor.email,
        creci: corretor.creci,
      },
      senhaTemporaria: corretor.senhaTemporaria,
    };
  } catch (error) {
    console.error("Erro ao autenticar corretor:", error);
    return { sucesso: false, motivo: "Erro ao autenticar" };
  }
}

/**
 * Altera a senha de um corretor
 */
export async function alterarSenhaCorretor(
  corretorId: number,
  senhaAtual: string,
  novaSenha: string
): Promise<{
  sucesso: boolean;
  motivo?: string;
}> {
  const db = await getDb();
  if (!db) {
    return { sucesso: false, motivo: "Banco de dados não disponível" };
  }

  try {
    // Buscar corretor
    const resultado = await db
      .select()
      .from(corretores)
      .where(eq(corretores.id, corretorId))
      .limit(1);

    if (resultado.length === 0) {
      return { sucesso: false, motivo: "Corretor não encontrado" };
    }

    const corretor = resultado[0];

    // Se for senha temporária, não precisa verificar a senha atual
    if (!corretor.senhaTemporaria) {
      // Verificar a senha atual
      if (!corretor.senhaHash) {
        return { sucesso: false, motivo: "Erro ao alterar senha" };
      }

      const senhaValida = await verificarSenha(senhaAtual, corretor.senhaHash);
      if (!senhaValida) {
        return { sucesso: false, motivo: "Senha atual incorreta" };
      }
    }

    // Criptografar nova senha
    const novoHash = await criptografarSenha(novaSenha);

    // Atualizar senha
    await db
      .update(corretores)
      .set({
        senhaHash: novoHash,
        senhaTemporaria: false,
        updatedAt: new Date(),
      })
      .where(eq(corretores.id, corretorId));

    return { sucesso: true };
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    return { sucesso: false, motivo: "Erro ao alterar senha" };
  }
}

/**
 * Reseta a senha de um corretor para uma senha temporária
 */
export async function resetarSenhaCorretor(corretorId: number): Promise<{
  sucesso: boolean;
  senhaTemporaria?: string;
  motivo?: string;
}> {
  const db = await getDb();
  if (!db) {
    return { sucesso: false, motivo: "Banco de dados não disponível" };
  }

  try {
    const senhaTemporaria = gerarSenhaTemporaria();
    const senhaHash = await criptografarSenha(senhaTemporaria);

    await db
      .update(corretores)
      .set({
        senhaHash,
        senhaTemporaria: true,
        updatedAt: new Date(),
      })
      .where(eq(corretores.id, corretorId));

    return { sucesso: true, senhaTemporaria };
  } catch (error) {
    console.error("Erro ao resetar senha:", error);
    return { sucesso: false, motivo: "Erro ao resetar senha" };
  }
}
