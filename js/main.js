import ui from "./ui.js";
import api from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  ui.renderizarPensamentos();

  const formularioPensamento = document.getElementById("pensamento-form");
  const botaoCancelar = document.getElementById("botao-cancelar");
  formularioPensamento.addEventListener("submit", manipularSubmissaoFormulario);
  botaoCancelar.addEventListener("click", ui.limparFormulario);
});

async function manipularSubmissaoFormulario(event) {
  event.preventDefault();
  // const id = document.getElementById("pensamento-id").value;
  const conteudo = document.getElementById("pensamento-conteudo").value;
  const autoria = document.getElementById("pensamento-autoria").value;

  try {
    await api.salvarPensamentos({ conteudo, autoria });
    ui.renderizarPensamentos();
  } catch (error) {
    alert("Erro ao salvar pensamento");
  }
}
