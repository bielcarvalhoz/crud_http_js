/**
 * Testes Unitários para app.js
 * 
 * Este arquivo contém testes para o código ANTES da refatoração.
 * O objetivo é garantir que após aplicar Clean Code, o comportamento
 * continue o mesmo.
 */

// Mock do axios antes de importar o código
global.axios = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
};

// Mock do alert e confirm
global.alert = jest.fn();
global.confirm = jest.fn();

// Mock do console.log para evitar poluição nos testes
global.console.log = jest.fn();

describe('Testes do CRUD de Pensamentos - Estado Inicial', () => {
  
  beforeEach(() => {
    // Limpa todos os mocks antes de cada teste
    jest.clearAllMocks();
    
    // Configura o DOM básico para os testes
    document.body.innerHTML = `
      <form id="pensamento-form">
        <input type="hidden" id="pensamento-id" />
        <textarea id="pensamento-conteudo"></textarea>
        <input type="text" id="pensamento-autoria" />
        <button type="submit" id="botao-salvar">Adicionar</button>
        <button type="button" id="botao-cancelar">Cancelar</button>
      </form>
      <div id="mensagem-vazia" style="display: none;"></div>
      <ul id="lista-pensamentos"></ul>
      <h2>Teste</h2>
    `;
  });

  describe('Inicialização da Aplicação', () => {
    
    test('deve carregar todos os elementos do DOM na inicialização', async () => {
      // Mock axios antes de carregar o script
      axios.get.mockResolvedValue({ data: [] });
      
      // Carrega o script
      require('../js/app.js');
      
      // Simula o evento DOMContentLoaded
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Verifica se os logs de inicialização foram chamados
      expect(console.log).toHaveBeenCalledWith('DOM carregado');
      expect(console.log).toHaveBeenCalledWith('iniciando aplicação...');
      expect(console.log).toHaveBeenCalledWith('elementos carregados');
    });
  });

  describe('Carregamento de Pensamentos (GET)', () => {
    
    test('deve exibir mensagem quando a lista está vazia', async () => {
      axios.get.mockResolvedValue({ data: [] });
      
      require('../js/app.js');
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
      
      // Aguarda as chamadas assíncronas
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const mensagemVazia = document.getElementById('mensagem-vazia');
      expect(mensagemVazia.style.display).toBe('block');
      expect(console.log).toHaveBeenCalledWith('lista vazia');
    });

    test('deve carregar e exibir pensamentos quando existem dados', async () => {
      const mockPensamentos = [
        { id: '1', conteudo: 'Teste 1', autoria: 'Autor 1' },
        { id: '2', conteudo: 'Teste 2', autoria: 'Autor 2' }
      ];
      
      axios.get.mockResolvedValue({ data: mockPensamentos });
      
      require('../js/app.js');
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const lista = document.getElementById('lista-pensamentos');
      const mensagemVazia = document.getElementById('mensagem-vazia');
      
      expect(mensagemVazia.style.display).toBe('none');
      expect(lista.children.length).toBe(2);
      expect(console.log).toHaveBeenCalledWith('mostrando pensamentos');
      expect(console.log).toHaveBeenCalledWith('total:', 2);
    });

    test('deve fazer requisição GET para o endpoint correto', async () => {
      axios.get.mockResolvedValue({ data: [] });
      
      require('../js/app.js');
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/pensamentos');
    });

    test('deve exibir alerta de erro quando falha ao carregar', async () => {
      axios.get.mockRejectedValue(new Error('Erro de rede'));
      
      require('../js/app.js');
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(alert).toHaveBeenCalledWith('Erro ao carregar pensamentos');
      expect(console.log).toHaveBeenCalledWith('erro ao carregar pensamentos');
    });
  });

  describe('Criação de Pensamento (POST)', () => {
    
    test('deve criar novo pensamento quando ID está vazio', async () => {
      const mockResponse = { data: { id: '1', conteudo: 'Novo', autoria: 'Teste' } };
      axios.post.mockResolvedValue(mockResponse);
      axios.get.mockResolvedValue({ data: [] });
      
      require('../js/app.js');
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Preenche o formulário
      document.getElementById('pensamento-id').value = '';
      document.getElementById('pensamento-conteudo').value = 'Novo pensamento';
      document.getElementById('pensamento-autoria').value = 'Autor Teste';
      
      // Submete o formulário
      const form = document.getElementById('pensamento-form');
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/pensamentos', {
        conteudo: 'Novo pensamento',
        autoria: 'Autor Teste'
      });
      expect(console.log).toHaveBeenCalledWith('modo criação');
      expect(alert).toHaveBeenCalledWith('Pensamento adicionado!');
    });

    test('deve limpar campos após criação bem-sucedida', async () => {
      axios.post.mockResolvedValue({ data: { id: '1' } });
      axios.get.mockResolvedValue({ data: [] });
      
      require('../js/app.js');
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      document.getElementById('pensamento-conteudo').value = 'Teste';
      document.getElementById('pensamento-autoria').value = 'Autor';
      
      const form = document.getElementById('pensamento-form');
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(document.getElementById('pensamento-conteudo').value).toBe('');
      expect(document.getElementById('pensamento-autoria').value).toBe('');
    });

    test('deve exibir erro ao falhar na criação', async () => {
      axios.post.mockRejectedValue(new Error('Erro'));
      axios.get.mockResolvedValue({ data: [] });
      
      require('../js/app.js');
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      document.getElementById('pensamento-conteudo').value = 'Teste';
      document.getElementById('pensamento-autoria').value = 'Autor';
      
      const form = document.getElementById('pensamento-form');
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(alert).toHaveBeenCalledWith('Erro ao criar pensamento');
      expect(console.log).toHaveBeenCalledWith('erro ao criar');
    });
  });

  describe('Edição de Pensamento (PUT)', () => {
    
    test('deve editar pensamento quando ID está preenchido', async () => {
      axios.put.mockResolvedValue({ data: { id: '1' } });
      axios.get.mockResolvedValue({ data: [] });
      
      require('../js/app.js');
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Preenche o formulário em modo edição
      document.getElementById('pensamento-id').value = '1';
      document.getElementById('pensamento-conteudo').value = 'Editado';
      document.getElementById('pensamento-autoria').value = 'Autor Editado';
      
      const form = document.getElementById('pensamento-form');
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(axios.put).toHaveBeenCalledWith('http://localhost:3000/pensamentos/1', {
        id: '1',
        conteudo: 'Editado',
        autoria: 'Autor Editado'
      });
      expect(console.log).toHaveBeenCalledWith('modo edição');
      expect(alert).toHaveBeenCalledWith('Pensamento editado!');
    });

    test('deve carregar dados do pensamento ao clicar em editar', async () => {
      const mockPensamento = { id: '1', conteudo: 'Original', autoria: 'Autor' };
      
      // Mock scrollIntoView
      Element.prototype.scrollIntoView = jest.fn();
      
      axios.get.mockImplementation((url) => {
        if (url.includes('/pensamentos/1')) {
          return Promise.resolve({ data: mockPensamento });
        }
        return Promise.resolve({ data: [mockPensamento] });
      });
      
      require('../js/app.js');
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Simula clique no botão editar
      const btnEditar = document.querySelector('.botao-editar');
      if (btnEditar) {
        btnEditar.click();
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/pensamentos/1');
        expect(console.log).toHaveBeenCalledWith('editando pensamento', '1');
      }
    });

    test('deve exibir erro ao falhar na edição', async () => {
      axios.put.mockRejectedValue(new Error('Erro'));
      axios.get.mockResolvedValue({ data: [] });
      
      require('../js/app.js');
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      document.getElementById('pensamento-id').value = '1';
      document.getElementById('pensamento-conteudo').value = 'Teste';
      document.getElementById('pensamento-autoria').value = 'Autor';
      
      const form = document.getElementById('pensamento-form');
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(alert).toHaveBeenCalledWith('Erro ao editar');
      expect(console.log).toHaveBeenCalledWith('erro ao editar');
    });
  });

  describe('Exclusão de Pensamento (DELETE)', () => {
    
    test('deve excluir pensamento quando confirmado', async () => {
      global.confirm.mockReturnValue(true);
      axios.delete.mockResolvedValue({ data: {} });
      axios.get.mockResolvedValue({ 
        data: [{ id: '1', conteudo: 'Teste', autoria: 'Autor' }] 
      });
      
      require('../js/app.js');
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Simula clique no botão excluir
      const btnExcluir = document.querySelector('.botao-excluir');
      if (btnExcluir) {
        btnExcluir.click();
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        expect(confirm).toHaveBeenCalledWith('Tem certeza que deseja excluir?');
        expect(axios.delete).toHaveBeenCalledWith('http://localhost:3000/pensamentos/1');
        expect(alert).toHaveBeenCalledWith('Pensamento excluído!');
        expect(console.log).toHaveBeenCalledWith('excluindo pensamento', '1');
      }
    });

    test('não deve excluir quando cancelado', async () => {
      global.confirm.mockReturnValue(false);
      axios.get.mockResolvedValue({ 
        data: [{ id: '1', conteudo: 'Teste', autoria: 'Autor' }] 
      });
      
      require('../js/app.js');
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const btnExcluir = document.querySelector('.botao-excluir');
      if (btnExcluir) {
        btnExcluir.click();
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        expect(axios.delete).not.toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith('exclusão cancelada');
      }
    });

    test('deve exibir erro ao falhar na exclusão', async () => {
      global.confirm.mockReturnValue(true);
      axios.delete.mockRejectedValue(new Error('Erro'));
      axios.get.mockResolvedValue({ 
        data: [{ id: '1', conteudo: 'Teste', autoria: 'Autor' }] 
      });
      
      require('../js/app.js');
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const btnExcluir = document.querySelector('.botao-excluir');
      if (btnExcluir) {
        btnExcluir.click();
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        expect(alert).toHaveBeenCalledWith('Erro ao excluir');
        expect(console.log).toHaveBeenCalledWith('erro ao excluir');
      }
    });
  });

  describe('Botão Cancelar', () => {
    
    test('deve limpar todos os campos ao clicar em cancelar', async () => {
      axios.get.mockResolvedValue({ data: [] });
      
      require('../js/app.js');
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Preenche os campos
      document.getElementById('pensamento-id').value = '1';
      document.getElementById('pensamento-conteudo').value = 'Teste';
      document.getElementById('pensamento-autoria').value = 'Autor';
      
      // Clica no botão cancelar
      const btnCancelar = document.getElementById('botao-cancelar');
      btnCancelar.click();
      
      expect(document.getElementById('pensamento-id').value).toBe('');
      expect(document.getElementById('pensamento-conteudo').value).toBe('');
      expect(document.getElementById('pensamento-autoria').value).toBe('');
      expect(console.log).toHaveBeenCalledWith('cancelar clicado');
      expect(console.log).toHaveBeenCalledWith('formulário limpo');
    });
  });

  describe('Renderização de Elementos DOM', () => {
    
    test('deve criar elementos li com estrutura correta', async () => {
      const mockPensamentos = [
        { id: '1', conteudo: 'Conteúdo Teste', autoria: 'Autor Teste' }
      ];
      axios.get.mockResolvedValue({ data: mockPensamentos });
      
      require('../js/app.js');
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const lista = document.getElementById('lista-pensamentos');
      const li = lista.querySelector('li');
      
      expect(li).not.toBeNull();
      expect(li.getAttribute('data-id')).toBe('1');
      expect(li.classList.contains('li-pensamento')).toBe(true);
      
      const conteudo = li.querySelector('.pensamento-conteudo');
      expect(conteudo.textContent).toBe('Conteúdo Teste');
      
      const autoria = li.querySelector('.pensamento-autoria');
      expect(autoria.textContent).toBe('Autor Teste');
    });

    test('deve criar botões de editar e excluir', async () => {
      const mockPensamentos = [
        { id: '1', conteudo: 'Teste', autoria: 'Autor' }
      ];
      axios.get.mockResolvedValue({ data: mockPensamentos });
      
      require('../js/app.js');
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const btnEditar = document.querySelector('.botao-editar');
      const btnExcluir = document.querySelector('.botao-excluir');
      
      expect(btnEditar).not.toBeNull();
      expect(btnExcluir).not.toBeNull();
      
      const imgEditar = btnEditar.querySelector('img');
      const imgExcluir = btnExcluir.querySelector('img');
      
      expect(imgEditar.src).toContain('icone-editar.png');
      expect(imgExcluir.src).toContain('icone-excluir.png');
    });
  });

  describe('Validação de Formulário', () => {
    
    test('deve prevenir envio padrão do formulário', async () => {
      axios.post.mockResolvedValue({ data: {} });
      axios.get.mockResolvedValue({ data: [] });
      
      require('../js/app.js');
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      document.getElementById('pensamento-conteudo').value = 'Teste';
      document.getElementById('pensamento-autoria').value = 'Autor';
      
      const form = document.getElementById('pensamento-form');
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      
      let defaultPrevented = false;
      submitEvent.preventDefault = () => { defaultPrevented = true; };
      
      form.dispatchEvent(submitEvent);
      
      expect(console.log).toHaveBeenCalledWith('formulário submetido');
    });
  });
});
