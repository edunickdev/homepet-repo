import { crearRecurso } from './cliente';

const recursoBase = crearRecurso('configuracion');

export const configuracionApi = {
  ...recursoBase,
  async obtenerActual() {
    const items = await recursoBase.listar();
    return items?.[0] ?? { id: 1, porcentajeComision: 15 };
  },
  async actualizarComision(porcentajeComision, actualizadoPor = 'Administrador') {
    return recursoBase.actualizar(1, {
      porcentajeComision: Number(porcentajeComision),
      actualizadoEn: new Date().toISOString(),
      actualizadoPor,
    });
  },
};
