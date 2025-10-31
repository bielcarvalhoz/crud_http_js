var url = "http://localhost:3000";
var lista;
var msg;
var form1;
var btn1;
var btn2;
var campo1;
var campo2;
var campo3;

function init() {
  console.log("iniciando aplicação...");
  lista = document.getElementById("lista-pensamentos");
  msg = document.getElementById("mensagem-vazia");
  form1 = document.getElementById("pensamento-form");
  btn1 = document.getElementById("botao-salvar");
  btn2 = document.getElementById("botao-cancelar");
  campo1 = document.getElementById("pensamento-id");
  campo2 = document.getElementById("pensamento-conteudo");
  campo3 = document.getElementById("pensamento-autoria");

  console.log("elementos carregados");

  carregarTudo();

  form1.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("formulário submetido");

    var id = campo1.value;
    var conteudo = campo2.value;
    var autoria = campo3.value;

    console.log("id:", id);
    console.log("conteudo:", conteudo);
    console.log("autoria:", autoria);

    if (id != "") {
      console.log("modo edição");
      axios
        .put(url + "/pensamentos/" + id, {
          id: id,
          conteudo: conteudo,
          autoria: autoria,
        })
        .then(function (response) {
          console.log("editado com sucesso");
          console.log(response);
          alert("Pensamento editado!");
          campo1.value = "";
          campo2.value = "";
          campo3.value = "";
          carregarTudo();
        })
        .catch(function (error) {
          console.log("erro ao editar");
          console.log(error);
          alert("Erro ao editar");
        });
    } else {
      console.log("modo criação");
      axios
        .post(url + "/pensamentos", {
          conteudo: conteudo,
          autoria: autoria,
        })
        .then(function (response) {
          console.log("criado com sucesso");
          console.log(response);
          alert("Pensamento adicionado!");
          campo1.value = "";
          campo2.value = "";
          campo3.value = "";
          carregarTudo();
        })
        .catch(function (error) {
          console.log("erro ao criar");
          console.log(error);
          alert("Erro ao criar pensamento");
        });
    }
  });

  btn2.addEventListener("click", function () {
    console.log("cancelar clicado");
    campo1.value = "";
    campo2.value = "";
    campo3.value = "";
    console.log("formulário limpo");
  });
}

function carregarTudo() {
  console.log("carregando pensamentos...");
  axios
    .get(url + "/pensamentos")
    .then(function (response) {
      console.log("pensamentos carregados");
      console.log(response);
      var data = response.data;
      console.log("total:", data.length);

      lista.innerHTML = "";

      if (data.length == 0) {
        console.log("lista vazia");
        msg.style.display = "block";
      } else {
        console.log("mostrando pensamentos");
        msg.style.display = "none";

        for (var i = 0; i < data.length; i++) {
          console.log("adicionando pensamento", i);
          var p = data[i];

          var li = document.createElement("li");
          li.setAttribute("data-id", p.id);
          li.classList.add("li-pensamento");

          var img1 = document.createElement("img");
          img1.src = "assets/imagens/aspas-azuis.png";
          img1.alt = "Aspas azuis";
          img1.classList.add("icone-aspas");

          var div1 = document.createElement("div");
          div1.textContent = p.conteudo;
          div1.classList.add("pensamento-conteudo");

          var div2 = document.createElement("div");
          div2.textContent = p.autoria;
          div2.classList.add("pensamento-autoria");

          var btn_edit = document.createElement("button");
          btn_edit.classList.add("botao-editar");

          (function (id_atual) {
            btn_edit.onclick = function () {
              console.log("editando pensamento", id_atual);
              document.querySelector("h2").scrollIntoView({ behavior: "smooth" });

              axios
                .get(url + "/pensamentos/" + id_atual)
                .then(function (response) {
                  console.log("pensamento carregado para edição");
                  console.log(response);
                  var pensamento = response.data;
                  campo1.value = pensamento.id;
                  campo2.value = pensamento.conteudo;
                  campo3.value = pensamento.autoria;
                  console.log("formulário preenchido");
                })
                .catch(function (error) {
                  console.log("erro ao buscar pensamento");
                  console.log(error);
                  alert("Erro ao buscar pensamento");
                });
            };
          })(p.id);

          var img_edit = document.createElement("img");
          img_edit.src = "assets/imagens/icone-editar.png";
          img_edit.alt = "Editar";
          btn_edit.appendChild(img_edit);

          var btn_del = document.createElement("button");
          btn_del.classList.add("botao-excluir");

          (function (id_atual) {
            btn_del.onclick = function () {
              console.log("excluindo pensamento", id_atual);
              if (confirm("Tem certeza que deseja excluir?")) {
                axios
                  .delete(url + "/pensamentos/" + id_atual)
                  .then(function (response) {
                    console.log("excluído com sucesso");
                    console.log(response);
                    alert("Pensamento excluído!");
                    carregarTudo();
                  })
                  .catch(function (error) {
                    console.log("erro ao excluir");
                    console.log(error);
                    alert("Erro ao excluir");
                  });
              } else {
                console.log("exclusão cancelada");
              }
            };
          })(p.id);

          var img_del = document.createElement("img");
          img_del.src = "assets/imagens/icone-excluir.png";
          img_del.alt = "Excluir";
          btn_del.appendChild(img_del);

          var div_icones = document.createElement("div");
          div_icones.classList.add("icones");
          div_icones.appendChild(btn_edit);
          div_icones.appendChild(btn_del);

          li.appendChild(img1);
          li.appendChild(div1);
          li.appendChild(div2);
          li.appendChild(div_icones);

          lista.appendChild(li);
          console.log("pensamento adicionado ao DOM");
        }
      }

      console.log("renderização completa");
    })
    .catch(function (error) {
      console.log("erro ao carregar pensamentos");
      console.log(error);
      alert("Erro ao carregar pensamentos");
    });
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM carregado");
  init();
  console.log("inicialização completa");
});
