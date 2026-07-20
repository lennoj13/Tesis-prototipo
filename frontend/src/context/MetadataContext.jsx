import { createContext, useContext, useState, useEffect } from 'react';
import metadataService from '../services/metadataService';

const MetadataContext = createContext(null);

export function MetadataProvider({ children }) {
  const [facultadNames, setFacultadNames] = useState({});
  const [facultadesCarreras, setFacultadesCarreras] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await metadataService.getFacultadesYCarreras();
        if (response.result && response.data) {
          setFacultadNames(response.data.facultades || {});
          setFacultadesCarreras(response.data.facultades_carreras || {});
        }
      } catch (err) {
        console.error('Error cargando metadatos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  return (
    <MetadataContext.Provider value={{ facultadNames, facultadesCarreras, metadataLoading: loading }}>
      {children}
    </MetadataContext.Provider>
  );
}

export function useMetadata() {
  const context = useContext(MetadataContext);
  if (!context) {
    throw new Error('useMetadata debe usarse dentro de un MetadataProvider');
  }
  return context;
}
