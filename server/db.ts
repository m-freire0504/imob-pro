import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users,
  proprietarios, InsertProprietario,
  inquilinos, InsertInquilino,
  leads, InsertLead,
  demandas, InsertDemanda,
  corretores, InsertCorretor,
  imoveis, InsertImovel,
  fotosImoveis, InsertFotoImovel,
  transacoes, InsertTransacao,
  comissoes, InsertComissao,
  atividades, InsertAtividade,
  configComissoes, InsertConfigComissao
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== PROPRIETÁRIOS =====
export async function getProprietarios() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(proprietarios).orderBy(proprietarios.nome);
}

export async function getProprietarioById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(proprietarios).where(eq(proprietarios.id, id)).limit(1);
  return result[0];
}

export async function createProprietario(data: InsertProprietario) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(proprietarios).values(data);
  return result;
}

export async function updateProprietario(id: number, data: Partial<InsertProprietario>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(proprietarios).set(data).where(eq(proprietarios.id, id));
}

export async function deleteProprietario(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(proprietarios).where(eq(proprietarios.id, id));
}

// ===== INQUILINOS =====
export async function getInquilinos() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(inquilinos).orderBy(inquilinos.nome);
}

export async function getInquilinoById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(inquilinos).where(eq(inquilinos.id, id)).limit(1);
  return result[0];
}

export async function createInquilino(data: InsertInquilino) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(inquilinos).values(data);
  return result;
}

export async function updateInquilino(id: number, data: Partial<InsertInquilino>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(inquilinos).set(data).where(eq(inquilinos.id, id));
}

export async function deleteInquilino(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(inquilinos).where(eq(inquilinos.id, id));
}

// ===== LEADS =====
export async function getLeads() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(leads).orderBy(leads.createdAt);
}

export async function getLeadById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  return result[0];
}

export async function createLead(data: InsertLead) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(leads).values(data);
  return result;
}

export async function updateLead(id: number, data: Partial<InsertLead>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(leads).set(data).where(eq(leads.id, id));
}

export async function deleteLead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(leads).where(eq(leads.id, id));
}

// ===== DEMANDAS =====
export async function getDemandas() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(demandas).orderBy(demandas.createdAt);
}

export async function getDemandasByLeadId(leadId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(demandas).where(eq(demandas.leadId, leadId));
}

export async function createDemanda(data: InsertDemanda) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(demandas).values(data);
  return result;
}

export async function updateDemanda(id: number, data: Partial<InsertDemanda>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(demandas).set(data).where(eq(demandas.id, id));
}

export async function deleteDemanda(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(demandas).where(eq(demandas.id, id));
}

// ===== CORRETORES =====
export async function getCorretores() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(corretores).orderBy(corretores.nome);
}

export async function getCorretorById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(corretores).where(eq(corretores.id, id)).limit(1);
  return result[0];
}

export async function createCorretor(data: InsertCorretor) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(corretores).values(data);
  return result;
}

export async function updateCorretor(id: number, data: Partial<InsertCorretor>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(corretores).set(data).where(eq(corretores.id, id));
}

export async function deleteCorretor(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(corretores).where(eq(corretores.id, id));
}

// ===== IMÓVEIS =====
export async function getImoveis() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(imoveis).orderBy(imoveis.createdAt);
}

export async function getImovelById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(imoveis).where(eq(imoveis.id, id)).limit(1);
  return result[0];
}

export async function createImovel(data: InsertImovel) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(imoveis).values(data);
  return result;
}

export async function updateImovel(id: number, data: Partial<InsertImovel>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(imoveis).set(data).where(eq(imoveis.id, id));
}

export async function deleteImovel(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(imoveis).where(eq(imoveis.id, id));
}

// ===== FOTOS DE IMÓVEIS =====
export async function getFotosByImovelId(imovelId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(fotosImoveis).where(eq(fotosImoveis.imovelId, imovelId)).orderBy(fotosImoveis.ordem);
}

export async function createFotoImovel(data: InsertFotoImovel) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(fotosImoveis).values(data);
  return result;
}

export async function updateFotoImovel(id: number, data: Partial<InsertFotoImovel>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(fotosImoveis).set(data).where(eq(fotosImoveis.id, id));
}

export async function deleteFotoImovel(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(fotosImoveis).where(eq(fotosImoveis.id, id));
}

// ===== TRANSAÇÕES =====
export async function getTransacoes() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(transacoes).orderBy(transacoes.dataTransacao);
}

export async function createTransacao(data: InsertTransacao) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(transacoes).values(data);
  return result;
}

// ===== COMISSÕES =====
export async function getComissoes() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(comissoes).orderBy(comissoes.createdAt);
}

export async function getComissoesByCorretorId(corretorId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(comissoes).where(eq(comissoes.corretorId, corretorId));
}

export async function createComissao(data: InsertComissao) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(comissoes).values(data);
  return result;
}

export async function updateComissao(id: number, data: Partial<InsertComissao>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(comissoes).set(data).where(eq(comissoes.id, id));
}

// ===== ATIVIDADES =====
export async function getAtividades() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(atividades).orderBy(atividades.dataHora);
}

export async function getAtividadesByCorretorId(corretorId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(atividades).where(eq(atividades.corretorId, corretorId));
}

export async function createAtividade(data: InsertAtividade) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(atividades).values(data);
  return result;
}

export async function updateAtividade(id: number, data: Partial<InsertAtividade>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(atividades).set(data).where(eq(atividades.id, id));
}

export async function deleteAtividade(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(atividades).where(eq(atividades.id, id));
}

// ===== CONFIGURAÇÕES DE COMISSÃO =====
export async function getConfigComissoes() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(configComissoes);
}

export async function upsertConfigComissao(tipo: "venda" | "locacao", percentualCaptacao: number, percentualVenda: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(configComissoes).values({
    tipo,
    percentualCaptacao,
    percentualVenda,
  }).onDuplicateKeyUpdate({
    set: {
      percentualCaptacao,
      percentualVenda,
    },
  });
}
