const api = {
    async buscarPensamentos() {
        try {
            const response = await fetch("http://localhost:3000/pensamentos");
            return response.json;
        } catch (error) {
            alert(`Erro ao buscar pensamentos ${error}`);
        }
    },
};

export default api;
