import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface RelatorioDados {
  titulo: string;
  periodo?: string;
  dados: any[];
  colunas: Array<{
    chave: string;
    titulo: string;
    formatador?: (valor: any) => string;
  }>;
}

/**
 * Gera um relatório em PDF a partir de dados
 */
export async function gerarRelatorioPDF(config: RelatorioDados): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  let yPosition = margin;

  // Cabeçalho
  doc.setFontSize(16);
  doc.text(config.titulo, margin, yPosition);
  yPosition += 10;

  // Data/Período
  if (config.periodo) {
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Período: ${config.periodo}`, margin, yPosition);
    yPosition += 8;
  }

  // Tabela
  const colWidth = (pageWidth - 2 * margin) / config.colunas.length;
  const rowHeight = 7;

  // Cabeçalho da tabela
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.setFillColor(200, 200, 200);

  config.colunas.forEach((col, index) => {
    doc.text(col.titulo, margin + index * colWidth + 1, yPosition + 5);
  });

  yPosition += rowHeight;

  // Dados da tabela
  doc.setFontSize(9);
  doc.setFillColor(255, 255, 255);

  config.dados.forEach((linha, lineIndex) => {
    // Verificar se precisa de nova página
    if (yPosition + rowHeight > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;

      // Repetir cabeçalho
      doc.setFontSize(10);
      doc.setFillColor(200, 200, 200);
      config.colunas.forEach((col, index) => {
        doc.text(col.titulo, margin + index * colWidth + 1, yPosition + 5);
      });
      yPosition += rowHeight;
      doc.setFontSize(9);
    }

    // Desenhar linhas alternadas
    if (lineIndex % 2 === 0) {
      doc.setFillColor(240, 240, 240);
    } else {
      doc.setFillColor(255, 255, 255);
    }

    doc.rect(margin, yPosition, pageWidth - 2 * margin, rowHeight, "F");

    // Dados
    config.colunas.forEach((col, index) => {
      const valor = linha[col.chave];
      const textoFormatado = col.formatador ? col.formatador(valor) : String(valor || "");
      doc.text(textoFormatado, margin + index * colWidth + 1, yPosition + 5);
    });

    yPosition += rowHeight;
  });

  // Rodapé
  yPosition += 5;
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(`Gerado em ${new Date().toLocaleString("pt-BR")}`, margin, yPosition);

  // Download
  doc.save(`${config.titulo.toLowerCase().replace(/\s/g, "-")}.pdf`);
}

/**
 * Gera PDF a partir de um elemento HTML
 */
export async function gerarPDFdeHTML(
  elementId: string,
  nomeArquivo: string
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Elemento com ID "${elementId}" não encontrado`);
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? "landscape" : "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 10;

    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight - 20;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight - 20;
    }

    pdf.save(`${nomeArquivo}.pdf`);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    throw error;
  }
}

/**
 * Gera relatório de vendas
 */
export async function gerarRelatorioVendas(vendas: any[], periodo: string): Promise<void> {
  const totalVendas = vendas.length;
  const valorTotal = vendas.reduce((sum, v) => sum + (v.preco || 0), 0);
  const valorMedio = totalVendas > 0 ? valorTotal / totalVendas : 0;

  await gerarRelatorioPDF({
    titulo: "Relatório de Vendas",
    periodo,
    dados: vendas,
    colunas: [
      { chave: "titulo", titulo: "Imóvel" },
      { chave: "corretor", titulo: "Corretor" },
      { chave: "preco", titulo: "Preço", formatador: (v) => `R$ ${v.toLocaleString("pt-BR")}` },
      { chave: "dataVenda", titulo: "Data" },
    ],
  });
}

/**
 * Gera relatório de comissões
 */
export async function gerarRelatorioComissoes(comissoes: any[], periodo: string): Promise<void> {
  await gerarRelatorioPDF({
    titulo: "Relatório de Comissões",
    periodo,
    dados: comissoes,
    colunas: [
      { chave: "corretor", titulo: "Corretor" },
      { chave: "imovel", titulo: "Imóvel" },
      { chave: "percentual", titulo: "Percentual", formatador: (v) => `${v}%` },
      {
        chave: "valor",
        titulo: "Valor",
        formatador: (v) => `R$ ${v.toLocaleString("pt-BR")}`,
      },
      { chave: "status", titulo: "Status" },
    ],
  });
}

/**
 * Gera relatório de desempenho de corretores
 */
export async function gerarRelatorioDesempenho(corretores: any[], periodo: string): Promise<void> {
  await gerarRelatorioPDF({
    titulo: "Relatório de Desempenho de Corretores",
    periodo,
    dados: corretores,
    colunas: [
      { chave: "nome", titulo: "Corretor" },
      { chave: "vendas", titulo: "Vendas" },
      { chave: "locacoes", titulo: "Locações" },
      { chave: "captacoes", titulo: "Captações" },
      {
        chave: "comissoes",
        titulo: "Comissões",
        formatador: (v) => `R$ ${v.toLocaleString("pt-BR")}`,
      },
    ],
  });
}
