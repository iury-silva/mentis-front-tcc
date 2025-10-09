export const brasilApiService = {
  getStates: async () => {
    const response = await fetch("https://brasilapi.com.br/api/ibge/uf/v1");
    return response.json();
  },
  getCities: async (stateUf: string) => {
    const response = await fetch(
      `https://brasilapi.com.br/api/ibge/municipios/v1/${stateUf}?providers=dados-abertos-br,gov,wikipedia`
    );
    return response.json();
  },
};
