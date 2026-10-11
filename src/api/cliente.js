const URL_BASE = '/api';

async function peticion(ruta, opciones = {}) {
  let respuesta;

  try {
    respuesta = await fetch(`${URL_BASE}${ruta}`, {
      headers: { 'Content-Type': 'application/json' },
      ...opciones,
    });
  } catch {
    throw new Error('No hay conexión con el servidor de datos. Ejecuta npm run dev.');
  }

  if (!respuesta.ok) {
    throw new Error(`El servidor respondió con el código ${respuesta.status}.`);
  }

  return respuesta.status === 204 ? null : respuesta.json();
}

export function crearRecurso(nombre) {
  return {
    listar: (filtros = {}) => {
      const parametros = new URLSearchParams(filtros).toString();
      return peticion(`/${nombre}${parametros ? `?${parametros}` : ''}`);
    },
    obtener: (id) => peticion(`/${nombre}/${id}`),
    crear: (datos) => peticion(`/${nombre}`, { method: 'POST', body: JSON.stringify(datos) }),
    actualizar: (id, datos) => peticion(`/${nombre}/${id}`, { method: 'PATCH', body: JSON.stringify(datos) }),
    eliminar: (id) => peticion(`/${nombre}/${id}`, { method: 'DELETE' }),
  };
}
