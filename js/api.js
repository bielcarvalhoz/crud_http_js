const URL_BASE = "http://localhost:3000";

const api = {
  async buscarPensamentos() {
    try {
      const response = await axios.get(`${URL_BASE}/pensamentos`);
      return await response.data;
    } catch (error) {
      alert(`Erro ao buscar pensamentos ${error}`);
      throw error;
    }
  },

  async salvarPensamento(pensamento) {
    try {
      const response = await axios.post(`${URL_BASE}/pensamentos`, pensamento);
      return await response.data;
    } catch (error) {
      console.log(error);
      alert(`Erro ao salvar pensamento ${error}`);
      throw error;
    }
  },

  async buscarPensamentoPorId(id) {
    try {
      const response = await axios.get(`${URL_BASE}/pensamentos/${id}`);
      return await response.data;
    } catch (error) {
      alert(`Erro ao buscar pensamento ${error}`);
      throw error;
    }
  },

  async editarPensamento(pensamento) {
    try {
      const response = await axios.put(`${URL_BASE}/pensamentos/${pensamento.id}`, pensamento);
      return await response.data;
    } catch {
      alert("Erro ao editar pensamento");
      throw error;
    }
  },

  async excluirPensamento(id) {
    try {
      const response = await axios.delete(`${URL_BASE}/pensamentos/${id}`);
    } catch {
      alert("Erro ao excluir um pensamento");
      throw error;
    }
  },
};

export default api;
