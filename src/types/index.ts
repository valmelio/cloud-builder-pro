export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  limiteCredito: number;
  saldoDevedor: number;
  createdAt: string;
}

export interface Divida {
  id: string;
  clienteId: string;
  valor: number;
  descricao: string;
  data: string;
  pago: boolean;
  dataPagamento?: string;
}

export interface MovimentacaoFinanceira {
  id: string;
  tipo: 'entrada' | 'saida';
  valor: number;
  descricao: string;
  categoria: string;
  data: string;
}

export interface VendaCartao {
  id: string;
  valor: number;
  parcelas: number;
  data: string;
  status: 'aprovada' | 'negada' | 'processando';
  bandeira: string;
}

export interface ContaDigital {
  saldo: number;
  movimentacoes: MovimentacaoFinanceira[];
}