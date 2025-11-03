import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Módulo de Proprietários
  proprietarios: router({
    list: protectedProcedure.query(async () => {
      return await db.getProprietarios();
    }),
    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await db.getProprietarioById(input.id);
    }),
    create: protectedProcedure.input(z.object({
      nome: z.string(),
      cpfCnpj: z.string(),
      telefone: z.string().optional(),
      email: z.string().optional(),
      endereco: z.string().optional(),
      observacoes: z.string().optional(),
    })).mutation(async ({ input }) => {
      return await db.createProprietario(input);
    }),
    update: protectedProcedure.input(z.object({
      id: z.number(),
      nome: z.string().optional(),
      cpfCnpj: z.string().optional(),
      telefone: z.string().optional(),
      email: z.string().optional(),
      endereco: z.string().optional(),
      observacoes: z.string().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateProprietario(id, data);
      return { success: true };
    }),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.deleteProprietario(input.id);
      return { success: true };
    }),
  }),

  // Módulo de Inquilinos
  inquilinos: router({
    list: protectedProcedure.query(async () => {
      return await db.getInquilinos();
    }),
    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await db.getInquilinoById(input.id);
    }),
    create: protectedProcedure.input(z.object({
      nome: z.string(),
      cpf: z.string(),
      telefone: z.string().optional(),
      email: z.string().optional(),
      endereco: z.string().optional(),
      observacoes: z.string().optional(),
    })).mutation(async ({ input }) => {
      return await db.createInquilino(input);
    }),
    update: protectedProcedure.input(z.object({
      id: z.number(),
      nome: z.string().optional(),
      cpf: z.string().optional(),
      telefone: z.string().optional(),
      email: z.string().optional(),
      endereco: z.string().optional(),
      observacoes: z.string().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateInquilino(id, data);
      return { success: true };
    }),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.deleteInquilino(input.id);
      return { success: true };
    }),
  }),

  // Módulo de Leads
  leads: router({
    list: protectedProcedure.query(async () => {
      return await db.getLeads();
    }),
    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await db.getLeadById(input.id);
    }),
    create: protectedProcedure.input(z.object({
      nome: z.string(),
      telefone: z.string().optional(),
      email: z.string().optional(),
      origem: z.string().optional(),
      status: z.enum(["novo", "contatado", "qualificado", "negociacao", "convertido", "perdido"]).optional(),
      corretorId: z.number().optional(),
      observacoes: z.string().optional(),
    })).mutation(async ({ input }) => {
      return await db.createLead(input);
    }),
    update: protectedProcedure.input(z.object({
      id: z.number(),
      nome: z.string().optional(),
      telefone: z.string().optional(),
      email: z.string().optional(),
      origem: z.string().optional(),
      status: z.enum(["novo", "contatado", "qualificado", "negociacao", "convertido", "perdido"]).optional(),
      corretorId: z.number().optional(),
      observacoes: z.string().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateLead(id, data);
      return { success: true };
    }),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.deleteLead(input.id);
      return { success: true };
    }),
  }),

  // Módulo de Demandas
  demandas: router({
    list: protectedProcedure.query(async () => {
      return await db.getDemandas();
    }),
    getByLeadId: protectedProcedure.input(z.object({ leadId: z.number() })).query(async ({ input }) => {
      return await db.getDemandasByLeadId(input.leadId);
    }),
    create: protectedProcedure.input(z.object({
      leadId: z.number(),
      tipoImovel: z.string().optional(),
      finalidade: z.enum(["venda", "locacao"]),
      cidade: z.string().optional(),
      bairro: z.string().optional(),
      precoMin: z.number().optional(),
      precoMax: z.number().optional(),
      quartos: z.number().optional(),
      suites: z.number().optional(),
      vagas: z.number().optional(),
      observacoes: z.string().optional(),
    })).mutation(async ({ input }) => {
      return await db.createDemanda(input);
    }),
    update: protectedProcedure.input(z.object({
      id: z.number(),
      tipoImovel: z.string().optional(),
      finalidade: z.enum(["venda", "locacao"]).optional(),
      cidade: z.string().optional(),
      bairro: z.string().optional(),
      precoMin: z.number().optional(),
      precoMax: z.number().optional(),
      quartos: z.number().optional(),
      suites: z.number().optional(),
      vagas: z.number().optional(),
      observacoes: z.string().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateDemanda(id, data);
      return { success: true };
    }),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.deleteDemanda(input.id);
      return { success: true };
    }),
  }),

  // Módulo de Corretores
  corretores: router({
    list: protectedProcedure.query(async () => {
      return await db.getCorretores();
    }),
    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await db.getCorretorById(input.id);
    }),
    create: protectedProcedure.input(z.object({
      userId: z.number().optional(),
      nome: z.string(),
      cpf: z.string(),
      creci: z.string(),
      telefone: z.string().optional(),
      email: z.string(),
      equipe: z.string().optional(),
      gerenteId: z.number().optional(),
      metaVendas: z.number().optional(),
      metaLocacoes: z.number().optional(),
      metaCaptacoes: z.number().optional(),
      ativo: z.boolean().optional(),
    })).mutation(async ({ input }) => {
      return await db.createCorretor(input);
    }),
    update: protectedProcedure.input(z.object({
      id: z.number(),
      nome: z.string().optional(),
      cpf: z.string().optional(),
      creci: z.string().optional(),
      telefone: z.string().optional(),
      email: z.string().optional(),
      equipe: z.string().optional(),
      gerenteId: z.number().optional(),
      metaVendas: z.number().optional(),
      metaLocacoes: z.number().optional(),
      metaCaptacoes: z.number().optional(),
      ativo: z.boolean().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateCorretor(id, data);
      return { success: true };
    }),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.deleteCorretor(input.id);
      return { success: true };
    }),
  }),

  // Módulo de Imóveis
  imoveis: router({
    list: protectedProcedure.query(async () => {
      return await db.getImoveis();
    }),
    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await db.getImovelById(input.id);
    }),
    create: protectedProcedure.input(z.object({
      codigo: z.string(),
      titulo: z.string(),
      tipo: z.string(),
      status: z.enum(["disponivel", "vendido", "alugado", "reservado"]).optional(),
      finalidade: z.enum(["venda", "locacao", "ambos"]),
      proprietarioId: z.number(),
      corretorCaptadorId: z.number().optional(),
      cep: z.string().optional(),
      endereco: z.string().optional(),
      numero: z.string().optional(),
      complemento: z.string().optional(),
      bairro: z.string().optional(),
      cidade: z.string().optional(),
      estado: z.string().optional(),
      latitude: z.string().optional(),
      longitude: z.string().optional(),
      areaUtil: z.number().optional(),
      areaTotal: z.number().optional(),
      quartos: z.number().optional(),
      suites: z.number().optional(),
      banheiros: z.number().optional(),
      vagas: z.number().optional(),
      andar: z.string().optional(),
      precoVenda: z.number().optional(),
      valorLocacao: z.number().optional(),
      valorCondominio: z.number().optional(),
      valorIptu: z.number().optional(),
      matriculaIptu: z.string().optional(),
      numeroReloglioLuz: z.string().optional(),
      numeroRelogioAgua: z.string().optional(),
      numeroMedidorGas: z.string().optional(),
      descricao: z.string().optional(),
      videoUrl: z.string().optional(),
      tourVirtualUrl: z.string().optional(),
    })).mutation(async ({ input }) => {
      return await db.createImovel(input);
    }),
    update: protectedProcedure.input(z.object({
      id: z.number(),
      codigo: z.string().optional(),
      titulo: z.string().optional(),
      tipo: z.string().optional(),
      status: z.enum(["disponivel", "vendido", "alugado", "reservado"]).optional(),
      finalidade: z.enum(["venda", "locacao", "ambos"]).optional(),
      proprietarioId: z.number().optional(),
      corretorCaptadorId: z.number().optional(),
      cep: z.string().optional(),
      endereco: z.string().optional(),
      numero: z.string().optional(),
      complemento: z.string().optional(),
      bairro: z.string().optional(),
      cidade: z.string().optional(),
      estado: z.string().optional(),
      latitude: z.string().optional(),
      longitude: z.string().optional(),
      areaUtil: z.number().optional(),
      areaTotal: z.number().optional(),
      quartos: z.number().optional(),
      suites: z.number().optional(),
      banheiros: z.number().optional(),
      vagas: z.number().optional(),
      andar: z.string().optional(),
      precoVenda: z.number().optional(),
      valorLocacao: z.number().optional(),
      valorCondominio: z.number().optional(),
      valorIptu: z.number().optional(),
      matriculaIptu: z.string().optional(),
      numeroReloglioLuz: z.string().optional(),
      numeroRelogioAgua: z.string().optional(),
      numeroMedidorGas: z.string().optional(),
      descricao: z.string().optional(),
      videoUrl: z.string().optional(),
      tourVirtualUrl: z.string().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateImovel(id, data);
      return { success: true };
    }),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.deleteImovel(input.id);
      return { success: true };
    }),
  }),

  // Módulo de Fotos de Imóveis
  fotosImoveis: router({
    getByImovelId: protectedProcedure.input(z.object({ imovelId: z.number() })).query(async ({ input }) => {
      return await db.getFotosByImovelId(input.imovelId);
    }),
    create: protectedProcedure.input(z.object({
      imovelId: z.number(),
      url: z.string(),
      fileKey: z.string(),
      ordem: z.number().optional(),
      capa: z.number().optional(),
    })).mutation(async ({ input }) => {
      return await db.createFotoImovel(input);
    }),
    update: protectedProcedure.input(z.object({
      id: z.number(),
      ordem: z.number().optional(),
      capa: z.number().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateFotoImovel(id, data);
      return { success: true };
    }),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.deleteFotoImovel(input.id);
      return { success: true };
    }),
  }),

  // Módulo de Transações
  transacoes: router({
    list: protectedProcedure.query(async () => {
      return await db.getTransacoes();
    }),
    create: protectedProcedure.input(z.object({
      imovelId: z.number(),
      tipo: z.enum(["venda", "locacao"]),
      valor: z.number(),
      corretorCaptadorId: z.number().optional(),
      corretorVendedorId: z.number(),
      clienteId: z.number().optional(),
      dataTransacao: z.date(),
      observacoes: z.string().optional(),
    })).mutation(async ({ input }) => {
      return await db.createTransacao(input);
    }),
  }),

  // Módulo de Comissões
  comissoes: router({
    list: protectedProcedure.query(async () => {
      return await db.getComissoes();
    }),
    getByCorretorId: protectedProcedure.input(z.object({ corretorId: z.number() })).query(async ({ input }) => {
      return await db.getComissoesByCorretorId(input.corretorId);
    }),
    create: protectedProcedure.input(z.object({
      transacaoId: z.number(),
      corretorId: z.number(),
      tipo: z.enum(["captacao", "venda"]),
      percentual: z.number(),
      valor: z.number(),
      status: z.enum(["pendente", "pago"]).optional(),
      dataPagamento: z.date().optional(),
    })).mutation(async ({ input }) => {
      return await db.createComissao(input);
    }),
    update: protectedProcedure.input(z.object({
      id: z.number(),
      status: z.enum(["pendente", "pago"]).optional(),
      dataPagamento: z.date().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateComissao(id, data);
      return { success: true };
    }),
  }),

  // Módulo de Atividades
  atividades: router({
    list: protectedProcedure.query(async () => {
      return await db.getAtividades();
    }),
    getByCorretorId: protectedProcedure.input(z.object({ corretorId: z.number() })).query(async ({ input }) => {
      return await db.getAtividadesByCorretorId(input.corretorId);
    }),
    create: protectedProcedure.input(z.object({
      corretorId: z.number(),
      tipo: z.enum(["ligacao", "visita", "reuniao", "outro"]),
      leadId: z.number().optional(),
      imovelId: z.number().optional(),
      titulo: z.string(),
      descricao: z.string().optional(),
      dataHora: z.date(),
      duracao: z.number().optional(),
      resultado: z.string().optional(),
    })).mutation(async ({ input }) => {
      return await db.createAtividade(input);
    }),
    update: protectedProcedure.input(z.object({
      id: z.number(),
      titulo: z.string().optional(),
      descricao: z.string().optional(),
      dataHora: z.date().optional(),
      duracao: z.number().optional(),
      resultado: z.string().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateAtividade(id, data);
      return { success: true };
    }),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.deleteAtividade(input.id);
      return { success: true };
    }),
  }),

  // Módulo de Configurações de Comissão
  configComissoes: router({
    list: protectedProcedure.query(async () => {
      return await db.getConfigComissoes();
    }),
    upsert: protectedProcedure.input(z.object({
      tipo: z.enum(["venda", "locacao"]),
      percentualCaptacao: z.number(),
      percentualVenda: z.number(),
    })).mutation(async ({ input }) => {
      await db.upsertConfigComissao(input.tipo, input.percentualCaptacao, input.percentualVenda);
      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
