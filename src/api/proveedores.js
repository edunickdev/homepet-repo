import { crearRecurso } from './cliente';

export const proveedoresApi = crearRecurso('proveedores');

export async function buscarProveedorPorCorreo(correo) {
  const resultado = await proveedoresApi.listar({ correo: correo.trim().toLowerCase() });
  return resultado[0] ?? null;
}
