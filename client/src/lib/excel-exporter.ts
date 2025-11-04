import * as XLSX from "xlsx";

export interface ExportConfig {
  nomeArquivo: string;
  abas: Array<{
    nome: string;
    dados: any[];
    colunas: Array<{
      chave: string;
      titulo: string;
      largura?: number;
      formatador?: (valor: any) => any;
    }>;
  }>;
}

/**
 * Exporta dados para Excel
 */
export function exportarExcel(config: ExportConfig): void {
  const workbook = XLSX.utils.book_new();

  config.abas.forEach((aba) => {
    // Preparar dados com cabeçalho
    const dadosFormatados = aba.dados.map((linha) => {
      const novaLinha: any = {};
      aba.colunas.forEach((col) => {
        const valor = linha[col.chave];
        novaLinha[col.titulo] = col.formatador ? col.formatador(valor) : valor;
      });
      return novaLinha;
    });

    // Criar worksheet
    const worksheet = XLSX.utils.json_to_sheet(dadosFormatados);

    // Configurar largura das colunas
    const colWidths = aba.colunas.map((col) => ({
      wch: col.largura || 15,
    }));
    worksheet["!cols"] = colWidths;

    // Estilo do cabeçalho (se suportado)
    const headerRange = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + "1";
      if (!worksheet[address]) continue;
      worksheet[address].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "CCCCCC" } },
        alignment: { horizontal: "center", vertical: "center" },
      };
    }

    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, aba.nome);
  });

  // Salvar arquivo
  XLSX.writeFile(workbook, `${config.nomeArquivo}.xlsx`);
}

/**
 * Exporta lista de imóveis
 */
export function exportarImoveis(imoveis: any[]): void {
  exportarExcel({
    nomeArquivo: `imoveis-${new Date().toISOString().split("T")[0]}`,
    abas: [
      {
        nome: "Imóveis",
        dados: imoveis,
        colunas: [
          { chave: "titulo", titulo: "Título", largura: 25 },
          { chave: "tipo", titulo: "Tipo", largura: 12 },
          { chave: "endereco", titulo: "Endereço", largura: 30 },
          { chave: "cidade", titulo: "Cidade", largura: 15 },
          {
            chave: "preco",
            titulo: "Preço",
            largura: 15,
            formatador: (v) => (v ? `R$ ${v.toLocaleString("pt-BR")}` : ""),
          },
          { chave: "area", titulo: "Área (m²)", largura: 12 },
          { chave: "quartos", titulo: "Quartos", largura: 10 },
          { chave: "suites", titulo: "Suítes", largura: 10 },
          { chave: "vagas", titulo: "Vagas", largura: 10 },
          { chave: "status", titulo: "Status", largura: 12 },
        ],
      },
    ],
  });
}

/**
 * Exporta lista de leads
 */
export function exportarLeads(leads: any[]): void {
  exportarExcel({
    nomeArquivo: `leads-${new Date().toISOString().split("T")[0]}`,
    abas: [
      {
        nome: "Leads",
        dados: leads,
        colunas: [
          { chave: "nome", titulo: "Nome", largura: 20 },
          { chave: "email", titulo: "Email", largura: 25 },
          { chave: "telefone", titulo: "Telefone", largura: 15 },
          { chave: "whatsapp", titulo: "WhatsApp", largura: 15 },
          { chave: "origem", titulo: "Origem", largura: 15 },
          { chave: "status", titulo: "Status", largura: 12 },
          { chave: "corretor", titulo: "Corretor", largura: 20 },
        ],
      },
    ],
  });
}

/**
 * Exporta relatório de comissões
 */
export function exportarComissoes(comissoes: any[]): void {
  exportarExcel({
    nomeArquivo: `comissoes-${new Date().toISOString().split("T")[0]}`,
    abas: [
      {
        nome: "Comissões",
        dados: comissoes,
        colunas: [
          { chave: "corretor", titulo: "Corretor", largura: 20 },
          { chave: "imovel", titulo: "Imóvel", largura: 25 },
          { chave: "tipo", titulo: "Tipo", largura: 12 },
          {
            chave: "valorImovel",
            titulo: "Valor do Imóvel",
            largura: 15,
            formatador: (v) => `R$ ${v.toLocaleString("pt-BR")}`,
          },
          { chave: "percentual", titulo: "Percentual", largura: 12, formatador: (v) => `${v}%` },
          {
            chave: "valor",
            titulo: "Valor Comissão",
            largura: 15,
            formatador: (v) => `R$ ${v.toLocaleString("pt-BR")}`,
          },
          { chave: "status", titulo: "Status", largura: 12 },
          { chave: "dataPagamento", titulo: "Data Pagamento", largura: 15 },
        ],
      },
    ],
  });
}

/**
 * Exporta relatório de desempenho
 */
export function exportarDesempenho(corretores: any[]): void {
  exportarExcel({
    nomeArquivo: `desempenho-${new Date().toISOString().split("T")[0]}`,
    abas: [
      {
        nome: "Desempenho",
        dados: corretores,
        colunas: [
          { chave: "nome", titulo: "Corretor", largura: 20 },
          { chave: "vendas", titulo: "Vendas", largura: 10 },
          { chave: "metaVendas", titulo: "Meta Vendas", largura: 12 },
          { chave: "locacoes", titulo: "Locações", largura: 10 },
          { chave: "metaLocacoes", titulo: "Meta Locações", largura: 12 },
          { chave: "captacoes", titulo: "Captações", largura: 12 },
          { chave: "metaCaptacoes", titulo: "Meta Captações", largura: 12 },
          { chave: "comissoes", titulo: "Comissões", largura: 15, formatador: (v: any) => `R$ ${v.toLocaleString("pt-BR")}` },
        ],
      },
    ],
  });
}

/**
 * Exporta múltiplas abas
 */
export function exportarRelatorioCompleto(dados: {
  imoveis?: any[];
  leads?: any[];
  comissoes?: any[];
  corretores?: any[];
}): void {
  const abas = [];

  if (dados.imoveis && dados.imoveis.length > 0) {
    abas.push({
      nome: "Imóveis",
      dados: dados.imoveis,
      colunas: [
        { chave: "titulo", titulo: "Título", largura: 25 },
        { chave: "tipo", titulo: "Tipo", largura: 12 },
        { chave: "endereco", titulo: "Endereço", largura: 30 },
        { chave: "status", titulo: "Status", largura: 12 },
        {
          chave: "preco",
          titulo: "Preço",
          largura: 15,
          formatador: (v: any) => (v ? `R$ ${v.toLocaleString("pt-BR")}` : ""),
        },
      ],
    });
  }

  if (dados.leads && dados.leads.length > 0) {
    abas.push({
      nome: "Leads",
      dados: dados.leads,
      colunas: [
        { chave: "nome", titulo: "Nome", largura: 20 },
        { chave: "email", titulo: "Email", largura: 25 },
        { chave: "status", titulo: "Status", largura: 12 },
      ],
    });
  }

  if (dados.comissoes && dados.comissoes.length > 0) {
    abas.push({
      nome: "Comissões",
      dados: dados.comissoes,
      colunas: [
        { chave: "corretor", titulo: "Corretor", largura: 20 },
        { chave: "imovel", titulo: "Imóvel", largura: 25 },
        {
          chave: "valor",
          titulo: "Valor",
          largura: 15,
          formatador: (v: any) => `R$ ${v.toLocaleString("pt-BR")}`,
        },
      ],
    });
  }

  if (abas.length > 0) {
    exportarExcel({
      nomeArquivo: `relatorio-completo-${new Date().toISOString().split("T")[0]}`,
      abas,
    });
  }
}
