import { useCallback, useEffect, useState } from 'react';

export function useColeccion(api, filtros) {
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const claveFiltros = JSON.stringify(filtros ?? {});

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      setItems(await api.listar(JSON.parse(claveFiltros)));
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, [api, claveFiltros]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function crear(datos) {
    const nuevo = await api.crear(datos);
    setItems((actuales) => [...actuales, nuevo]);
    return nuevo;
  }

  async function actualizar(id, datos) {
    const actualizado = await api.actualizar(id, datos);
    setItems((actuales) => actuales.map((item) => (item.id === id ? actualizado : item)));
    return actualizado;
  }

  async function eliminar(id) {
    await api.eliminar(id);
    setItems((actuales) => actuales.filter((item) => item.id !== id));
  }

  return { items, cargando, error, crear, actualizar, eliminar, recargar: cargar };
}
