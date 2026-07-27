import api from './api';

const metadataService = {
  getFacultadesYCarreras: async () => {
    try {
      const response = await api.get('/metadata/facultades');
      return response.data;
    } catch (error) {
      console.error('Error fetching metadata:', error);
      return { result: false, message: 'Error de red' };
    }
  }
};

export default metadataService;
