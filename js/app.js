const API_BASE_URL = "http://localhost:3000";
const ENDPOINTS = {
  pensamentos: `${API_BASE_URL}/pensamentos`,
  pensamentoById: (id) => `${API_BASE_URL}/pensamentos/${id}`,
};

let elementosDOM = {};

const PensamentoService = {
  buscarTodos() {
    return axios.get(ENDPOINTS.pensamentos);
  },

  buscarPorId(id) {
    return axios.get(ENDPOINTS.pensamentoById(id));
  },

  criar(pensamento) {
    return axios.post(ENDPOINTS.pensamentos, pensamento);
  },

  atualizar(id, pensamento) {
    return axios.put(ENDPOINTS.pensamentoById(id), pensamento);
  },

  excluir(id) {
    return axios.delete(ENDPOINTS.pensamentoById(id));
  },
};

const FormularioHelper = {
  limpar() {
    elementosDOM.inputId.value = "";
    elementosDOM.textareaConteudo.value = "";
    elementosDOM.inputAutoria.value = "";
  },

  obterDados() {
    return {
      id: elementosDOM.inputId.value,
      conteudo: elementosDOM.textareaConteudo.value,
      autoria: elementosDOM.inputAutoria.value,
    };
  },

  preencher(pensamento) {
    elementosDOM.inputId.value = pensamento.id;
    elementosDOM.textareaConteudo.value = pensamento.conteudo;
    elementosDOM.inputAutoria.value = pensamento.autoria;
  },

  estaEmModoEdicao() {
    return elementosDOM.inputId.value !== "";
  },
};

const UIHelper = {
  exibirMensagem(mensagem) {
    alert(mensagem);
  },

  exibirMensagemVazia() {
    elementosDOM.mensagemVazia.style.display = "block";
  },

  ocultarMensagemVazia() {
    elementosDOM.mensagemVazia.style.display = "none";
  },

  limparLista() {
    elementosDOM.listaPensamentos.innerHTML = "";
  },

  scrollParaFormulario() {
    document.querySelector("h2").scrollIntoView({ behavior: "smooth" });
  },
};

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
}

function configurarEventListeners() {
  elementosDOM.formulario.addEventListener("submit", manipularSubmissaoFormulario);
  elementosDOM.botaoCancelar.addEventListener("click", manipularCancelamento);
}

function manipularSubmissaoFormulario(evento) {
  evento.preventDefault();
  console.log("formulário submetido");

  const dados = FormularioHelper.obterDados();
  console.log("id:", dados.id);
  console.log("conteudo:", dados.conteudo);
  console.log("autoria:", dados.autoria);

  if (FormularioHelper.estaEmModoEdicao()) {
    console.log("modo edição");
    atualizarPensamento(dados);
  } else {
    console.log("modo criação");
    salvarNovoPensamento(dados);
  }
}

function salvarNovoPensamento(dados) {
  const pensamento = {
    conteudo: dados.conteudo,
    autoria: dados.autoria,
  };

  PensamentoService.criar(pensamento)
    .then((resposta) => {
      console.log("criado com sucesso");
      console.log(resposta);
      UIHelper.exibirMensagem("Pensamento adicionado!");
      FormularioHelper.limpar();
      carregarPensamentos();
    })
    .catch((erro) => {
      console.log("erro ao criar");
      console.log(erro);
      UIHelper.exibirMensagem("Erro ao criar pensamento");
    });
}

function atualizarPensamento(dados) {
  const pensamento = {
    id: dados.id,
    conteudo: dados.conteudo,
    autoria: dados.autoria,
  };

  PensamentoService.atualizar(dados.id, pensamento)
    .then((resposta) => {
      console.log("editado com sucesso");
      console.log(resposta);
      UIHelper.exibirMensagem("Pensamento editado!");
      FormularioHelper.limpar();
      carregarPensamentos();
    })
    .catch((erro) => {
      console.log("erro ao editar");
      console.log(erro);
      UIHelper.exibirMensagem("Erro ao editar");
    });
}

function manipularCancelamento() {
  console.log("cancelar clicado");
  FormularioHelper.limpar();
  console.log("formulário limpo");
}

function carregarPensamentos() {
  console.log("carregando pensamentos...");
  PensamentoService.buscarTodos()
    .then((resposta) => {
      console.log("pensamentos carregados");
      console.log(resposta);
      console.log("total:", resposta.data.length);
      renderizarListaPensamentos(resposta.data);
    })
    .catch((erro) => {
      console.log("erro ao carregar pensamentos");
      console.log(erro);
      UIHelper.exibirMensagem("Erro ao carregar pensamentos");
    });
}

function renderizarListaPensamentos(pensamentos) {
  UIHelper.limparLista();

  if (pensamentos.length === 0) {
    console.log("lista vazia");
    UIHelper.exibirMensagemVazia();
    return;
  }

  console.log("mostrando pensamentos");
  UIHelper.ocultarMensagemVazia();
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

  const iconeAspas = criarIconeAspas();
  const divConteudo = criarDivConteudo(pensamento.conteudo);
  const divAutoria = criarDivAutoria(pensamento.autoria);
  const divIcones = criarDivIcones(pensamento.id);

  itemLista.appendChild(iconeAspas);
  itemLista.appendChild(divConteudo);
  itemLista.appendChild(divAutoria);
  itemLista.appendChild(divIcones);

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

  const botaoEditar = criarBotaoEditar(pensamentoId);
  const botaoExcluir = criarBotaoExcluir(pensamentoId);

  divIcones.appendChild(botaoEditar);
  divIcones.appendChild(botaoExcluir);

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
  UIHelper.scrollParaFormulario();

  PensamentoService.buscarPorId(pensamentoId)
    .then((resposta) => {
      console.log("pensamento carregado para edição");
      console.log(resposta);
      FormularioHelper.preencher(resposta.data);
      console.log("formulário preenchido");
    })
    .catch((erro) => {
      console.log("erro ao buscar pensamento");
      console.log(erro);
      UIHelper.exibirMensagem("Erro ao buscar pensamento");
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
  PensamentoService.excluir(pensamentoId)
    .then((resposta) => {
      console.log("excluído com sucesso");
      console.log(resposta);
      UIHelper.exibirMensagem("Pensamento excluído!");
      carregarPensamentos();
    })
    .catch((erro) => {
      console.log("erro ao excluir");
      console.log(erro);
      UIHelper.exibirMensagem("Erro ao excluir");
    });
}

function iniciarAplicacao() {
  console.log("DOM carregado");
  inicializarAplicacao();
  console.log("inicialização completa");
}

document.addEventListener("DOMContentLoaded", iniciarAplicacao);
