/**
 * CRUD de Pensamentos - Memoteca
 *
 * Aplicação para gerenciar pensamentos, citações e ideias.
 * Utiliza JSON Server como backend e Axios para requisições HTTP.
 */

// Configuração da API
const API_BASE_URL = "http://localhost:3000";
const ENDPOINTS = {
  pensamentos: `${API_BASE_URL}/pensamentos`,
  pensamentoById: (id) => `${API_BASE_URL}/pensamentos/${id}`,
};

// Armazena referências aos elementos DOM para evitar múltiplas buscas
let elementosDOM = {};

// Instâncias globais das classes helper (compatibilidade com testes)
let pensamentoServiceInstance;
let formularioHelperInstance;
let uiHelperInstance;

/**
 * Service responsável pela comunicação com a API.
 * Abstrai as chamadas HTTP e centraliza a lógica de acesso aos dados.
 */
class PensamentoService {
  buscarTodos() {
    return axios.get(ENDPOINTS.pensamentos);
  }

  buscarPorId(id) {
    return axios.get(ENDPOINTS.pensamentoById(id));
  }

  criar(pensamento) {
    return axios.post(ENDPOINTS.pensamentos, pensamento);
  }

  atualizar(id, pensamento) {
    return axios.put(ENDPOINTS.pensamentoById(id), pensamento);
  }

  excluir(id) {
    return axios.delete(ENDPOINTS.pensamentoById(id));
  }
}

/**
 * Helper para manipulação do formulário.
 * Centraliza operações de leitura, escrita e limpeza dos campos.
 */
class FormularioHelper {
  constructor(elementos) {
    this.elementos = elementos;
  }

  limpar() {
    this.elementos.inputId.value = "";
    this.elementos.textareaConteudo.value = "";
    this.elementos.inputAutoria.value = "";
  }

  obterDados() {
    return {
      id: this.elementos.inputId.value,
      conteudo: this.elementos.textareaConteudo.value,
      autoria: this.elementos.inputAutoria.value,
    };
  }

  preencher(pensamento) {
    this.elementos.inputId.value = pensamento.id;
    this.elementos.textareaConteudo.value = pensamento.conteudo;
    this.elementos.inputAutoria.value = pensamento.autoria;
  }

  // Verifica se existe ID preenchido (indica modo de edição)
  estaEmModoEdicao() {
    return this.elementos.inputId.value !== "";
  }
}

/**
 * Helper para operações de interface do usuário.
 * Gerencia alertas, visibilidade de elementos e navegação.
 */
class UIHelper {
  constructor(elementos) {
    this.elementos = elementos;
  }

  exibirMensagem(mensagem) {
    alert(mensagem);
  }

  exibirMensagemVazia() {
    this.elementos.mensagemVazia.style.display = "block";
  }

  ocultarMensagemVazia() {
    this.elementos.mensagemVazia.style.display = "none";
  }

  limparLista() {
    this.elementos.listaPensamentos.innerHTML = "";
  }

  scrollParaFormulario() {
    document.querySelector("h2").scrollIntoView({ behavior: "smooth" });
  }
}

/**
 * Controller que coordena as operações da aplicação.
 * Gerencia a interação entre Service, Helpers e a interface.
 */
class PensamentoController {
  constructor(elementos) {
    this.elementos = elementos;
    this.service = new PensamentoService();
    this.formularioHelper = new FormularioHelper(elementos);
    this.uiHelper = new UIHelper(elementos);
  }

  inicializar() {
    console.log("iniciando aplicação...");
    console.log("elementos carregados");
    this.configurarEventListeners();
    this.carregarPensamentos();
    console.log("aplicação inicializada com sucesso");
  }

  configurarEventListeners() {
    this.elementos.formulario.addEventListener("submit", (e) => this.manipularSubmissaoFormulario(e));
    this.elementos.botaoCancelar.addEventListener("click", () => this.manipularCancelamento());
  }

  manipularSubmissaoFormulario(evento) {
    evento.preventDefault();
    console.log("formulário submetido");

    const dados = this.formularioHelper.obterDados();
    console.log("id:", dados.id);
    console.log("conteudo:", dados.conteudo);
    console.log("autoria:", dados.autoria);

    if (this.formularioHelper.estaEmModoEdicao()) {
      console.log("modo edição");
      this.atualizarPensamento(dados);
    } else {
      console.log("modo criação");
      this.salvarNovoPensamento(dados);
    }
  }

  salvarNovoPensamento(dados) {
    const pensamento = {
      conteudo: dados.conteudo,
      autoria: dados.autoria,
    };

    this.service
      .criar(pensamento)
      .then((resposta) => {
        console.log("criado com sucesso");
        console.log(resposta);
        this.uiHelper.exibirMensagem("Pensamento adicionado!");
        this.formularioHelper.limpar();
        this.carregarPensamentos();
      })
      .catch((erro) => {
        console.log("erro ao criar");
        console.log(erro);
        this.uiHelper.exibirMensagem("Erro ao criar pensamento");
      });
  }

  atualizarPensamento(dados) {
    const pensamento = {
      id: dados.id,
      conteudo: dados.conteudo,
      autoria: dados.autoria,
    };

    this.service
      .atualizar(dados.id, pensamento)
      .then((resposta) => {
        console.log("editado com sucesso");
        console.log(resposta);
        this.uiHelper.exibirMensagem("Pensamento editado!");
        this.formularioHelper.limpar();
        this.carregarPensamentos();
      })
      .catch((erro) => {
        console.log("erro ao editar");
        console.log(erro);
        this.uiHelper.exibirMensagem("Erro ao editar");
      });
  }

  manipularCancelamento() {
    console.log("cancelar clicado");
    this.formularioHelper.limpar();
    console.log("formulário limpo");
  }

  carregarPensamentos() {
    console.log("carregando pensamentos...");
    this.service
      .buscarTodos()
      .then((resposta) => {
        console.log("pensamentos carregados");
        console.log(resposta);
        console.log("total:", resposta.data.length);
        this.renderizarListaPensamentos(resposta.data);
      })
      .catch((erro) => {
        console.log("erro ao carregar pensamentos");
        console.log(erro);
        this.uiHelper.exibirMensagem("Erro ao carregar pensamentos");
      });
  }

  renderizarListaPensamentos(pensamentos) {
    this.uiHelper.limparLista();

    if (pensamentos.length === 0) {
      console.log("lista vazia");
      this.uiHelper.exibirMensagemVazia();
      return;
    }

    console.log("mostrando pensamentos");
    this.uiHelper.ocultarMensagemVazia();
    pensamentos.forEach((pensamento, index) => {
      console.log("adicionando pensamento", index);
      const itemLista = this.criarElementoPensamento(pensamento);
      this.elementos.listaPensamentos.appendChild(itemLista);
      console.log("pensamento adicionado ao DOM");
    });

    console.log("renderização completa");
  }

  criarElementoPensamento(pensamento) {
    const itemLista = document.createElement("li");
    itemLista.setAttribute("data-id", pensamento.id);
    itemLista.classList.add("li-pensamento");

    const iconeAspas = this.criarIconeAspas();
    const divConteudo = this.criarDivConteudo(pensamento.conteudo);
    const divAutoria = this.criarDivAutoria(pensamento.autoria);
    const divIcones = this.criarDivIcones(pensamento.id);

    itemLista.appendChild(iconeAspas);
    itemLista.appendChild(divConteudo);
    itemLista.appendChild(divAutoria);
    itemLista.appendChild(divIcones);

    return itemLista;
  }

  criarIconeAspas() {
    const iconeAspas = document.createElement("img");
    iconeAspas.src = "assets/imagens/aspas-azuis.png";
    iconeAspas.alt = "Aspas azuis";
    iconeAspas.classList.add("icone-aspas");
    return iconeAspas;
  }

  criarDivConteudo(conteudo) {
    const divConteudo = document.createElement("div");
    divConteudo.textContent = conteudo;
    divConteudo.classList.add("pensamento-conteudo");
    return divConteudo;
  }

  criarDivAutoria(autoria) {
    const divAutoria = document.createElement("div");
    divAutoria.textContent = autoria;
    divAutoria.classList.add("pensamento-autoria");
    return divAutoria;
  }

  criarDivIcones(pensamentoId) {
    const divIcones = document.createElement("div");
    divIcones.classList.add("icones");

    const botaoEditar = this.criarBotaoEditar(pensamentoId);
    const botaoExcluir = this.criarBotaoExcluir(pensamentoId);

    divIcones.appendChild(botaoEditar);
    divIcones.appendChild(botaoExcluir);

    return divIcones;
  }

  criarBotaoEditar(pensamentoId) {
    const botaoEditar = document.createElement("button");
    botaoEditar.classList.add("botao-editar");

    const imagemEditar = document.createElement("img");
    imagemEditar.src = "assets/imagens/icone-editar.png";
    imagemEditar.alt = "Editar";
    botaoEditar.appendChild(imagemEditar);

    botaoEditar.onclick = () => this.carregarPensamentoParaEdicao(pensamentoId);

    return botaoEditar;
  }

  carregarPensamentoParaEdicao(pensamentoId) {
    console.log("editando pensamento", pensamentoId);
    this.uiHelper.scrollParaFormulario();

    this.service
      .buscarPorId(pensamentoId)
      .then((resposta) => {
        console.log("pensamento carregado para edição");
        console.log(resposta);
        this.formularioHelper.preencher(resposta.data);
        console.log("formulário preenchido");
      })
      .catch((erro) => {
        console.log("erro ao buscar pensamento");
        console.log(erro);
        this.uiHelper.exibirMensagem("Erro ao buscar pensamento");
      });
  }

  criarBotaoExcluir(pensamentoId) {
    const botaoExcluir = document.createElement("button");
    botaoExcluir.classList.add("botao-excluir");

    const imagemExcluir = document.createElement("img");
    imagemExcluir.src = "assets/imagens/icone-excluir.png";
    imagemExcluir.alt = "Excluir";
    botaoExcluir.appendChild(imagemExcluir);

    botaoExcluir.onclick = () => this.confirmarExclusao(pensamentoId);

    return botaoExcluir;
  }

  confirmarExclusao(pensamentoId) {
    console.log("excluindo pensamento", pensamentoId);
    const confirmado = confirm("Tem certeza que deseja excluir?");

    if (confirmado) {
      this.excluirPensamento(pensamentoId);
    } else {
      console.log("exclusão cancelada");
    }
  }

  excluirPensamento(pensamentoId) {
    this.service
      .excluir(pensamentoId)
      .then((resposta) => {
        console.log("excluído com sucesso");
        console.log(resposta);
        this.uiHelper.exibirMensagem("Pensamento excluído!");
        this.carregarPensamentos();
      })
      .catch((erro) => {
        console.log("erro ao excluir");
        console.log(erro);
        this.uiHelper.exibirMensagem("Erro ao excluir");
      });
  }
}

// ========== FUNÇÕES DE COMPATIBILIDADE (para testes legados) ==========
// Estas funções delegam para as instâncias das classes OO

function inicializarAplicacao() {
  console.log("iniciando aplicação...");
  carregarElementosDOM();
  console.log("elementos carregados");
  configurarEventListeners();
  carregarPensamentos();
  console.log("aplicação inicializada com sucesso");
}

function carregarElementosDOM() {
  elementosDOM = {
    listaPensamentos: document.getElementById("lista-pensamentos"),
    mensagemVazia: document.getElementById("mensagem-vazia"),
    formulario: document.getElementById("pensamento-form"),
    botaoSalvar: document.getElementById("botao-salvar"),
    botaoCancelar: document.getElementById("botao-cancelar"),
    inputId: document.getElementById("pensamento-id"),
    textareaConteudo: document.getElementById("pensamento-conteudo"),
    inputAutoria: document.getElementById("pensamento-autoria"),
  };

  pensamentoServiceInstance = new PensamentoService();
  formularioHelperInstance = new FormularioHelper(elementosDOM);
  uiHelperInstance = new UIHelper(elementosDOM);
}

function configurarEventListeners() {
  elementosDOM.formulario.addEventListener("submit", manipularSubmissaoFormulario);
  elementosDOM.botaoCancelar.addEventListener("click", manipularCancelamento);
}

function manipularSubmissaoFormulario(evento) {
  evento.preventDefault();
  console.log("formulário submetido");
  const dados = formularioHelperInstance.obterDados();
  console.log("id:", dados.id);
  console.log("conteudo:", dados.conteudo);
  console.log("autoria:", dados.autoria);

  if (formularioHelperInstance.estaEmModoEdicao()) {
    console.log("modo edição");
    atualizarPensamento(dados);
  } else {
    console.log("modo criação");
    salvarNovoPensamento(dados);
  }
}

function salvarNovoPensamento(dados) {
  const pensamento = { conteudo: dados.conteudo, autoria: dados.autoria };
  pensamentoServiceInstance
    .criar(pensamento)
    .then((resposta) => {
      console.log("criado com sucesso");
      console.log(resposta);
      uiHelperInstance.exibirMensagem("Pensamento adicionado!");
      formularioHelperInstance.limpar();
      carregarPensamentos();
    })
    .catch((erro) => {
      console.log("erro ao criar");
      console.log(erro);
      uiHelperInstance.exibirMensagem("Erro ao criar pensamento");
    });
}

function atualizarPensamento(dados) {
  const pensamento = { id: dados.id, conteudo: dados.conteudo, autoria: dados.autoria };
  pensamentoServiceInstance
    .atualizar(dados.id, pensamento)
    .then((resposta) => {
      console.log("editado com sucesso");
      console.log(resposta);
      uiHelperInstance.exibirMensagem("Pensamento editado!");
      formularioHelperInstance.limpar();
      carregarPensamentos();
    })
    .catch((erro) => {
      console.log("erro ao editar");
      console.log(erro);
      uiHelperInstance.exibirMensagem("Erro ao editar");
    });
}

function manipularCancelamento() {
  console.log("cancelar clicado");
  formularioHelperInstance.limpar();
  console.log("formulário limpo");
}

function carregarPensamentos() {
  console.log("carregando pensamentos...");
  pensamentoServiceInstance
    .buscarTodos()
    .then((resposta) => {
      console.log("pensamentos carregados");
      console.log(resposta);
      console.log("total:", resposta.data.length);
      renderizarListaPensamentos(resposta.data);
    })
    .catch((erro) => {
      console.log("erro ao carregar pensamentos");
      console.log(erro);
      uiHelperInstance.exibirMensagem("Erro ao carregar pensamentos");
    });
}

function renderizarListaPensamentos(pensamentos) {
  uiHelperInstance.limparLista();
  if (pensamentos.length === 0) {
    console.log("lista vazia");
    uiHelperInstance.exibirMensagemVazia();
    return;
  }
  console.log("mostrando pensamentos");
  uiHelperInstance.ocultarMensagemVazia();
  pensamentos.forEach((pensamento, index) => {
    console.log("adicionando pensamento", index);
    const itemLista = criarElementoPensamento(pensamento);
    elementosDOM.listaPensamentos.appendChild(itemLista);
    console.log("pensamento adicionado ao DOM");
  });
  console.log("renderização completa");
}

function criarElementoPensamento(pensamento) {
  const itemLista = document.createElement("li");
  itemLista.setAttribute("data-id", pensamento.id);
  itemLista.classList.add("li-pensamento");
  itemLista.appendChild(criarIconeAspas());
  itemLista.appendChild(criarDivConteudo(pensamento.conteudo));
  itemLista.appendChild(criarDivAutoria(pensamento.autoria));
  itemLista.appendChild(criarDivIcones(pensamento.id));
  return itemLista;
}

function criarIconeAspas() {
  const iconeAspas = document.createElement("img");
  iconeAspas.src = "assets/imagens/aspas-azuis.png";
  iconeAspas.alt = "Aspas azuis";
  iconeAspas.classList.add("icone-aspas");
  return iconeAspas;
}

function criarDivConteudo(conteudo) {
  const divConteudo = document.createElement("div");
  divConteudo.textContent = conteudo;
  divConteudo.classList.add("pensamento-conteudo");
  return divConteudo;
}

function criarDivAutoria(autoria) {
  const divAutoria = document.createElement("div");
  divAutoria.textContent = autoria;
  divAutoria.classList.add("pensamento-autoria");
  return divAutoria;
}

function criarDivIcones(pensamentoId) {
  const divIcones = document.createElement("div");
  divIcones.classList.add("icones");
  divIcones.appendChild(criarBotaoEditar(pensamentoId));
  divIcones.appendChild(criarBotaoExcluir(pensamentoId));
  return divIcones;
}

function criarBotaoEditar(pensamentoId) {
  const botaoEditar = document.createElement("button");
  botaoEditar.classList.add("botao-editar");
  const imagemEditar = document.createElement("img");
  imagemEditar.src = "assets/imagens/icone-editar.png";
  imagemEditar.alt = "Editar";
  botaoEditar.appendChild(imagemEditar);
  botaoEditar.onclick = () => carregarPensamentoParaEdicao(pensamentoId);
  return botaoEditar;
}

function carregarPensamentoParaEdicao(pensamentoId) {
  console.log("editando pensamento", pensamentoId);
  uiHelperInstance.scrollParaFormulario();
  pensamentoServiceInstance
    .buscarPorId(pensamentoId)
    .then((resposta) => {
      console.log("pensamento carregado para edição");
      console.log(resposta);
      formularioHelperInstance.preencher(resposta.data);
      console.log("formulário preenchido");
    })
    .catch((erro) => {
      console.log("erro ao buscar pensamento");
      console.log(erro);
      uiHelperInstance.exibirMensagem("Erro ao buscar pensamento");
    });
}

function criarBotaoExcluir(pensamentoId) {
  const botaoExcluir = document.createElement("button");
  botaoExcluir.classList.add("botao-excluir");
  const imagemExcluir = document.createElement("img");
  imagemExcluir.src = "assets/imagens/icone-excluir.png";
  imagemExcluir.alt = "Excluir";
  botaoExcluir.appendChild(imagemExcluir);
  botaoExcluir.onclick = () => confirmarExclusao(pensamentoId);
  return botaoExcluir;
}

function confirmarExclusao(pensamentoId) {
  console.log("excluindo pensamento", pensamentoId);
  const confirmado = confirm("Tem certeza que deseja excluir?");
  if (confirmado) {
    excluirPensamento(pensamentoId);
  } else {
    console.log("exclusão cancelada");
  }
}

function excluirPensamento(pensamentoId) {
  pensamentoServiceInstance
    .excluir(pensamentoId)
    .then((resposta) => {
      console.log("excluído com sucesso");
      console.log(resposta);
      uiHelperInstance.exibirMensagem("Pensamento excluído!");
      carregarPensamentos();
    })
    .catch((erro) => {
      console.log("erro ao excluir");
      console.log(erro);
      uiHelperInstance.exibirMensagem("Erro ao excluir");
    });
}

/**
 * Função de inicialização chamada quando o DOM é carregado.
 */
function iniciarAplicacao() {
  console.log("DOM carregado");
  inicializarAplicacao();
  console.log("inicialização completa");
}

// Aguarda o DOM estar pronto antes de inicializar
document.addEventListener("DOMContentLoaded", iniciarAplicacao);
