import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Proprietários
export const proprietarios = mysqlTable("proprietarios", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  cpfCnpj: varchar("cpfCnpj", { length: 20 }).notNull().unique(),
  telefone: varchar("telefone", { length: 20 }),
  email: varchar("email", { length: 320 }),
  endereco: text("endereco"),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Proprietario = typeof proprietarios.$inferSelect;
export type InsertProprietario = typeof proprietarios.$inferInsert;

// Inquilinos
export const inquilinos = mysqlTable("inquilinos", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  cpf: varchar("cpf", { length: 14 }).notNull().unique(),
  telefone: varchar("telefone", { length: 20 }),
  email: varchar("email", { length: 320 }),
  endereco: text("endereco"),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Inquilino = typeof inquilinos.$inferSelect;
export type InsertInquilino = typeof inquilinos.$inferInsert;

// Leads/Clientes
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  telefone: varchar("telefone", { length: 20 }),
  email: varchar("email", { length: 320 }),
  origem: varchar("origem", { length: 100 }), // site, portal, indicação, etc
  status: mysqlEnum("status", ["novo", "contatado", "qualificado", "negociacao", "convertido", "perdido"]).default("novo").notNull(),
  corretorId: int("corretorId"),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

// Demandas de clientes
export const demandas = mysqlTable("demandas", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  tipoImovel: varchar("tipoImovel", { length: 50 }), // apartamento, casa, terreno, etc
  finalidade: mysqlEnum("finalidade", ["venda", "locacao"]).notNull(),
  cidade: varchar("cidade", { length: 100 }),
  bairro: varchar("bairro", { length: 100 }),
  precoMin: int("precoMin"),
  precoMax: int("precoMax"),
  quartos: int("quartos"),
  suites: int("suites"),
  vagas: int("vagas"),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Demanda = typeof demandas.$inferSelect;
export type InsertDemanda = typeof demandas.$inferInsert;

// Corretores
export const corretores = mysqlTable("corretores", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").unique(), // vincula ao user do sistema de auth
  nome: varchar("nome", { length: 255 }).notNull(),
  cpf: varchar("cpf", { length: 14 }).notNull().unique(),
  creci: varchar("creci", { length: 50 }).notNull(),
  telefone: varchar("telefone", { length: 20 }),
  email: varchar("email", { length: 320 }),
  equipe: varchar("equipe", { length: 100 }),
  gerenteId: int("gerenteId"),
  metaVendas: int("metaVendas").default(0),
  metaLocacoes: int("metaLocacoes").default(0),
  metaCaptacoes: int("metaCaptacoes").default(0),
  ativo: int("ativo").default(1).notNull(), // 0 ou 1 (boolean)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Corretor = typeof corretores.$inferSelect;
export type InsertCorretor = typeof corretores.$inferInsert;

// Imóveis
export const imoveis = mysqlTable("imoveis", {
  id: int("id").autoincrement().primaryKey(),
  codigo: varchar("codigo", { length: 50 }).notNull().unique(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  tipo: varchar("tipo", { length: 50 }).notNull(), // apartamento, casa, terreno, etc
  status: mysqlEnum("status", ["disponivel", "vendido", "alugado", "reservado"]).default("disponivel").notNull(),
  finalidade: mysqlEnum("finalidade", ["venda", "locacao", "ambos"]).notNull(),
  proprietarioId: int("proprietarioId").notNull(),
  corretorCaptadorId: int("corretorCaptadorId"),
  
  // Localização
  cep: varchar("cep", { length: 10 }),
  endereco: varchar("endereco", { length: 255 }),
  numero: varchar("numero", { length: 20 }),
  complemento: varchar("complemento", { length: 100 }),
  bairro: varchar("bairro", { length: 100 }),
  cidade: varchar("cidade", { length: 100 }),
  estado: varchar("estado", { length: 2 }),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  
  // Características
  areaUtil: int("areaUtil"),
  areaTotal: int("areaTotal"),
  quartos: int("quartos"),
  suites: int("suites"),
  banheiros: int("banheiros"),
  vagas: int("vagas"),
  andar: varchar("andar", { length: 20 }),
  
  // Valores
  precoVenda: int("precoVenda"),
  valorLocacao: int("valorLocacao"),
  valorCondominio: int("valorCondominio"),
  valorIptu: int("valorIptu"),
  
  // Dados de concessionárias
  matriculaIptu: varchar("matriculaIptu", { length: 100 }),
  numeroReloglioLuz: varchar("numeroReloglioLuz", { length: 100 }),
  numeroRelogioAgua: varchar("numeroRelogioAgua", { length: 100 }),
  numeroMedidorGas: varchar("numeroMedidorGas", { length: 100 }),
  
  // Descrição e mídia
  descricao: text("descricao"),
  videoUrl: varchar("videoUrl", { length: 500 }),
  tourVirtualUrl: varchar("tourVirtualUrl", { length: 500 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Imovel = typeof imoveis.$inferSelect;
export type InsertImovel = typeof imoveis.$inferInsert;

// Fotos dos imóveis
export const fotosImoveis = mysqlTable("fotosImoveis", {
  id: int("id").autoincrement().primaryKey(),
  imovelId: int("imovelId").notNull(),
  url: varchar("url", { length: 500 }).notNull(),
  fileKey: varchar("fileKey", { length: 500 }).notNull(),
  ordem: int("ordem").default(0).notNull(),
  capa: int("capa").default(0).notNull(), // 0 ou 1 (boolean)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FotoImovel = typeof fotosImoveis.$inferSelect;
export type InsertFotoImovel = typeof fotosImoveis.$inferInsert;

// Transações (vendas e locações)
export const transacoes = mysqlTable("transacoes", {
  id: int("id").autoincrement().primaryKey(),
  imovelId: int("imovelId").notNull(),
  tipo: mysqlEnum("tipo", ["venda", "locacao"]).notNull(),
  valor: int("valor").notNull(),
  corretorCaptadorId: int("corretorCaptadorId"),
  corretorVendedorId: int("corretorVendedorId").notNull(),
  clienteId: int("clienteId"), // referência ao lead que virou cliente
  dataTransacao: timestamp("dataTransacao").notNull(),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Transacao = typeof transacoes.$inferSelect;
export type InsertTransacao = typeof transacoes.$inferInsert;

// Comissões
export const comissoes = mysqlTable("comissoes", {
  id: int("id").autoincrement().primaryKey(),
  transacaoId: int("transacaoId").notNull(),
  corretorId: int("corretorId").notNull(),
  tipo: mysqlEnum("tipo", ["captacao", "venda"]).notNull(),
  percentual: int("percentual").notNull(), // percentual * 100 (ex: 3% = 300)
  valor: int("valor").notNull(),
  status: mysqlEnum("status", ["pendente", "pago"]).default("pendente").notNull(),
  dataPagamento: timestamp("dataPagamento"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Comissao = typeof comissoes.$inferSelect;
export type InsertComissao = typeof comissoes.$inferInsert;

// Atividades dos corretores (ligações, visitas, etc)
export const atividades = mysqlTable("atividades", {
  id: int("id").autoincrement().primaryKey(),
  corretorId: int("corretorId").notNull(),
  tipo: mysqlEnum("tipo", ["ligacao", "visita", "reuniao", "outro"]).notNull(),
  leadId: int("leadId"),
  imovelId: int("imovelId"),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  descricao: text("descricao"),
  dataHora: timestamp("dataHora").notNull(),
  duracao: int("duracao"), // em minutos
  resultado: text("resultado"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Atividade = typeof atividades.$inferSelect;
export type InsertAtividade = typeof atividades.$inferInsert;

// Configurações de comissão
export const configComissoes = mysqlTable("configComissoes", {
  id: int("id").autoincrement().primaryKey(),
  tipo: mysqlEnum("tipo", ["venda", "locacao"]).notNull().unique(),
  percentualCaptacao: int("percentualCaptacao").notNull(), // percentual * 100
  percentualVenda: int("percentualVenda").notNull(), // percentual * 100
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ConfigComissao = typeof configComissoes.$inferSelect;
export type InsertConfigComissao = typeof configComissoes.$inferInsert;