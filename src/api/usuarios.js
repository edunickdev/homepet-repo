import { crearRecurso } from './cliente';

export const usuariosApi = crearRecurso('usuarios');

export async function buscarPorCorreo(correo) {
  const resultado = await usuariosApi.listar({ correo: correo.trim().toLowerCase() });
  return resultado[0] ?? null;
}
