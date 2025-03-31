import ui from "./ui.js";
import api from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  ui.renderizarPensamentos();

  const formularioPensamento = document.getElementById("pensamento-form");
  formularioPensamento.addEventListener("submit", manipularSubmissaoFormulario);
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
