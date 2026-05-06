import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Paciente {
  id: number;
  nome: string;
  cpf: string;
}

interface Alimento {
  id: number;
  nome: string;
  unidadeMedida: string;
}

interface EstoqueItem {
  id: number;
  alimento: Alimento;
  quantidadeAtual: number;
}

interface TabelaItem {
  idAlimento: number;
  nomeAlimento: string;
  quantidade: number;
  unidadeMedida: string;
}

export const EfetuarDoacao: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacienteSelecionadoId, setPacienteSelecionadoId] = useState<number | ''>('');

  const [estoque, setEstoque] = useState<EstoqueItem[]>([]);
  const [alimentoSelecionadoId, setAlimentoSelecionadoId] = useState<number | ''>('');
  const [quantidadeInput, setQuantidadeInput] = useState<string>('');

  const [cesta, setCesta] = useState<TabelaItem[]>([]);
  const [observacoes, setObservacoes] = useState('');
  const [dataDoacao, setDataDoacao] = useState(new Date().toISOString().split('T')[0]);

  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');

  useEffect(() => {
    carregarPacientes();
    carregarEstoque();
  }, []);

  const carregarPacientes = async () => {
    try {
      // Usando a URL completa do seu backend Spring Boot
      const response = await axios.get<Paciente[]>('http://localhost:8080/api/pacientes');
      if (Array.isArray(response.data)) {
        setPacientes(response.data);
      } else {
        setPacientes([]);
      }
    } catch (err) {
      console.error('Erro ao buscar pacientes:', err);
      setPacientes([]); // Garante array vazio em caso de erro 404/500
    }
  };

  const carregarEstoque = async () => {
    try {
      // Usando o endpoint correto do seu backend (ajuste a rota se for /api/alimentos)
      const response = await axios.get<EstoqueItem[]>('http://localhost:8080/api/estoque');
      if (Array.isArray(response.data)) {
        setEstoque(response.data);
      } else {
        setEstoque([]);
      }
    } catch (err) {
      console.error('Erro ao buscar estoque:', err);
      setEstoque([]); // Garante array vazio em caso de erro 404/500
    }
  };

  const handleAdicionarItem = () => {
    setMensagemErro('');
    setMensagemSucesso('');

    if (!alimentoSelecionadoId) {
      setMensagemErro('Selecione um mantimento antes de adicionar.');
      return;
    }

    const qtd = parseFloat(quantidadeInput);
    if (isNaN(qtd) || qtd <= 0) {
      setMensagemErro('Insira uma quantidade válida e superior a zero.');
      return;
    }

    const itemEstoque = estoque.find(item => item.alimento.id === Number(alimentoSelecionadoId));
    if (!itemEstoque) return;

    if (qtd > itemEstoque.quantidadeAtual) {
      setMensagemErro(`Estoque insuficiente. Quantidade atual em estoque: ${itemEstoque.quantidadeAtual} ${itemEstoque.alimento.unidadeMedida}`);
      return;
    }

    const itemExistenteIdx = cesta.findIndex(i => i.idAlimento === itemEstoque.alimento.id);
    if (itemExistenteIdx > -1) {
      const novaCesta = [...cesta];
      const novaQtd = novaCesta[itemExistenteIdx].quantidade + qtd;

      if (novaQtd > itemEstoque.quantidadeAtual) {
        setMensagemErro(`A quantidade somada ultrapassa o estoque disponível de ${itemEstoque.quantidadeAtual} ${itemEstoque.alimento.unidadeMedida}`);
        return;
      }

      novaCesta[itemExistenteIdx].quantidade = novaQtd;
      setCesta(novaCesta);
    } else {
      const novoItem: TabelaItem = {
        idAlimento: itemEstoque.alimento.id,
        nomeAlimento: itemEstoque.alimento.nome,
        quantidade: qtd,
        unidadeMedida: itemEstoque.alimento.unidadeMedida
      };
      setCesta([...cesta, novoItem]);
    }

    setAlimentoSelecionadoId('');
    setQuantidadeInput('');
  };

  const handleRemoverItem = (idAlimento: number) => {
    setCesta(cesta.filter(i => i.idAlimento !== idAlimento));
  };

  const handleSalvarDoacao = async () => {
    setMensagemSucesso('');
    setMensagemErro('');

    if (!pacienteSelecionadoId) {
      setMensagemErro('Selecione o paciente beneficiário antes de salvar.');
      return;
    }

    if (cesta.length === 0) {
      setMensagemErro('Adicione pelo menos um mantimento na cesta.');
      return;
    }

    const payload = {
      idPaciente: Number(pacienteSelecionadoId),
      idProfissional: 1,
      observacoes: observacoes,
      itens: cesta.map(item => ({
        idAlimento: item.idAlimento,
        quantidade: item.quantidade
      }))
    };

    try {
      await axios.post('http://localhost:8080/api/doacoes', payload);
      setMensagemSucesso('Doação cadastrada com sucesso e estoque atualizado!');

      setCesta([]);
      setPacienteSelecionadoId('');
      setObservacoes('');
      carregarEstoque();
    } catch (err: any) {
      const msg = err.response?.data || 'Erro ao registrar doação no servidor.';
      setMensagemErro(msg);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Efetuar Doação</h2>

      <div style={styles.layoutGrid}>

        {/* Painel Esquerdo: Seleção do Beneficiário e Alimentos */}
        <div style={styles.painelLateral}>

          {/* Beneficiário */}
          <div style={styles.sectionBox}>
            <h3 style={styles.sectionTitle}>Beneficiário</h3>
            <select
              style={styles.select}
              value={pacienteSelecionadoId}
              onChange={(e) => setPacienteSelecionadoId(Number(e.target.value) || '')}
            >
              <option value="">Selecione o Paciente</option>
              {Array.isArray(pacientes) && pacientes.map(p => (
                <option key={p.id} value={p.id}>{p.nome} (CPF: {p.cpf})</option>
              ))}
            </select>
          </div>

          {/* Cesta de Alimentos (Formulário de Entrada) */}
          <div style={styles.sectionBox}>
            <h3 style={styles.sectionTitle}>Cesta de Alimentos</h3>

            <div style={styles.formGroup}>
              <label style={styles.label}>Mantimento</label>
              <select
                style={styles.select}
                value={alimentoSelecionadoId}
                onChange={(e) => setAlimentoSelecionadoId(Number(e.target.value) || '')}
              >
                <option value="">Selecione o Item</option>
                {Array.isArray(estoque) && estoque.map(item => (
                  <option key={item.id} value={item.alimento.id}>
                    {item.alimento.nome} ({item.quantidadeAtual} {item.alimento.unidadeMedida} disp.)
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Quantidade</label>
              <input
                type="number"
                placeholder="Ex: 5"
                style={styles.input}
                value={quantidadeInput}
                onChange={(e) => setQuantidadeInput(e.target.value)}
              />
            </div>

            <button type="button" onClick={handleAdicionarItem} style={styles.botaoAdicionar}>
              Adicionar mantimento
            </button>
          </div>
        </div>

        {/* Painel Direito: Tabela e Confirmação */}
        <div style={styles.painelPrincipal}>
          <div style={styles.tableCard}>
            <h3 style={styles.sectionTitle}>Mantimentos Adicionados</h3>

            <table style={styles.tabela}>
              <thead>
                <tr style={styles.theadRow}>
                  <th style={styles.th}>Código</th>
                  <th style={styles.th}>Item</th>
                  <th style={styles.th}>Quantidade</th>
                  <th style={styles.th}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {cesta.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={styles.emptyRow}>Nenhum alimento adicionado à cesta.</td>
                  </tr>
                ) : (
                  cesta.map(item => (
                    <tr key={item.idAlimento} style={styles.trow}>
                      <td style={styles.td}>{item.idAlimento}</td>
                      <td style={styles.td}>{item.nomeAlimento}</td>
                      <td style={styles.td}>{item.quantidade} {item.unidadeMedida}</td>
                      <td style={styles.td}>
                        <button
                          style={styles.botaoLixeira}
                          onClick={() => handleRemoverItem(item.idAlimento)}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Informações de Fechamento */}
            <div style={styles.footerCampos}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Data Doação</label>
                <input
                  type="date"
                  style={styles.input}
                  value={dataDoacao}
                  onChange={(e) => setDataDoacao(e.target.value)}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Observações</label>
                <textarea
                  placeholder="Escreva alguma observação aqui..."
                  style={styles.textarea}
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  rows={2}
                />
              </div>
            </div>

            {mensagemSucesso && <div style={styles.alertSucesso}>{mensagemSucesso}</div>}
            {mensagemErro && <div style={styles.alertErro}>{mensagemErro}</div>}

            <div style={styles.acoesContainer}>
              <button
                type="button"
                onClick={() => setCesta([])}
                style={styles.botaoCancelar}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSalvarDoacao}
                style={styles.botaoSalvar}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1200px',
    margin: '30px auto',
    padding: '0 20px',
    fontFamily: 'sans-serif'
  },
  header: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333'
  },
  layoutGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '24px'
  },
  painelLateral: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  painelPrincipal: {
    display: 'flex',
    flexDirection: 'column'
  },
  sectionBox: {
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  },
  sectionTitle: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#444',
    marginBottom: '14px',
    marginTop: '0'
  },
  formGroup: {
    marginBottom: '12px'
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#666',
    marginBottom: '4px'
  },
  select: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    padding: '9px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '9px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    fontFamily: 'sans-serif',
    resize: 'none',
    boxSizing: 'border-box'
  },
  botaoAdicionar: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '6px'
  },
  tableCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  tabela: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px'
  },
  theadRow: {
    borderBottom: '2px solid #eee'
  },
  th: {
    textAlign: 'left',
    padding: '10px',
    fontSize: '13px',
    color: '#555',
    fontWeight: 'bold'
  },
  trow: {
    borderBottom: '1px solid #f5f5f5'
  },
  td: {
    padding: '10px',
    fontSize: '14px',
    color: '#333'
  },
  emptyRow: {
    padding: '30px',
    textAlign: 'center',
    color: '#999',
    fontSize: '14px'
  },
  botaoLixeira: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer'
  },
  footerCampos: {
    marginTop: 'auto',
    borderTop: '1px solid #eee',
    paddingTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  acoesContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '16px'
  },
  botaoCancelar: {
    padding: '10px 20px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    backgroundColor: '#fff',
    color: '#666',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  botaoSalvar: {
    padding: '10px 24px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#28a745',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  alertSucesso: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #c3e6cb',
    fontSize: '14px',
    marginTop: '12px'
  },
  alertErro: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #f5c6cb',
    fontSize: '14px',
    marginTop: '12px'
  }
};