import { getDb } from "./db";
import { corretores } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export enum UserRole {
  ADMIN = "admin",
  GERENTE = "gerente",
  CORRETOR = "corretor",
  PROPRIETARIO = "proprietario",
}

export interface AuthUser {
  id: number;
  corretorId?: number;
  nome: string;
  email: string;
  role: UserRole;
}

/**
 * Busca um corretor pelo ID
 */
export async function getCorretorById(id: number): Promise<any> {
  const db = await getDb();
  if (!db) return null;

  const resultado = await db
    .select()
    .from(corretores)
    .where(eq(corretores.id, id))
    .limit(1);

  return resultado.length > 0 ? resultado[0] : null;
}

/**
 * Busca um corretor pelo email
 */
export async function getCorretorByEmail(email: string): Promise<any> {
  const db = await getDb();
  if (!db) return null;

  const resultado = await db
    .select()
    .from(corretores)
    .where(eq(corretores.email, email))
    .limit(1);

  return resultado.length > 0 ? resultado[0] : null;
}

/**
 * Determina o role de um corretor baseado em suas características
 */
export function determineRole(corretor: any): UserRole {
  // Se tem gerenteId, é um corretor comum
  if (corretor.gerenteId) {
    return UserRole.CORRETOR;
  }
  // Se gerencia outros corretores, é gerente
  // Você pode adicionar lógica aqui para determinar se é gerente
  return UserRole.CORRETOR;
}

/**
 * Cria um objeto de usuário autenticado a partir de um corretor
 */
export function createAuthUser(corretor: any): AuthUser {
  return {
    id: corretor.id,
    corretorId: corretor.id,
    nome: corretor.nome,
    email: corretor.email,
    role: determineRole(corretor),
  };
}

/**
 * Verifica se um usuário tem permissão para acessar um recurso
 */
export function hasPermission(user: AuthUser, resource: string, action: string): boolean {
  // Admin tem acesso a tudo
  if (user.role === UserRole.ADMIN) {
    return true;
  }

  // Gerente tem acesso a dados de seus corretores
  if (user.role === UserRole.GERENTE) {
    if (resource === "corretores" && (action === "list" || action === "read")) {
      return true;
    }
    if (resource === "imoveis" && (action === "list" || action === "read")) {
      return true;
    }
    if (resource === "comissoes" && (action === "list" || action === "read")) {
      return true;
    }
  }

  // Corretor tem acesso apenas aos seus dados
  if (user.role === UserRole.CORRETOR) {
    if (resource === "meus-imoveis" && (action === "list" || action === "read")) {
      return true;
    }
    if (resource === "minhas-atividades" && (action === "list" || action === "read")) {
      return true;
    }
    if (resource === "minhas-comissoes" && (action === "list" || action === "read")) {
      return true;
    }
    if (resource === "meus-leads" && (action === "list" || action === "read")) {
      return true;
    }
  }

  // Proprietário tem acesso apenas aos seus imóveis
  if (user.role === UserRole.PROPRIETARIO) {
    if (resource === "meus-imoveis" && (action === "list" || action === "read")) {
      return true;
    }
  }

  return false;
}

/**
 * Filtra dados baseado no role do usuário
 */
export function filterDataByRole(user: AuthUser, data: any[], resource: string): any[] {
  // Admin vê tudo
  if (user.role === UserRole.ADMIN) {
    return data;
  }

  // Gerente vê dados de seus corretores
  if (user.role === UserRole.GERENTE) {
    // Implementar lógica para filtrar por gerente
    return data;
  }

  // Corretor vê apenas seus dados
  if (user.role === UserRole.CORRETOR) {
    if (resource === "imoveis") {
      return data.filter((item: any) => item.corretorCaptadorId === user.corretorId);
    }
    if (resource === "leads") {
      return data.filter((item: any) => item.corretorId === user.corretorId);
    }
    if (resource === "atividades") {
      return data.filter((item: any) => item.corretorId === user.corretorId);
    }
    if (resource === "comissoes") {
      return data.filter((item: any) => item.corretorId === user.corretorId);
    }
  }

  return [];
}
