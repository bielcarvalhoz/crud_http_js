const API_BASE_URL = "http://localhost:3000";
let listaPensamentosElement;
let mensagemVaziaElement;
let formularioPensamento;
let botaoSalvar;
let botaoCancelar;
let inputPensamentoId;
let textareaPensamentoConteudo;
let inputPensamentoAutoria;

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

  formularioPensamento.addEventListener("submit", function (evento) {
    evento.preventDefault();
    console.log("formulário submetido");

    const pensamentoId = inputPensamentoId.value;
    const pensamentoConteudo = textareaPensamentoConteudo.value;
    const pensamentoAutoria = inputPensamentoAutoria.value;

    console.log("id:", pensamentoId);
    console.log("conteudo:", pensamentoConteudo);
    console.log("autoria:", pensamentoAutoria);

    if (pensamentoId != "") {
      console.log("modo edição");
      axios
        .put(API_BASE_URL + "/pensamentos/" + pensamentoId, {
          id: pensamentoId,
          conteudo: pensamentoConteudo,
          autoria: pensamentoAutoria,
        })
        .then(function (resposta) {
          console.log("editado com sucesso");
          console.log(resposta);
          alert("Pensamento editado!");
          inputPensamentoId.value = "";
          textareaPensamentoConteudo.value = "";
          inputPensamentoAutoria.value = "";
          carregarPensamentos();
        })
        .catch(function (erro) {
          console.log("erro ao editar");
          console.log(erro);
          alert("Erro ao editar");
        });
    } else {
      console.log("modo criação");
      axios
        .post(API_BASE_URL + "/pensamentos", {
          conteudo: pensamentoConteudo,
          autoria: pensamentoAutoria,
        })
        .then(function (resposta) {
          console.log("criado com sucesso");
          console.log(resposta);
          alert("Pensamento adicionado!");
          inputPensamentoId.value = "";
          textareaPensamentoConteudo.value = "";
          inputPensamentoAutoria.value = "";
          carregarPensamentos();
        })
        .catch(function (erro) {
          console.log("erro ao criar");
          console.log(erro);
          alert("Erro ao criar pensamento");
        });
    }
  });

  botaoCancelar.addEventListener("click", function () {
    console.log("cancelar clicado");
    inputPensamentoId.value = "";
    textareaPensamentoConteudo.value = "";
    inputPensamentoAutoria.value = "";
    console.log("formulário limpo");
  });
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

      listaPensamentosElement.innerHTML = "";

      if (pensamentos.length == 0) {
        console.log("lista vazia");
        mensagemVaziaElement.style.display = "block";
      } else {
        console.log("mostrando pensamentos");
        mensagemVaziaElement.style.display = "none";

        for (let i = 0; i < pensamentos.length; i++) {
          console.log("adicionando pensamento", i);
          const pensamento = pensamentos[i];

          const itemLista = document.createElement("li");
          itemLista.setAttribute("data-id", pensamento.id);
          itemLista.classList.add("li-pensamento");

          const iconeAspas = document.createElement("img");
          iconeAspas.src = "assets/imagens/aspas-azuis.png";
          iconeAspas.alt = "Aspas azuis";
          iconeAspas.classList.add("icone-aspas");

          const divConteudo = document.createElement("div");
          divConteudo.textContent = pensamento.conteudo;
          divConteudo.classList.add("pensamento-conteudo");

          const divAutoria = document.createElement("div");
          divAutoria.textContent = pensamento.autoria;
          divAutoria.classList.add("pensamento-autoria");

          const botaoEditar = document.createElement("button");
          botaoEditar.classList.add("botao-editar");

          (function (pensamentoIdAtual) {
            botaoEditar.onclick = function () {
              console.log("editando pensamento", pensamentoIdAtual);
              document.querySelector("h2").scrollIntoView({ behavior: "smooth" });

              axios
                .get(API_BASE_URL + "/pensamentos/" + pensamentoIdAtual)
                .then(function (resposta) {
                  console.log("pensamento carregado para edição");
                  console.log(resposta);
                  const pensamentoParaEditar = resposta.data;
                  inputPensamentoId.value = pensamentoParaEditar.id;
                  textareaPensamentoConteudo.value = pensamentoParaEditar.conteudo;
                  inputPensamentoAutoria.value = pensamentoParaEditar.autoria;
                  console.log("formulário preenchido");
                })
                .catch(function (erro) {
                  console.log("erro ao buscar pensamento");
                  console.log(erro);
                  alert("Erro ao buscar pensamento");
                });
            };
          })(pensamento.id);

          const imagemEditar = document.createElement("img");
          imagemEditar.src = "assets/imagens/icone-editar.png";
          imagemEditar.alt = "Editar";
          botaoEditar.appendChild(imagemEditar);

          const botaoExcluir = document.createElement("button");
          botaoExcluir.classList.add("botao-excluir");

          (function (pensamentoIdAtual) {
            botaoExcluir.onclick = function () {
              console.log("excluindo pensamento", pensamentoIdAtual);
              if (confirm("Tem certeza que deseja excluir?")) {
                axios
                  .delete(API_BASE_URL + "/pensamentos/" + pensamentoIdAtual)
                  .then(function (resposta) {
                    console.log("excluído com sucesso");
                    console.log(resposta);
                    alert("Pensamento excluído!");
                    carregarPensamentos();
                  })
                  .catch(function (erro) {
                    console.log("erro ao excluir");
                    console.log(erro);
                    alert("Erro ao excluir");
                  });
              } else {
                console.log("exclusão cancelada");
              }
            };
          })(pensamento.id);

          const imagemExcluir = document.createElement("img");
          imagemExcluir.src = "assets/imagens/icone-excluir.png";
          imagemExcluir.alt = "Excluir";
          botaoExcluir.appendChild(imagemExcluir);

          const divIcones = document.createElement("div");
          divIcones.classList.add("icones");
          divIcones.appendChild(botaoEditar);
          divIcones.appendChild(botaoExcluir);

          itemLista.appendChild(iconeAspas);
          itemLista.appendChild(divConteudo);
          itemLista.appendChild(divAutoria);
          itemLista.appendChild(divIcones);

          listaPensamentosElement.appendChild(itemLista);
          console.log("pensamento adicionado ao DOM");
        }
      }

      console.log("renderização completa");
    })
    .catch(function (erro) {
      console.log("erro ao carregar pensamentos");
      console.log(erro);
      alert("Erro ao carregar pensamentos");
    });
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM carregado");
  inicializarAplicacao();
  console.log("inicialização completa");
});
