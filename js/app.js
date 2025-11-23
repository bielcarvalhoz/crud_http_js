const API_BASE_URL = "http://localhost:3000";
let listaPensamentosElement;
let mensagemVaziaElement;
let formularioPensamento;
let botaoSalvar;
let botaoCancelar;
let inputPensamentoId;
let textareaPensamentoConteudo;
let inputPensamentoAutoria;

function limparFormulario() {
  inputPensamentoId.value = "";
  textareaPensamentoConteudo.value = "";
  inputPensamentoAutoria.value = "";
}

function exibirMensagem(mensagem) {
  alert(mensagem);
}

function obterDadosFormulario() {
  return {
    id: inputPensamentoId.value,
    conteudo: textareaPensamentoConteudo.value,
    autoria: inputPensamentoAutoria.value,
  };
}

function preencherFormulario(pensamento) {
  inputPensamentoId.value = pensamento.id;
  textareaPensamentoConteudo.value = pensamento.conteudo;
  inputPensamentoAutoria.value = pensamento.autoria;
}

function exibirMensagemVazia() {
  mensagemVaziaElement.style.display = "block";
}

function ocultarMensagemVazia() {
  mensagemVaziaElement.style.display = "none";
}

function limparListaPensamentos() {
  listaPensamentosElement.innerHTML = "";
}

function inicializarAplicacao() {
  console.log("iniciando aplicação...");
  listaPensamentosElement = document.getElementById("lista-pensamentos");
  mensagemVaziaElement = document.getElementById("mensagem-vazia");
  formularioPensamento = document.getElementById("pensamento-form");
  botaoSalvar = document.getElementById("botao-salvar");
  botaoCancelar = document.getElementById("botao-cancelar");
  inputPensamentoId = document.getElementById("pensamento-id");
  textareaPensamentoConteudo = document.getElementById("pensamento-conteudo");
  inputPensamentoAutoria = document.getElementById("pensamento-autoria");

  console.log("elementos carregados");

  carregarPensamentos();
  configurarEventListeners();
}

function configurarEventListeners() {
  formularioPensamento.addEventListener("submit", manipularSubmissaoFormulario);
  botaoCancelar.addEventListener("click", manipularCancelamento);
}

function manipularSubmissaoFormulario(evento) {
  evento.preventDefault();
  console.log("formulário submetido");

  const dados = obterDadosFormulario();
  console.log("id:", dados.id);
  console.log("conteudo:", dados.conteudo);
  console.log("autoria:", dados.autoria);

  if (dados.id !== "") {
    editarPensamento(dados);
  } else {
    criarPensamento(dados);
  }
}

function criarPensamento(dados) {
  console.log("modo criação");
  axios
    .post(API_BASE_URL + "/pensamentos", {
      conteudo: dados.conteudo,
      autoria: dados.autoria,
    })
    .then(function (resposta) {
      console.log("criado com sucesso");
      console.log(resposta);
      exibirMensagem("Pensamento adicionado!");
      limparFormulario();
      carregarPensamentos();
    })
    .catch(function (erro) {
      console.log("erro ao criar");
      console.log(erro);
      exibirMensagem("Erro ao criar pensamento");
    });
}

function editarPensamento(dados) {
  console.log("modo edição");
  axios
    .put(API_BASE_URL + "/pensamentos/" + dados.id, {
      id: dados.id,
      conteudo: dados.conteudo,
      autoria: dados.autoria,
    })
    .then(function (resposta) {
      console.log("editado com sucesso");
      console.log(resposta);
      exibirMensagem("Pensamento editado!");
      limparFormulario();
      carregarPensamentos();
    })
    .catch(function (erro) {
      console.log("erro ao editar");
      console.log(erro);
      exibirMensagem("Erro ao editar");
    });
}

function manipularCancelamento() {
  console.log("cancelar clicado");
  limparFormulario();
  console.log("formulário limpo");
}

function carregarPensamentos() {
  console.log("carregando pensamentos...");
  axios
    .get(API_BASE_URL + "/pensamentos")
    .then(function (resposta) {
      console.log("pensamentos carregados");
      console.log(resposta);
      const pensamentos = resposta.data;
      console.log("total:", pensamentos.length);

      renderizarListaPensamentos(pensamentos);
    })
    .catch(function (erro) {
      console.log("erro ao carregar pensamentos");
      console.log(erro);
      exibirMensagem("Erro ao carregar pensamentos");
    });
}

function renderizarListaPensamentos(pensamentos) {
  limparListaPensamentos();

  if (pensamentos.length === 0) {
    console.log("lista vazia");
    exibirMensagemVazia();
  } else {
    console.log("mostrando pensamentos");
    ocultarMensagemVazia();

    pensamentos.forEach(function (pensamento, index) {
      console.log("adicionando pensamento", index);
      const itemLista = criarElementoPensamento(pensamento);
      listaPensamentosElement.appendChild(itemLista);
      console.log("pensamento adicionado ao DOM");
    });

    console.log("renderização completa");
  }
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

  botaoEditar.onclick = function () {
    manipularEdicao(pensamentoId);
  };

  return botaoEditar;
}

function manipularEdicao(pensamentoId) {
  console.log("editando pensamento", pensamentoId);
  document.querySelector("h2").scrollIntoView({ behavior: "smooth" });

  axios
    .get(API_BASE_URL + "/pensamentos/" + pensamentoId)
    .then(function (resposta) {
      console.log("pensamento carregado para edição");
      console.log(resposta);
      const pensamentoParaEditar = resposta.data;
      preencherFormulario(pensamentoParaEditar);
      console.log("formulário preenchido");
    })
    .catch(function (erro) {
      console.log("erro ao buscar pensamento");
      console.log(erro);
      exibirMensagem("Erro ao buscar pensamento");
    });
}

function criarBotaoExcluir(pensamentoId) {
  const botaoExcluir = document.createElement("button");
  botaoExcluir.classList.add("botao-excluir");

  const imagemExcluir = document.createElement("img");
  imagemExcluir.src = "assets/imagens/icone-excluir.png";
  imagemExcluir.alt = "Excluir";
  botaoExcluir.appendChild(imagemExcluir);

  botaoExcluir.onclick = function () {
    manipularExclusao(pensamentoId);
  };

  return botaoExcluir;
}

function manipularExclusao(pensamentoId) {
  console.log("excluindo pensamento", pensamentoId);
  if (confirm("Tem certeza que deseja excluir?")) {
    excluirPensamento(pensamentoId);
  } else {
    console.log("exclusão cancelada");
  }
}

function excluirPensamento(pensamentoId) {
  axios
    .delete(API_BASE_URL + "/pensamentos/" + pensamentoId)
    .then(function (resposta) {
      console.log("excluído com sucesso");
      console.log(resposta);
      exibirMensagem("Pensamento excluído!");
      carregarPensamentos();
    })
    .catch(function (erro) {
      console.log("erro ao excluir");
      console.log(erro);
      exibirMensagem("Erro ao excluir");
    });
}

function iniciarAplicacao() {
  console.log("DOM carregado");
  inicializarAplicacao();
  console.log("inicialização completa");
}

document.addEventListener("DOMContentLoaded", iniciarAplicacao);
