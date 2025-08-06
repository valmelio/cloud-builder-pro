import { Cliente, Divida, MovimentacaoFinanceira, VendaCartao } from '@/types';

// Mock data storage
let clientes: Cliente[] = [
  {
    id: '1',
    nome: 'Maria Silva',
    telefone: '(11) 99999-1234',
    limiteCredito: 500,
    saldoDevedor: 150,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    nome: 'João Santos',
    telefone: '(11) 88888-5678',
    limiteCredito: 300,
    saldoDevedor: 0,
    createdAt: new Date().toISOString(),
  },
];

let dividas: Divida[] = [
  {
    id: '1',
    clienteId: '1',
    valor: 150,
    descricao: 'Compras do mês',
    data: new Date().toISOString(),
    pago: false,
  },
];

let movimentacoes: MovimentacaoFinanceira[] = [
  {
    id: '1',
    tipo: 'entrada',
    valor: 1500,
    descricao: 'Vendas do dia',
    categoria: 'vendas',
    data: new Date().toISOString(),
  },
  {
    id: '2',
    tipo: 'saida',
    valor: 200,
    descricao: 'Compra de mercadorias',
    categoria: 'estoque',
    data: new Date().toISOString(),
  },
];

let vendasCartao: VendaCartao[] = [];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Clientes
  async getClientes(): Promise<Cliente[]> {
    await delay(300);
    return [...clientes];
  },

  async getCliente(id: string): Promise<Cliente | null> {
    await delay(200);
    return clientes.find(c => c.id === id) || null;
  },

  async createCliente(cliente: Omit<Cliente, 'id'>): Promise<Cliente> {
    await delay(300);
    const newCliente = {
      ...cliente,
      id: Date.now().toString(),
    };
    clientes.push(newCliente);
    return newCliente;
  },

  async updateCliente(id: string, updates: Partial<Cliente>): Promise<Cliente> {
    await delay(300);
    const index = clientes.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Cliente não encontrado');
    
    clientes[index] = { ...clientes[index], ...updates };
    return clientes[index];
  },

  async deleteCliente(id: string): Promise<void> {
    await delay(300);
    clientes = clientes.filter(c => c.id !== id);
    dividas = dividas.filter(d => d.clienteId !== id);
  },

  // Dívidas
  async getDividas(clienteId?: string): Promise<Divida[]> {
    await delay(300);
    return clienteId 
      ? dividas.filter(d => d.clienteId === clienteId)
      : [...dividas];
  },

  async createDivida(divida: Omit<Divida, 'id'>): Promise<Divida> {
    await delay(300);
    const newDivida = {
      ...divida,
      id: Date.now().toString(),
    };
    dividas.push(newDivida);
    
    // Atualizar saldo devedor do cliente
    const cliente = clientes.find(c => c.id === divida.clienteId);
    if (cliente) {
      cliente.saldoDevedor += divida.valor;
    }
    
    return newDivida;
  },

  async pagarDivida(id: string): Promise<Divida> {
    await delay(300);
    const divida = dividas.find(d => d.id === id);
    if (!divida) throw new Error('Dívida não encontrada');
    
    divida.pago = true;
    divida.dataPagamento = new Date().toISOString();
    
    // Atualizar saldo devedor do cliente
    const cliente = clientes.find(c => c.id === divida.clienteId);
    if (cliente) {
      cliente.saldoDevedor -= divida.valor;
    }
    
    // Adicionar movimentação financeira
    movimentacoes.push({
      id: Date.now().toString(),
      tipo: 'entrada',
      valor: divida.valor,
      descricao: `Pagamento de dívida - ${cliente?.nome}`,
      categoria: 'fiado',
      data: new Date().toISOString(),
    });
    
    return divida;
  },

  // Movimentações Financeiras
  async getMovimentacoes(): Promise<MovimentacaoFinanceira[]> {
    await delay(300);
    return [...movimentacoes].sort((a, b) => 
      new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  },

  async createMovimentacao(movimentacao: Omit<MovimentacaoFinanceira, 'id'>): Promise<MovimentacaoFinanceira> {
    await delay(300);
    const newMovimentacao = {
      ...movimentacao,
      id: Date.now().toString(),
    };
    movimentacoes.push(newMovimentacao);
    return newMovimentacao;
  },

  // Vendas Cartão
  async getVendasCartao(): Promise<VendaCartao[]> {
    await delay(300);
    return [...vendasCartao].sort((a, b) => 
      new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  },

  async processarVendaCartao(venda: Omit<VendaCartao, 'id' | 'status'>): Promise<VendaCartao> {
    await delay(2000); // Simular processamento
    
    const newVenda: VendaCartao = {
      ...venda,
      id: Date.now().toString(),
      status: Math.random() > 0.1 ? 'aprovada' : 'negada', // 90% aprovação
    };
    
    vendasCartao.push(newVenda);
    
    if (newVenda.status === 'aprovada') {
      // Adicionar movimentação financeira
      movimentacoes.push({
        id: Date.now().toString(),
        tipo: 'entrada',
        valor: newVenda.valor,
        descricao: `Venda no cartão - ${newVenda.parcelas}x`,
        categoria: 'cartao',
        data: new Date().toISOString(),
      });
    }
    
    return newVenda;
  },

  // Relatórios
  async getRelatorios() {
    await delay(500);
    
    const totalFiado = dividas
      .filter(d => !d.pago)
      .reduce((sum, d) => sum + d.valor, 0);
    
    const totalInadimplencia = dividas
      .filter(d => !d.pago && new Date(d.data) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .reduce((sum, d) => sum + d.valor, 0);
    
    const entradas = movimentacoes
      .filter(m => m.tipo === 'entrada')
      .reduce((sum, m) => sum + m.valor, 0);
    
    const saidas = movimentacoes
      .filter(m => m.tipo === 'saida')
      .reduce((sum, m) => sum + m.valor, 0);
    
    const saldoAtual = entradas - saidas;
    
    const vendasMes = movimentacoes
      .filter(m => {
        const dataMovimentacao = new Date(m.data);
        const agora = new Date();
        return dataMovimentacao.getMonth() === agora.getMonth() && 
               dataMovimentacao.getFullYear() === agora.getFullYear() &&
               m.tipo === 'entrada';
      })
      .reduce((sum, m) => sum + m.valor, 0);
    
    return {
      totalFiado,
      totalInadimplencia,
      saldoAtual,
      vendasMes,
      entradas,
      saidas,
    };
  },
};