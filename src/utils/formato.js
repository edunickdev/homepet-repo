const formatoPesos = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export function pesos(valor) {
  return formatoPesos.format(Number(valor) || 0);
}

export function iniciales(nombre = '') {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((palabra) => palabra[0].toUpperCase())
    .join('');
}

export function coincide(texto, busqueda) {
  return String(texto ?? '').toLowerCase().includes(busqueda.trim().toLowerCase());
}
