const MODULOS_POR_ROL = {
  propietario: ['mascotas', 'servicios', 'reservas'],
  proveedor: ['servicios', 'reservas', 'pagos', 'reportes'],
  administrador: ['usuarios', 'servicios', 'proveedores', 'reservas', 'pagos', 'reportes', 'configuracion'],
};

const PAGINA_INICIAL_POR_ROL = {
  propietario: '/mascotas',
  proveedor: '/servicios',
  administrador: '/usuarios',
};

export function puedeAcceder(usuario, modulo) {
  if (!usuario) return false;
  return MODULOS_POR_ROL[usuario.rol]?.includes(modulo) ?? false;
}

export function puedeGestionarServicios(usuario) {
  return usuario?.rol === 'administrador' || usuario?.rol === 'proveedor';
}

export function esProveedor(usuario) {
  return usuario?.rol === 'proveedor';
}

export function paginaInicial(usuario) {
  return PAGINA_INICIAL_POR_ROL[usuario?.rol] ?? '/';
}
